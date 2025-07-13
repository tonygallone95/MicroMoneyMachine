// scripts/content-generator.js
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

async function generateContent(viableKeywords) {
    console.log('📝 Starting content generation...');
    const contentFiles = [];
    const keywordArray = JSON.parse(viableKeywords);
    
    // Create output directory
    await fs.mkdir('generated-content', { recursive: true });
    
    for (const keywordData of keywordArray) {
        console.log(`Generating content for: ${keywordData.keyword}`);
        
        try {
            const content = await generateArticle(keywordData);
            const filename = `${keywordData.keyword.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}.md`;
            const filepath = path.join('generated-content', filename);
            
            // Add metadata header
            const fullContent = createContentWithMetadata(content, keywordData);
            
            await fs.writeFile(filepath, fullContent);
            
            contentFiles.push({
                filename,
                keyword: keywordData.keyword,
                contentType: keywordData.contentType || keywordData.recommendedContentType,
                gkr: keywordData.gkr,
                searchVolume: keywordData.searchVolume
            });
            
            console.log(`✅ Generated: ${filename}`);
        } catch (error) {
            console.error(`❌ Failed to generate content for ${keywordData.keyword}:`, error.message);
        }
    }
    
    // Create summary file
    await createSummaryFile(contentFiles);
    
    console.log(`\n🎉 Content generation complete: ${contentFiles.length} articles created`);
    
    // Set GitHub Actions output
    const output = JSON.stringify(contentFiles);
    console.log(`::set-output name=content-files::${output}`);
    
    return contentFiles;
}

function createContentWithMetadata(content, keywordData) {
    const metadata = `---
title: "${extractTitle(content)}"
keyword: "${keywordData.keyword}"
contentType: "${keywordData.contentType || keywordData.recommendedContentType}"
gkr: ${keywordData.gkr}
searchVolume: ${keywordData.searchVolume}
generated: "${new Date().toISOString()}"
status: "draft"
---

${content}`;
    
    return metadata;
}

function extractTitle(content) {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1] : 'Untitled Article';
}

async function generateArticle(keywordData) {
    const contentType = keywordData.contentType || keywordData.recommendedContentType;
    const templates = getContentTemplates();
    
    const prompt = templates[contentType].replace(/\{keyword\}/g, keywordData.keyword)
                                        .replace(/\{affiliateTag\}/g, process.env.AMAZON_AFFILIATE_TAG || 'your-tag-20');

    try {
        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: 'claude-3-sonnet-20240229',
            max_tokens: 4000,
            messages: [{
                role: 'user',
                content: prompt
            }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            }
        });

        return response.data.content[0].text;
    } catch (error) {
        console.error('Claude API error:', error.response?.data || error.message);
        return generateFallbackContent(keywordData);
    }
}

