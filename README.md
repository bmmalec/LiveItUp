# Live It Up! - Lifestyle Simulation Game

A fun HTML5 game where you choose an income level, buy houses, cars, luxury items, and try to see how long you can live the high life without going broke!

## Game Features

- **5 Income Levels**: Choose from Modest ($50K) to Super Rich ($1M) annual income
- **Multiple Categories**:
  - 🏠 Housing: From studio apartments to private estates
  - 🚗 Vehicles: Economy sedans to private jets
  - 💎 Luxury Items: Designer watches, art collections, wine cellars
  - ☕ Lifestyle Expenses: Fine dining, travel, shopping, spa & wellness
- **Real-time Simulation**: Watch your balance change day by day
- **Speed Controls**: Play at 1x, 2x, 5x, or 10x speed
- **Challenge**: See how long you can survive before going broke!

## How to Play

1. **Choose Your Income**: Select an annual income level at the start
2. **Start with 25%**: You begin with 3 months of your annual salary
3. **Shop Wisely**: Purchase items from different categories
4. **Manage Expenses**: Every item has monthly costs (property taxes, insurance, maintenance)
5. **Survive**: Income arrives monthly (every 30 days), expenses are deducted monthly
6. **Don't Go Broke**: Keep your balance above $0 to stay in the game!

## Game Controls

- **⏸ Pause/Resume**: Pause the game to plan your purchases
- **⏩ Speed**: Adjust game speed (1x, 2x, 5x, 10x)
- **🔄 Restart**: Start a new game

## Technologies Used

- Pure HTML5
- Vanilla JavaScript (no frameworks)
- CSS3 with animations and gradients
- Responsive design for mobile and desktop

## Local Development

Simply open `index.html` in any modern web browser. No build process or server required!

```bash
# Clone the repository
git clone <your-repo-url>
cd LiveItUp

# Open in browser
open index.html
# or
python -m http.server 8000
```

## Deployment Options

### Deploy to GitHub Pages (Easiest & Free!)

GitHub Pages is the simplest way to host your game for free!

**Method 1: Via GitHub Settings (Recommended)**

1. Push your code to GitHub (already done!)
2. Go to your repository on GitHub
3. Click "Settings" tab
4. Scroll down to "Pages" section (left sidebar)
5. Under "Source", select:
   - Branch: `main` (or your default branch)
   - Folder: `/ (root)`
6. Click "Save"
7. Wait 1-2 minutes for deployment
8. Your game will be live at: `https://<your-username>.github.io/LiveItUp/`

**Method 2: Create a gh-pages branch**

```bash
# Create and checkout gh-pages branch
git checkout -b gh-pages

# Push to GitHub
git push -u origin gh-pages

# Go to Settings > Pages and select gh-pages branch
```

**That's it!** Your game is now live and will auto-update whenever you push changes.

**Custom Domain (Optional)**:
- Go to Settings > Pages
- Add your custom domain
- Configure DNS with your domain provider

### Deploy to Azure Static Web Apps

### Option 1: Deploy via Azure Portal

1. **Create Azure Static Web App**:
   - Go to [Azure Portal](https://portal.azure.com)
   - Click "Create a resource"
   - Search for "Static Web App"
   - Click "Create"

2. **Configure the Web App**:
   - Choose your subscription and resource group
   - Name: `liveitup-game` (or your preferred name)
   - Plan type: Free (or Standard for custom domains)
   - Region: Choose closest to your users
   - Deployment source: GitHub (or other Git provider)

3. **Connect to GitHub**:
   - Authorize Azure to access your GitHub
   - Select your repository and branch
   - Build presets: Custom
   - App location: `/` (root)
   - API location: (leave empty)
   - Output location: (leave empty)

4. **Deploy**:
   - Click "Review + create"
   - Click "Create"
   - Wait for deployment (usually 2-3 minutes)
   - Your game will be live at `https://<your-app-name>.azurestaticapps.net`

### Option 2: Deploy via Azure CLI

```bash
# Install Azure CLI if not already installed
# https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# Login to Azure
az login

# Create a resource group
az group create --name liveitup-rg --location eastus

# Create static web app
az staticwebapp create \
    --name liveitup-game \
    --resource-group liveitup-rg \
    --source https://github.com/<your-username>/LiveItUp \
    --location eastus \
    --branch main \
    --app-location "/" \
    --login-with-github

# Get the URL
az staticwebapp show \
    --name liveitup-game \
    --resource-group liveitup-rg \
    --query "defaultHostname" \
    --output tsv
```

### Option 3: Deploy via GitHub Actions (Automatic)

When you create a Static Web App via the portal, Azure automatically creates a GitHub Actions workflow in your repository. Every push to your main branch will trigger a new deployment.

The workflow file will be located at: `.github/workflows/azure-static-web-apps-*.yml`

### Option 4: Manual Upload

1. **Using Azure Storage Static Website**:
```bash
# Create a storage account
az storage account create \
    --name liveitupgame \
    --resource-group liveitup-rg \
    --location eastus \
    --sku Standard_LRS

# Enable static website
az storage blob service-properties update \
    --account-name liveitupgame \
    --static-website \
    --index-document index.html \
    --404-document index.html

# Upload files
az storage blob upload-batch \
    --account-name liveitupgame \
    --source . \
    --destination '$web'

# Get the URL
az storage account show \
    --name liveitupgame \
    --resource-group liveitup-rg \
    --query "primaryEndpoints.web" \
    --output tsv
```

## Configuration

The game uses `staticwebapp.config.json` for Azure Static Web Apps configuration:
- Routing rules
- MIME types
- Cache control
- 404 fallback to index.html

## Customization

### Modify Game Items

Edit `game.js` and update the `gameItems` object:

```javascript
const gameItems = {
    housing: [
        { id: 'apartment', name: 'Studio Apartment', price: 150000, monthlyExpense: 1200, emoji: '🏢' },
        // Add more items...
    ],
    // Add more categories...
};
```

### Adjust Starting Balance

In the `startGame()` function:

```javascript
gameState.balance = income * 0.25; // Change 0.25 to your preferred multiplier
```

### Change Game Speed

Modify the `dayDuration` in the `startGameLoop()` function:

```javascript
const dayDuration = 1000 / gameState.gameSpeed; // 1000ms = 1 second per day
```

## Future Enhancements

Potential features to add:
- [ ] Save/load game progress (localStorage)
- [ ] Leaderboard (requires backend)
- [ ] Random events (market crashes, windfalls, repairs)
- [ ] Investments and passive income
- [ ] Multiple save slots
- [ ] Sound effects and music
- [ ] Achievements and unlockables
- [ ] Multiplayer comparison

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - Feel free to use and modify!

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## Support

If you encounter any issues or have questions:
1. Check the browser console for errors
2. Ensure you're using a modern browser
3. Try clearing your browser cache
4. Open an issue on GitHub

## Credits

Created with ❤️ as a fun lifestyle simulation game.

Enjoy living it up!
