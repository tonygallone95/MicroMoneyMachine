// scripts/slack-notifier.js
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

async function sendSlackNotification() {
    console.log('📢 Sending Slack notification...');
    
    try {
        const contentDir = 'generated-content';
        const contentFiles = await fs.readdir(contentDir);
        const contentDetails = await getContentDetails(contentDir, contentFiles);
        
        const approvalUrl = `https://github.com/${process.env.REPO}/actions/runs/${process.env.RUN_ID}`;
        const approveUrl = `https://github.com/${process.env.REPO}/actions/workflows/approval.yml`;
        
        const message = createSlackMessage(contentDetails, approvalUrl, approveUrl);
        
        const response = await axios.post(process.env.SLACK_WEBHOOK_URL, message, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 200) {
            console.log('✅ Slack notification sent successfully');
        } else {
            console.error('❌ Slack notification failed:', response.status);
        }
        
    } catch (error) {
        console.error('❌ Error sending Slack notification:', error.message);
        
        // Send a basic notification if detailed one fails
        await sendBasicNotification(error.message);
    }
}

async function getContentDetails(contentDir, contentFiles) {
    const details = [];
    
    for (const file of contentFiles) {
        if (file.endsWith('.md') && file !== 'SUMMARY.md') {
            try {
                const filePath = path.join(contentDir, file);
                const content = await fs.readFile(filePath, 'utf8');
                
                const metadata = extractMetadata(content);
                const stats = getContentStats(content);
                
                details.push({
                    filename: file,
                    ...metadata,
                    ...stats
                });
            } catch (error) {
                console.error(`Error reading ${file}:`, error.message);
            }
        }
    }
    
    return details;
}

function extractMetadata(content) {
    const metadataMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!metadataMatch) return {};
    
    const metadata = {};
    const lines = metadataMatch[1].split('\n');
    
    for (const line of lines) {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            const value = valueParts.join(':').trim().replace(/"/g, '');
            metadata[key.trim()] = value;
        }
    }
    
    return metadata;
}

function getContentStats(content) {
    const wordCount = content.split(/\s+/).length;
    const headingCount = (content.match(/^#+\s/gm) || []).length;
    const linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
    
    return {
        wordCount,
        headingCount,
        linkCount
    };
}

function createSlackMessage(contentDetails, approvalUrl, approveUrl) {
    const totalArticles = contentDetails.length;
    const totalWords = contentDetails.reduce((sum, detail) => sum + (detail.wordCount || 0), 0);
    
    const contentSummary = contentDetails.map(detail => 
        `• *${detail.keyword || detail.filename}* (${detail.contentType || 'Unknown'}) - ${detail.wordCount || 0} words`
    ).join('\n');

    return {
        text: "🤖 New Content Generated - Review Required",
        blocks: [
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: "📝 MicroMoneyMachine: Content Ready for Review",
                    emoji: true
                }
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*Articles Generated:*\n${totalArticles}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Total Word Count:*\n${totalWords.toLocaleString()}`
                    }
                ]
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Generated Content:*\n${contentSummary}`
                }
            },
            {
                type: "divider"
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "*Review the generated content and choose an action:*"
                }
            },
            {
                type: "actions",
                elements: [
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "✅ Approve & Deploy",
                            emoji: true
                        },
                        style: "primary",
                        url: `${approveUrl}?inputs.action=approve&inputs.run_id=${process.env.RUN_ID}`,
                        action_id: "approve_content"
                    },
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "👀 View Details",
                            emoji: true
                        },
                        url: approvalUrl,
                        action_id: "view_details"
                    },
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "❌ Reject",
                            emoji: true
                        },
                        style: "danger",
                        url: `${approveUrl}?inputs.action=reject&inputs.run_id=${process.env.RUN_ID}`,
                        action_id: "reject_content"
                    }
                ]
            },
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: `Run ID: ${process.env.RUN_ID} | Generated: ${new Date().toLocaleString()}`
                    }
                ]
            }
        ]
    };
}

async function sendBasicNotification(errorMessage) {
    try {
        const basicMessage = {
            text: "🤖 MicroMoneyMachine Content Pipeline",
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `⚠️ Content generated but notification details failed.\n\nError: ${errorMessage}\n\n<https://github.com/${process.env.REPO}/actions/runs/${process.env.RUN_ID}|View workflow details>`
                    }
                }
            ]
        };
        
        await axios.post(process.env.SLACK_WEBHOOK_URL, basicMessage);
        console.log('✅ Basic Slack notification sent');
    } catch (basicError) {
        console.error('❌ Failed to send basic notification:', basicError.message);
    }
}

// Run if called directly
if (require.main === module) {
    if (!process.env.SLACK_WEBHOOK_URL) {
        console.error('SLACK_WEBHOOK_URL environment variable is required');
        process.exit(1);
    }
    
    if (!process.env.RUN_ID || !process.env.REPO) {
        console.error('RUN_ID and REPO environment variables are required');
        process.exit(1);
    }
    
    sendSlackNotification().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { sendSlackNotification };