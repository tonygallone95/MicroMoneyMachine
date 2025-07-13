# MicroMoneyMachine CI/CD Setup Instructions

## 📁 File Structure

Copy these files to your MicroMoneyMachine repository:

```
MicroMoneyMachine/
├── .github/
│   └── workflows/
│       ├── content-pipeline.yml
│       └── approval.yml
└── scripts/
    ├── keyword-analyzer.js
    ├── content-generator.js
    ├── slack-notifier.js
    └── wordpress-deployer.js
```

## 🔐 Required GitHub Secrets

Go to your repository **Settings > Secrets and variables > Actions** and add:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `CLAUDE_API_KEY` | Your Claude API key from Anthropic | `sk-ant-api03-...` |
| `SLACK_WEBHOOK_URL` | Slack webhook for notifications | `https://hooks.slack.com/services/...` |
| `WORDPRESS_API_URL` | WordPress REST API endpoint | `https://yoursite.com/wp-json/wp/v2` |
| `WORDPRESS_USERNAME` | WordPress admin username | `admin` |
| `WORDPRESS_APP_PASSWORD` | WordPress application password | `xxxx xxxx xxxx xxxx` |
| `AMAZON_AFFILIATE_TAG` | Your Amazon affiliate tag | `yourtag-20` |

## 🔧 Setup Steps

### 1. WordPress Application Password
1. Login to your WordPress admin
2. Go to **Users > Profile**
3. Scroll to **Application Passwords**
4. Create a new password for "MicroMoneyMachine"
5. Copy the generated password

### 2. Slack Webhook
1. Go to [Slack API](https://api.slack.com/apps)
2. Create a new app or use existing
3. Go to **Incoming Webhooks**
4. Create webhook for your channel
5. Copy the webhook URL

### 3. Claude API Key
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create API key
3. Copy the key (starts with `sk-ant-api03-`)

### 4. Repository Setup
1. Create the directory structure in your repo
2. Copy all the files from the artifacts above
3. Add all GitHub secrets
4. Commit and push

## 🚀 Usage

### Running the Pipeline
1. Go to **Actions** tab in GitHub
2. Click **MicroMoneyMachine Content Pipeline**
3. Click **Run workflow**
4. Enter your keywords (comma-separated)
5. Select target repository (SolarCaravanClub or RemoteWorkErgonomics)
6. Click **Run workflow**

### Approval Process
1. Pipeline runs automatically
2. Slack notification sent with content preview
3. Click "Approve & Deploy" or "Reject" in Slack
4. Approved content deploys to WordPress automatically

## 🛠️ Customization

### Adding New Content Types
Edit `scripts/content-generator.js` and add templates in `getContentTemplates()`

### Adding New Target Repositories
Edit `.github/workflows/content-pipeline.yml` and add to the `options` list

### Customizing Slack Messages
Edit `scripts/slack-notifier.js` to modify notification format

### WordPress Categories
Edit `scripts/wordpress-deployer.js` in the `getCategoryId()` function

## 🐛 Troubleshooting

### Common Issues

**Pipeline fails at keyword analysis:**
- Check Claude API key is correct
- Ensure API has sufficient credits

**Slack notifications not working:**
- Verify webhook URL is correct
- Check webhook permissions in Slack

**WordPress deployment fails:**
- Verify application password is correct
- Check WordPress REST API is enabled
- Ensure user has publishing permissions

**Content not generated:**
- Check Claude API limits
- Verify keywords are properly formatted

### Debug Mode
Add this to any script to enable detailed logging:
```javascript
console.log('DEBUG:', variableName);
```

## 📊 Monitoring

### GitHub Actions
- Monitor workflow runs in Actions tab
- Check logs for any errors
- Review artifact downloads

### WordPress
- Check posts are published correctly
- Verify SEO metadata is applied
- Confirm affiliate links are working

### Slack
- Ensure notifications are received
- Test approval/rejection buttons
- Monitor channel activity

## 🔄 Maintenance

### Regular Tasks
- Review and update content templates
- Monitor Claude API usage
- Check WordPress plugin compatibility
- Update affiliate links as needed

### Monthly Reviews
- Analyze keyword performance
- Review content quality
- Update automation based on results
- Check for new features in APIs

## 📈 Analytics Integration

To track performance, consider adding:
- Google Analytics tracking codes
- Affiliate link click tracking
- Content performance metrics
- SEO ranking monitoring

This pipeline will streamline your content creation process while maintaining quality control through the approval workflow!