function getContentTemplates() {
    return {
        'single-review': `Create a comprehensive affiliate review article for the keyword "{keyword}". 

Structure the article as follows:

# [Compelling SEO Title with {keyword}]

## Introduction
- Hook the reader with the main benefit
- Naturally include the target keyword "{keyword}"
- Preview what the article will cover

## Product Overview
- What is the product and who makes it?
- Key specifications and features
- Who is this product for?

## Detailed Analysis
### Key Features
- Feature 1 with benefits
- Feature 2 with benefits  
- Feature 3 with benefits

### Pros and Cons
**Pros:**
- Benefit 1
- Benefit 2
- Benefit 3

**Cons:**
- Limitation 1
- Limitation 2

## Customer Reviews Summary
- What real users are saying
- Common praise points
- Common complaints

## Pricing and Where to Buy
- Current pricing information
- Best places to purchase
- Include Amazon affiliate link: https://amazon.com/dp/PRODUCTID?tag={affiliateTag}

## Conclusion
- Summarize key points
- Final recommendation
- Strong call-to-action

**Requirements:**
- 1500-2000 words
- SEO optimized with natural keyword usage
- Include 2-3 Amazon affiliate links
- Conversational, helpful tone
- Include relevant product information`,

        'comparison': `Create a detailed comparison article for "{keyword}".

# [Product A vs Product B]: Complete Comparison Guide for {keyword}

## Introduction
- Introduce both products being compared
- Why this comparison matters for {keyword} shoppers

## Quick Comparison Table
| Feature | Product A | Product B |
|---------|-----------|-----------|
| Price | $X | $Y |
| Key Feature 1 | Value | Value |
| Key Feature 2 | Value | Value |

## Detailed Product Analysis

### Product A: [Name]
- Overview and specifications
- Key strengths
- Best use cases
- Amazon link: https://amazon.com/dp/PRODUCTID?tag={affiliateTag}

### Product B: [Name]  
- Overview and specifications
- Key strengths
- Best use cases
- Amazon link: https://amazon.com/dp/PRODUCTID?tag={affiliateTag}

## Head-to-Head Comparison
- Performance comparison
- Value comparison
- Feature comparison

## Which Should You Choose?
- Recommendations based on use case
- Final verdict

Target: 1200-1500 words with natural keyword integration`,

        'top10': `Create a "Best of" roundup article for "{keyword}".

# The 10 Best {keyword} in 2024: Complete Buyer's Guide

## Introduction
- Why we created this list
- Our testing methodology
- What to look for when buying

## Quick Picks
1. **Best Overall**: [Product Name]
2. **Best Budget**: [Product Name]  
3. **Best Premium**: [Product Name]

## Top 10 {keyword} Reviews

### 1. [Product Name] - Best Overall
- Key features and benefits
- Why it's our top pick
- Price and where to buy
- Amazon link: https://amazon.com/dp/PRODUCTID?tag={affiliateTag}

### 2. [Product Name] - Best Budget Option
[Similar format for each product]

[Continue for all 10 products]

## Buying Guide
- Key factors to consider
- Features that matter most
- How to choose the right one

## Frequently Asked Questions
- Common questions about {keyword}
- Expert answers

## Conclusion
- Our final recommendations
- Call to action

Target: 2000-2500 words with comprehensive product coverage`
    };
}

function generateFallbackContent(keywordData) {
    const keyword = keywordData.keyword;
    return `# The Ultimate Guide to ${keyword}

## Introduction

When searching for information about ${keyword}, you want reliable, comprehensive insights. This guide covers everything you need to know.

## What You Need to Know About ${keyword}

${keyword} has become increasingly important for consumers looking for quality solutions. Understanding the key factors can help you make an informed decision.

## Key Considerations

### Quality Factors
- Durability and construction
- Performance metrics
- User experience

### Value Proposition
- Cost-effectiveness
- Long-term benefits
- Return on investment

## Expert Recommendations

Based on extensive research and analysis, we recommend considering multiple factors before making your final decision about ${keyword}.

## Conclusion

${keyword} represents an important consideration for anyone looking to make an informed purchase. Take time to research and compare options.

---
*This content was generated as a fallback when the primary content generation system was unavailable.*`;
}

async function createSummaryFile(contentFiles) {
    const summary = `# Content Generation Summary

**Generated:** ${new Date().toISOString()}
**Total Articles:** ${contentFiles.length}

## Generated Content

${contentFiles.map(file => `
### ${file.keyword}
- **File:** ${file.filename}
- **Type:** ${file.contentType}
- **GKR:** ${file.gkr}
- **Search Volume:** ${file.searchVolume}
`).join('')}

## Next Steps

1. Review generated content for quality
2. Approve via Slack notification
3. Content will be deployed to WordPress upon approval
`;

    await fs.writeFile('generated-content/SUMMARY.md', summary);
}

// Run if called directly
if (require.main === module) {
    const viableKeywords = process.argv[2];
    if (!viableKeywords) {
        console.error('Please provide viable keywords as an argument');
        process.exit(1);
    }
    
    generateContent(viableKeywords).catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { generateContent };