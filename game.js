// Game State
const gameState = {
    balance: 0,
    annualIncome: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    daysPassed: 0,
    isPaused: false,
    gameSpeed: 1,
    ownedItems: [],
    gameLoop: null
};

// Game Items Data
const gameItems = {
    housing: [
        { id: 'apartment', name: 'Studio Apartment', price: 150000, monthlyExpense: 1200, emoji: '🏢' },
        { id: 'condo', name: 'Luxury Condo', price: 450000, monthlyExpense: 2800, emoji: '🏘️' },
        { id: 'house', name: 'Suburban House', price: 650000, monthlyExpense: 3500, emoji: '🏡' },
        { id: 'mansion', name: 'Mansion', price: 2500000, monthlyExpense: 12000, emoji: '🏰' },
        { id: 'penthouse', name: 'Penthouse Suite', price: 5000000, monthlyExpense: 25000, emoji: '🌆' },
        { id: 'estate', name: 'Private Estate', price: 15000000, monthlyExpense: 75000, emoji: '🏛️' }
    ],
    vehicles: [
        { id: 'sedan', name: 'Economy Sedan', price: 25000, monthlyExpense: 350, emoji: '🚙' },
        { id: 'suv', name: 'Luxury SUV', price: 75000, monthlyExpense: 800, emoji: '🚗' },
        { id: 'sports', name: 'Sports Car', price: 150000, monthlyExpense: 1500, emoji: '🏎️' },
        { id: 'luxury', name: 'Luxury Sedan', price: 250000, monthlyExpense: 2200, emoji: '🚘' },
        { id: 'supercar', name: 'Supercar', price: 500000, monthlyExpense: 4000, emoji: '🏁' },
        { id: 'yacht', name: 'Yacht', price: 2000000, monthlyExpense: 15000, emoji: '🛥️' },
        { id: 'jet', name: 'Private Jet', price: 10000000, monthlyExpense: 85000, emoji: '✈️' }
    ],
    luxury: [
        { id: 'watch', name: 'Designer Watch', price: 15000, monthlyExpense: 0, emoji: '⌚' },
        { id: 'jewelry', name: 'Fine Jewelry', price: 35000, monthlyExpense: 0, emoji: '💍' },
        { id: 'art', name: 'Art Collection', price: 100000, monthlyExpense: 500, emoji: '🖼️' },
        { id: 'pool', name: 'Swimming Pool', price: 85000, monthlyExpense: 600, emoji: '🏊' },
        { id: 'theater', name: 'Home Theater', price: 50000, monthlyExpense: 100, emoji: '🎬' },
        { id: 'wine', name: 'Wine Cellar', price: 75000, monthlyExpense: 1200, emoji: '🍷' }
    ],
    lifestyle: [
        { id: 'basic', name: 'Basic Living', price: 0, monthlyExpense: 1500, emoji: '🍞', isRecurring: true },
        { id: 'dining', name: 'Fine Dining', price: 0, monthlyExpense: 2000, emoji: '🍽️', isRecurring: true },
        { id: 'travel', name: 'Luxury Travel', price: 0, monthlyExpense: 3500, emoji: '✈️', isRecurring: true },
        { id: 'shopping', name: 'Designer Shopping', price: 0, monthlyExpense: 2500, emoji: '🛍️', isRecurring: true },
        { id: 'spa', name: 'Spa & Wellness', price: 0, monthlyExpense: 1800, emoji: '💆', isRecurring: true },
        { id: 'entertainment', name: 'Premium Entertainment', price: 0, monthlyExpense: 1000, emoji: '🎭', isRecurring: true }
    ]
};

// Initialize Game
function initGame() {
    setupEventListeners();
    showScreen('startScreen');
}

// Setup Event Listeners
function setupEventListeners() {
    // Income selection
    document.querySelectorAll('.income-btn').forEach(btn => {
        btn.addEventListener('click', () => startGame(parseInt(btn.dataset.income)));
    });

    // Game controls
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.getElementById('speedBtn').addEventListener('click', changeSpeed);
    document.getElementById('restartBtn').addEventListener('click', resetGame);
    document.getElementById('playAgainBtn').addEventListener('click', resetGame);
}

// Start Game
function startGame(income) {
    gameState.annualIncome = income;
    gameState.monthlyIncome = income / 12;
    gameState.balance = income * 0.25; // Start with 3 months salary
    gameState.monthlyExpenses = 0;
    gameState.daysPassed = 0;
    gameState.ownedItems = [];
    gameState.isPaused = false;
    gameState.gameSpeed = 1;

    // Add basic living expense by default
    addItem(gameItems.lifestyle[0]);

    renderShop();
    updateUI();
    showScreen('mainGame');
    startGameLoop();
}

