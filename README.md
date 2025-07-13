<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Automated Affiliate Review Blog Workflow</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow-x: auto;
        }
        
        .container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 1200px;
            width: 100%;
        }
        
        h1 {
            text-align: center;
            color: #2a5298;
            margin-bottom: 40px;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .workflow {
            display: flex;
            flex-direction: column;
            gap: 30px;
            position: relative;
        }
        
        .step {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            padding: 25px;
            color: white;
            position: relative;
            transform: translateX(0);
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .step:hover {
            transform: translateX(10px) scale(1.02);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }
        
        .step-number {
            position: absolute;
            left: -20px;
            top: 50%;
            transform: translateY(-50%);
            background: #fff;
            color: #667eea;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.5em;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .step-title {
            font-size: 1.4em;
            font-weight: bold;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .step-content {
            font-size: 1em;
            line-height: 1.6;
            opacity: 0.95;
        }
        
        .step-content ul {
            list-style: none;
            padding-left: 20px;
            margin-top: 10px;
        }
        
        .step-content li {
            position: relative;
            padding-left: 20px;
            margin-bottom: 5px;
        }
        
        .step-content li:before {
            content: "▸";
            position: absolute;
            left: 0;
        }
        
        .arrow {
            width: 0;
            height: 0;
            border-left: 20px solid transparent;
            border-right: 20px solid transparent;
            border-top: 30px solid rgba(102, 126, 234, 0.5);
            margin: -10px auto;
            animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(10px); }
        }
        
        .icon {
            width: 30px;
            height: 30px;
            fill: currentColor;
        }
        
        .branch {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin: 20px 0;
        }
        
        .branch-item {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }
        
        .branch-item:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }
        
        .decision {
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
            text-align: center;
            font-weight: bold;
            padding: 20px;
            border-radius: 15px;
            margin: 0 auto;
            max-width: 300px;
        }
        
        .automation-badge {
            display: inline-block;
            background: #4CAF50;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
            margin-left: 10px;
        }
        
        .manual-badge {
            display: inline-block;
            background: #FF9800;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
            margin-left: 10px;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 20px;
            }
            
            h1 {
                font-size: 1.8em;
            }
            
            .step-number {
                left: -15px;
                width: 40px;
                height: 40px;
                font-size: 1.2em;
            }
            
            .step-title {
                font-size: 1.1em;
            }
            
            .branch {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Automated Affiliate Review Blog Workflow</h1>
        
        <div class="workflow">
            <div class="step">
                <div class="step-number">1</div>
                <div class="step-title">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    Keyword Research
                    <span class="manual-badge">MANUAL</span>
                </div>
                <div class="step-content">
                    <ul>
                        <li>Provide keywords from Keywords Everywhere</li>
                        <li>Include monthly search volumes</li>
                        <li>Target high-value, low-competition terms</li>
                    </ul>
                </div>
            </div>
            
            <div class="arrow"></div>
            
            <div class="step">
                <div class="step-number">2</div>
                <div class="step-title">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    Keyword Viability Check
                    <span class="automation-badge">AUTOMATED</span>
                </div>
                <div class="step-content">
                    <ul>
                        <li>Claude performs allintitle: analysis</li>
                        <li>Checks Golden Keyword Ratio (GKR)</li>
                        <li>Marks keywords as viable/non-viable</li>
                    </ul>
                </div>
            </div>
            
            <div class="arrow"></div>
            
            <div class="decision">✓ Viable Keywords Only</div>
            
            <div class="arrow"></div>
            
            <div class="step">
                <div class="step-number">3</div>
                <div class="step-title">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                    Content Type Selection
                    <span class="automation-badge">AUTOMATED</span>
                </div>
                <div class="step-content">
                    Based on keyword intent, Claude chooses:
                </div>
            </div>
            
            <div class="branch">
                <div class="branch-item">Single Product Review</div>
                <div class="branch-item">Product Comparison</div>
                <div class="branch-item">Top 10 Roundup</div>
            </div>
            
            <div class="arrow"></div>
            
            <div class="step">
                <div class="step-number">4</div>
                <div class="step-title">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                    </svg>
                    Structured Content Generation
                    <span class="automation-badge">AUTOMATED</span>
                </div>
                <div class="step-content">
                    <ul>
                        <li>References pre-defined XML templates</li>
                        <li>Integrates product boxes & affiliate links</li>
                        <li>Uses your Amazon Affiliate tag</li>
                        <li>Adds CTA buttons automatically</li>
                    </ul>
                </div>
            </div>
            
            <div class="arrow"></div>
            
            <div class="step">
                <div class="step-number">5</div>
                <div class="step-title">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                    Article Draft Creation
                    <span class="automation-badge">AUTOMATED</span>
                </div>
                <div class="step-content">
                    Claude generates SEO-optimized content with proper formatting
                </div>
            </div>
            
            <div class="arrow"></div>
            
            <div class="step">
                <div class="step-number">6</div>
                <div class="step-title">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    GitHub Repository Upload
                    <span class="automation-badge">AUTOMATED</span>
                </div>
                <div class="step-content">
                    <ul>
                        <li>SolarCaravanClub repository</li>
                        <li>RemoteWorkErgonomics repository</li>
                        <li>Other niche-specific repos</li>
                    </ul>
                </div>
            </div>
            
            <div class="arrow"></div>
            
            <div class="step">
                <div class="step-number">7</div>
                <div class="step-title">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Slack Notification & Approval
                    <span class="manual-badge">MANUAL</span>
                </div>
                <div class="step-content">
                    <ul>
                        <li>GitHub Actions triggers notification</li>
                        <li>You review generated content</li>
                        <li>Manual approval required</li>
                    </ul>
                </div>
            </div>
            
            <div class="arrow"></div>
            
            <div class="step">
                <div class="step-number">8</div>
                <div class="step-title">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M5 4v2h14V4H5zm0 10h4v6h6v-6h4l-7-7-7 7z"/>
                    </svg>
                    WordPress Deployment
                    <span class="automation-badge">AUTOMATED</span>
                </div>
                <div class="step-content">
                    <ul>
                        <li>Automatic deployment via GitHub Actions</li>
                        <li>Published to corresponding WordPress sites</li>
                        <li>Live and ready for traffic!</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
