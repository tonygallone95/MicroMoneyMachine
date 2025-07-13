// scripts/wordpress-deployer.js
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

async function deployToWordPress() {
    console.log('🚀 Starting WordPress deployment...');
    
    try {
        const contentDir = 'generated-content';
        const contentFiles = await fs.readdir(contentDir);
        const markdownFiles = contentFiles.filter(file => file.endsWith('.md') && file !== 'SUMMARY.md');
        
        console.log(`Found ${markdownFiles.length} articles to deploy`);
        
        const deployedPosts = [];
        
        for (const file of markdownFiles) {
            try {
                const post = await deploySinglePost(contentDir, file);
                deployedPosts.push(post);
                console.log(`✅ Deployed: ${post.title} (ID: ${post.id})`);
            } catch (error) {
                console.error(`❌ Failed to deploy ${file}:`, error.message);
            }
        }
        
        await createDeploymentSummary(deployedPosts);
        console.log(`\n🎉 Deployment complete: ${deployedPosts.length}/${markdownFiles.length} articles deployed`);
        
    } catch (error) {
        console.error('❌ WordPress deployment failed:', error.message);
        process.exit(1);
    }
}

async function deploySinglePost(contentDir, filename) {
    const filePath = path.join(contentDir, filename);
    const content = await fs.readFile(filePath, 'utf8');
    
    const { metadata, htmlContent } = parseContentFile(content);
    const categoryId = await getCategoryId(metadata.contentType);
    const tags = await getOrCreateTags(metadata.keyword);
    
    const postData = {
        title: metadata.title || extractTitle(content),
        content: htmlContent,
        status: 'publish',
        categories: [categoryId],
        tags: tags,
        meta: {
            _yoast_wpseo_title: metadata.title,
            _yoast_wpseo_metadesc: generateMetaDescription(metadata.keyword, metadata.contentType),
            _yoast_wpseo_focuskw: metadata.keyword,
            _micromoneymachine_keyword: metadata.keyword,
            _micromoneymachine_gkr: metadata.gkr,
            _micromoneymachine_search_volume: metadata.searchVolume
        }
    };

    const auth = Buffer.from(`${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_APP_PASSWORD}`).toString('base64');
    
    const response = await axios.post(`${process.env.WORDPRESS_API_URL}/posts`, postData, {
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
        }
    });

    return {
        id: response.data.id,
        title: response.data.title.rendered,
        url: response.data.link,
        keyword: metadata.keyword,
        status: response.data.status
    };
}

function parseContentFile(content) {
    // Extract metadata from front matter
    const metadataMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    let metadata = {};
    let markdownContent = content;
    
    if (metadataMatch) {
        const metadataLines = metadataMatch[1].split('\n');
        markdownContent = metadataMatch[2];
        
        for (const line of metadataLines) {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                const value = valueParts.join(':').trim().replace(/"/g, '');
                metadata[key.trim()] = value;
            }
        }
    }
    
    // Convert markdown to HTML
    const htmlContent = convertMarkdownToHtml(markdownContent);
    
    return { metadata, htmlContent };
}

function convertMarkdownToHtml(markdown) {
    // Basic markdown to HTML conversion
    let html = markdown
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        // Line breaks
        .replace(/\n\n/g, '</p><p>')
        // Lists
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
        // Paragraphs
        .replace(/^(?!<[hul])/gm, '<p>')
        .replace(/(?<!>)$/gm, '</p>');
    
    // Clean up extra paragraph tags
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<[hul][^>]*>)/g, '$1');
    html = html.replace(/(<\/[hul][^>]*>)<\/p>/g, '$1');
    
    return html;
}

function extractTitle(content) {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1] : 'Untitled Post';
}

async function getCategoryId(contentType) {
    // Map content types to WordPress categories
    const categoryMap = {
        'single-review': 'Product Reviews',
        'comparison': 'Product Comparisons', 
        'top10': 'Best Of Lists',
        'default': 'Affiliate Reviews'
    };
    
    const categoryName = categoryMap[contentType] || categoryMap.default;
    
    try {
        const auth = Buffer.from(`${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_APP_PASSWORD}`).toString('base64');
        
        // Get existing categories
        const response = await axios.get(`${process.env.WORDPRESS_API_URL}/categories?search=${encodeURIComponent(categoryName)}`, {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });
        
        if (response.data.length > 0) {
            return response.data[0].id;
        }
        
        // Create category if it doesn't exist
        const createResponse = await axios.post(`${process.env.WORDPRESS_API_URL}/categories`, {
            name: categoryName,
            slug: categoryName.toLowerCase().replace(/\s+/g, '-')
        }, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            }
        });
        
        return createResponse.data.id;
        
    } catch (error) {
        console.error('Error with categories:', error.message);
        return 1; // Default category
    }
}

async function getOrCreateTags(keyword) {
    try {
        const auth = Buffer.from(`${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_APP_PASSWORD}`).toString('base64');
        
        // Create tags from keyword
        const tagNames = [
            keyword,
            ...keyword.split(' ').filter(word => word.length > 3)
        ];
        
        const tagIds = [];
        
        for (const tagName of tagNames) {
            try {
                // Try to find existing tag
                const searchResponse = await axios.get(`${process.env.WORDPRESS_API_URL}/tags?search=${encodeURIComponent(tagName)}`, {
                    headers: {
                        'Authorization': `Basic ${auth}`
                    }
                });
                
                if (searchResponse.data.length > 0) {
                    tagIds.push(searchResponse.data[0].id);
                } else {
                    // Create new tag
                    const createResponse = await axios.post(`${process.env.WORDPRESS_API_URL}/tags`, {
                        name: tagName,
                        slug: tagName.toLowerCase().replace(/\s+/g, '-')
                    }, {
                        headers: {
                            'Authorization': `Basic ${auth}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    tagIds.push(createResponse.data.id);
                }
            } catch (tagError) {
                console.error(`Error processing tag ${tagName}:`, tagError.message);
            }
        }
        
        return tagIds;
        
    } catch (error) {
        console.error('Error with tags:', error.message);
        return [];
    }
}

function generateMetaDescription(keyword, contentType) {
    const templates = {
        'single-review': `Comprehensive ${keyword} review. Read our detailed analysis, pros & cons, and expert recommendations to make the right choice.`,
        'comparison': `${keyword} comparison guide. We analyze the top options to help you choose the best product for your needs.`,
        'top10': `Best ${keyword} in 2024. Our expert team reviews and ranks the top products based on performance, value, and user feedback.`
    };
    
    const template = templates[contentType] || templates['single-review'];
    return template.substring(0, 160); // SEO meta description limit
}

async function createDeploymentSummary(deployedPosts) {
    const summary = `# WordPress Deployment Summary

**Deployed:** ${new Date().toISOString()}
**Target Repository:** ${process.env.TARGET_REPO}
**Total Posts:** ${deployedPosts.length}

## Deployed Articles

${deployedPosts.map(post => `
### ${post.title}
- **WordPress ID:** ${post.id}
- **URL:** ${post.url}
- **Keyword:** ${post.keyword}
- **Status:** ${post.status}
`).join('')}

## Deployment Status

✅ Deployment completed successfully!
`;

    await fs.writeFile('generated-content/DEPLOYMENT_SUMMARY.md', summary);
}

// Run if called directly
if (require.main === module) {
    const requiredEnvVars = ['WORDPRESS_API_URL', 'WORDPRESS_USERNAME', 'WORDPRESS_APP_PASSWORD'];
    
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            console.error(`${envVar} environment variable is required`);
            process.exit(1);
        }
    }
    
    deployToWordPress().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { deployToWordPress };