// Game Loop
function startGameLoop() {
    if (gameState.gameLoop) {
        clearInterval(gameState.gameLoop);
    }

    const dayDuration = 1000 / gameState.gameSpeed; // 1 second per day at 1x speed

    gameState.gameLoop = setInterval(() => {
        if (!gameState.isPaused) {
            advanceDay();
        }
    }, dayDuration);
}

// Advance Day
function advanceDay() {
    gameState.daysPassed++;

    // Monthly income and expenses (every 30 days)
    if (gameState.daysPassed % 30 === 0) {
        gameState.balance += gameState.monthlyIncome;
        gameState.balance -= gameState.monthlyExpenses;
    }

    updateUI();

    // Check for game over
    if (gameState.balance < 0) {
        gameOver();
    }
}

// Render Shop
function renderShop() {
    renderCategory('housingItems', gameItems.housing);
    renderCategory('vehicleItems', gameItems.vehicles);
    renderCategory('luxuryItems', gameItems.luxury);
    renderCategory('lifestyleItems', gameItems.lifestyle);
}

function renderCategory(containerId, items) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    items.forEach(item => {
        const itemCard = createItemCard(item);
        container.appendChild(itemCard);
    });
}

function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';

    const isOwned = gameState.ownedItems.some(owned => owned.id === item.id);
    const canAfford = gameState.balance >= item.price;

    if (isOwned) {
        card.classList.add('owned');
    }

    card.innerHTML = `
        <div class="item-emoji">${item.emoji}</div>
        <div class="item-name">${item.name}</div>
        <div class="item-price">${formatMoney(item.price)}</div>
        <div class="item-expense">${formatMoney(item.monthlyExpense)}/mo</div>
        ${isOwned
            ? '<button class="item-btn owned-btn" disabled>Owned</button>'
            : `<button class="item-btn ${canAfford ? '' : 'disabled'}" ${canAfford ? '' : 'disabled'}>Buy</button>`
        }
    `;

    const btn = card.querySelector('.item-btn');
    if (btn && !isOwned && canAfford) {
        btn.addEventListener('click', () => buyItem(item));
    }

    return card;
}

// Buy Item
function buyItem(item) {
    if (gameState.balance >= item.price) {
        gameState.balance -= item.price;
        addItem(item);
        renderShop();
        updateUI();
    }
}

function addItem(item) {
    if (!gameState.ownedItems.some(owned => owned.id === item.id)) {
        gameState.ownedItems.push(item);
        gameState.monthlyExpenses += item.monthlyExpense;
        updateOwnedItems();
    }
}

// Update UI
function updateUI() {
    document.getElementById('balance').textContent = formatMoney(gameState.balance);
    document.getElementById('balance').className = 'stat-value ' + (gameState.balance < 0 ? 'negative' : gameState.balance < gameState.monthlyExpenses ? 'warning' : '');
    document.getElementById('income').textContent = formatMoney(gameState.annualIncome);
    document.getElementById('expenses').textContent = formatMoney(gameState.monthlyExpenses);
    document.getElementById('daysSurvived').textContent = gameState.daysPassed;
}

function updateOwnedItems() {
    const container = document.getElementById('ownedList');

    if (gameState.ownedItems.length === 0) {
        container.innerHTML = '<p class="no-items">No items yet. Start shopping!</p>';
        return;
    }

    container.innerHTML = gameState.ownedItems.map(item => `
        <div class="owned-item">
            <span class="owned-emoji">${item.emoji}</span>
            <span class="owned-name">${item.name}</span>
            <span class="owned-cost">${formatMoney(item.monthlyExpense)}/mo</span>
        </div>
    `).join('');
}

// Game Controls
function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    const btn = document.getElementById('pauseBtn');
    btn.textContent = gameState.isPaused ? '▶️ Resume' : '⏸ Pause';
}

function changeSpeed() {
    const speeds = [1, 2, 5, 10];
    const currentIndex = speeds.indexOf(gameState.gameSpeed);
    gameState.gameSpeed = speeds[(currentIndex + 1) % speeds.length];
    document.getElementById('speedBtn').textContent = `⏩ Speed: ${gameState.gameSpeed}x`;
    startGameLoop(); // Restart loop with new speed
}

// Game Over
function gameOver() {
    clearInterval(gameState.gameLoop);
    document.getElementById('finalDays').textContent = `${gameState.daysPassed} days`;
    document.getElementById('finalIncome').textContent = formatMoney(gameState.annualIncome);
    document.getElementById('finalItems').textContent = gameState.ownedItems.length;
    showScreen('gameOverScreen');
}

// Reset Game
function resetGame() {
    if (gameState.gameLoop) {
        clearInterval(gameState.gameLoop);
    }
    showScreen('startScreen');
}

// Utility Functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function formatMoney(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', initGame);
