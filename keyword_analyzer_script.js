// scripts/keyword-analyzer.js
const axios = require('axios');

async function analyzeKeywords(keywords) {
    console.log('🔍 Starting keyword analysis...');
    const viableKeywords = [];
    
    for (const keyword of keywords.split(',').map(k => k.trim())) {
        console.log(`Analyzing keyword: ${keyword}`);
        
        try {
            const analysis = await analyzeKeywordWithClaude(keyword);
            
            if (analysis.isViable) {
                viableKeywords.push({
                    keyword,
                    gkr: analysis.gkr,
                    searchVolume: analysis.searchVolume,
                    competition: analysis.competition,
                    contentType: analysis.recommendedContentType
                });
                console.log(`✅ ${keyword} - VIABLE (GKR: ${analysis.gkr})`);
            } else {
                console.log(`❌ ${keyword} - NOT VIABLE (GKR: ${analysis.gkr})`);
            }
        } catch (error) {
            console.error(`Error analyzing ${keyword}:`, error.message);
        }
    }
    
    console.log(`\n📊 Analysis complete: ${viableKeywords.length}/${keywords.split(',').length} keywords viable`);
    
    // Set GitHub Actions output
    const output = JSON.stringify(viableKeywords);
    console.log(`::set-output name=viable-keywords::${output}`);
    
    return viableKeywords;
}

async function analyzeKeywordWithClaude(keyword) {
    const prompt = `Analyze the keyword "${keyword}" for affiliate content creation. Provide a JSON response with:

1. Calculate an estimated Golden Keyword Ratio (GKR) by estimating allintitle results vs monthly search volume
2. Determine if this keyword is viable for affiliate content (GKR should be < 0.25)
3. Recommend the best content type (single-review, comparison, or top10)
4. Estimate search volume and competition level

Respond ONLY with valid JSON in this format:
{
  "keyword": "${keyword}",
  "gkr": 0.15,
  "searchVolume": 1200,
  "competition": "medium",
  "isViable": true,
  "recommendedContentType": "single-review",
  "reasoning": "Brief explanation of why this keyword is/isn't viable"
}`;

    try {
        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1000,
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

        const content = response.data.content[0].text;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('No valid JSON found in Claude response');
        }
    } catch (error) {
        console.error('Claude API error:', error.response?.data || error.message);
        
        // Fallback analysis
        return {
            keyword,
            gkr: 0.5, // Conservative high GKR
            searchVolume: 500,
            competition: 'unknown',
            isViable: false,
            recommendedContentType: 'single-review',
            reasoning: 'Failed to analyze with Claude API, marked as non-viable'
        };
    }
}

// Fallback keyword analysis without Claude
async function fallbackKeywordAnalysis(keyword) {
    // Simple heuristics for when Claude API is unavailable
    const hasCompetitiveTerms = /best|top|review|vs|comparison/i.test(keyword);
    const isLongTail = keyword.split(' ').length >= 3;
    const hasCommercialIntent = /buy|price|cost|cheap|deal/i.test(keyword);
    
    const estimatedGKR = hasCompetitiveTerms ? 0.8 : (isLongTail ? 0.2 : 0.4);
    const isViable = estimatedGKR < 0.25;
    
    let contentType = 'single-review';
    if (keyword.includes('vs') || keyword.includes('comparison')) {
        contentType = 'comparison';
    } else if (keyword.includes('best') || keyword.includes('top')) {
        contentType = 'top10';
    }
    
    return {
        keyword,
        gkr: estimatedGKR,
        searchVolume: 1000,
        competition: 'estimated',
        isViable,
        recommendedContentType: contentType,
        reasoning: 'Fallback heuristic analysis'
    };
}

// Run if called directly
if (require.main === module) {
    const keywords = process.argv[2];
    if (!keywords) {
        console.error('Please provide keywords as an argument');
        process.exit(1);
    }
    
    analyzeKeywords(keywords).catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { analyzeKeywords, analyzeKeywordWithClaude };