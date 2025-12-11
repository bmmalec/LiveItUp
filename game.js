// Game State
const gameState = {
    balance: 0,
    annualIncome: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    daysPassed: 0,
    isPaused: false,
    gameSpeed: 1,
    ownedItems: [], // Array of { itemId, category, quantity, purchasePrice, isFinanced, remainingBalance, monthlyPayment }
    creditLimit: 0, // Based on income
    totalDebt: 0,
    netAssets: 0,
    annuityPayments: [], // Array of { amount, nextPaymentDay, paymentsRemaining, yearlyIncrease }
    gameLoop: null
};

// Game Items Data with depreciation and financing options
const gameItems = {
    housing: [
        // Rent options (no purchase price, subscription-based)
        { id: 'rent_studio', name: 'Rent: Studio Apartment', price: 0, monthlyExpense: 1800, emoji: '🏢',
          isSubscription: true, allowMultiple: false, canCancel: true },
        { id: 'rent_1bed', name: 'Rent: 1-Bedroom Apt', price: 0, monthlyExpense: 2500, emoji: '🏘️',
          isSubscription: true, allowMultiple: false, canCancel: true },
        { id: 'rent_2bed', name: 'Rent: 2-Bedroom Apt', price: 0, monthlyExpense: 3200, emoji: '🏡',
          isSubscription: true, allowMultiple: false, canCancel: true },
        { id: 'rent_luxury', name: 'Rent: Luxury Condo', price: 0, monthlyExpense: 5500, emoji: '🌆',
          isSubscription: true, allowMultiple: false, canCancel: true },
        // Purchase options
        { id: 'apartment', name: 'Buy: Studio Apartment', price: 150000, monthlyExpense: 1200, emoji: '🏢',
          depreciation: 0.02, downPayment: 0.20, financeMonths: 360, interestRate: 0.04, allowMultiple: true },
        { id: 'condo', name: 'Buy: Luxury Condo', price: 450000, monthlyExpense: 2800, emoji: '🏘️',
          depreciation: 0.02, downPayment: 0.20, financeMonths: 360, interestRate: 0.04, allowMultiple: true },
        { id: 'house', name: 'Buy: Suburban House', price: 650000, monthlyExpense: 3500, emoji: '🏡',
          depreciation: 0.02, downPayment: 0.20, financeMonths: 360, interestRate: 0.04, allowMultiple: true },
        { id: 'mansion', name: 'Buy: Mansion', price: 2500000, monthlyExpense: 12000, emoji: '🏰',
          depreciation: 0.01, downPayment: 0.25, financeMonths: 360, interestRate: 0.035, allowMultiple: true },
        { id: 'penthouse', name: 'Buy: Penthouse Suite', price: 5000000, monthlyExpense: 25000, emoji: '🌆',
          depreciation: 0.01, downPayment: 0.30, financeMonths: 360, interestRate: 0.035, allowMultiple: false },
        { id: 'estate', name: 'Buy: Private Estate', price: 15000000, monthlyExpense: 75000, emoji: '🏛️',
          depreciation: 0.005, downPayment: 0.30, financeMonths: 360, interestRate: 0.03, allowMultiple: false }
    ],
    vehicles: [
        { id: 'sedan', name: 'Economy Sedan', price: 25000, monthlyExpense: 350, emoji: '🚙',
          depreciation: 0.15, downPayment: 0.10, financeMonths: 60, interestRate: 0.05, allowMultiple: true },
        { id: 'suv', name: 'Luxury SUV', price: 75000, monthlyExpense: 800, emoji: '🚗',
          depreciation: 0.12, downPayment: 0.15, financeMonths: 72, interestRate: 0.045, allowMultiple: true },
        { id: 'sports', name: 'Sports Car', price: 150000, monthlyExpense: 1500, emoji: '🏎️',
          depreciation: 0.10, downPayment: 0.20, financeMonths: 72, interestRate: 0.04, allowMultiple: true },
        { id: 'luxury', name: 'Luxury Sedan', price: 250000, monthlyExpense: 2200, emoji: '🚘',
          depreciation: 0.08, downPayment: 0.25, financeMonths: 72, interestRate: 0.04, allowMultiple: true },
        { id: 'supercar', name: 'Supercar', price: 500000, monthlyExpense: 4000, emoji: '🏁',
          depreciation: 0.05, downPayment: 0.30, financeMonths: 84, interestRate: 0.035, allowMultiple: true },
        { id: 'yacht', name: 'Yacht', price: 2000000, monthlyExpense: 15000, emoji: '🛥️',
          depreciation: 0.08, downPayment: 0.30, financeMonths: 240, interestRate: 0.045, allowMultiple: true },
        { id: 'jet', name: 'Private Jet', price: 10000000, monthlyExpense: 85000, emoji: '✈️',
          depreciation: 0.04, downPayment: 0.40, financeMonths: 240, interestRate: 0.04, allowMultiple: false }
    ],
    luxury: [
        { id: 'watch', name: 'Designer Watch', price: 15000, monthlyExpense: 0, emoji: '⌚',
          depreciation: 0.20, allowMultiple: true },
        { id: 'jewelry', name: 'Fine Jewelry', price: 35000, monthlyExpense: 0, emoji: '💍',
          depreciation: 0.15, allowMultiple: true },
        { id: 'art', name: 'Art Collection', price: 100000, monthlyExpense: 500, emoji: '🖼️',
          depreciation: 0.05, allowMultiple: true },
        { id: 'pool', name: 'Swimming Pool', price: 85000, monthlyExpense: 600, emoji: '🏊',
          depreciation: 0.30, allowMultiple: false },
        { id: 'theater', name: 'Home Theater', price: 50000, monthlyExpense: 100, emoji: '🎬',
          depreciation: 0.25, allowMultiple: false },
        { id: 'wine', name: 'Wine Cellar', price: 75000, monthlyExpense: 1200, emoji: '🍷',
          depreciation: 0.10, allowMultiple: false }
    ],
    lifestyle: [
        { id: 'basic', name: 'Basic Living', price: 0, monthlyExpense: 1500, emoji: '🍞',
          isSubscription: true, allowMultiple: false, canCancel: false },
        { id: 'dining', name: 'Fine Dining', price: 0, monthlyExpense: 2000, emoji: '🍽️',
          isSubscription: true, allowMultiple: false, canCancel: true },
        { id: 'travel', name: 'Luxury Travel', price: 0, monthlyExpense: 3500, emoji: '✈️',
          isSubscription: true, allowMultiple: false, canCancel: true },
        { id: 'shopping', name: 'Designer Shopping', price: 0, monthlyExpense: 2500, emoji: '🛍️',
          isSubscription: true, allowMultiple: false, canCancel: true },
        { id: 'spa', name: 'Spa & Wellness', price: 0, monthlyExpense: 1800, emoji: '💆',
          isSubscription: true, allowMultiple: false, canCancel: true },
        { id: 'entertainment', name: 'Premium Entertainment', price: 0, monthlyExpense: 1000, emoji: '🎭',
          isSubscription: true, allowMultiple: false, canCancel: true }
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

    // Life events
    document.getElementById('adjustIncomeBtn').addEventListener('click', openIncomeModal);
    document.getElementById('powerballBtn').addEventListener('click', openPowerballModal);
    document.getElementById('applyIncomeBtn').addEventListener('click', applyNewIncome);
    document.getElementById('chooseCashBtn').addEventListener('click', () => choosePowerballPayout('cash'));
    document.getElementById('chooseAnnuityBtn').addEventListener('click', () => choosePowerballPayout('annuity'));

    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });

    // Update Powerball calculations when jackpot changes
    document.getElementById('jackpotAmount').addEventListener('input', updatePowerballCalculations);
}

// Start Game
function startGame(income) {
    gameState.annualIncome = income;
    gameState.monthlyIncome = income / 12;
    gameState.balance = income * 0.25; // Start with 3 months salary
    gameState.creditLimit = income * 6; // Credit limit is 6x annual income
    gameState.monthlyExpenses = 0;
    gameState.totalDebt = 0;
    gameState.netAssets = 0;
    gameState.daysPassed = 0;
    gameState.ownedItems = [];
    gameState.annuityPayments = [];
    gameState.isPaused = false;
    gameState.gameSpeed = 1;

    // Add basic living expense by default
    const basicLiving = gameItems.lifestyle[0];
    addItem(basicLiving, 'lifestyle', false);

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

        // Calculate total monthly expenses including loan payments
        let totalMonthlyExpenses = 0;
        gameState.ownedItems.forEach(owned => {
            const item = findItem(owned.itemId, owned.category);
            // Regular monthly expense
            totalMonthlyExpenses += item.monthlyExpense * (owned.quantity || 1);
            // Loan payment if financed
            if (owned.isFinanced && owned.monthlyPayment) {
                totalMonthlyExpenses += owned.monthlyPayment;
                // Reduce remaining balance
                const principal = owned.monthlyPayment - (owned.remainingBalance * owned.interestRate / 12);
                owned.remainingBalance -= principal;
                if (owned.remainingBalance <= 0) {
                    owned.isFinanced = false;
                    owned.remainingBalance = 0;
                    owned.monthlyPayment = 0;
                }
            }
        });

        gameState.monthlyExpenses = totalMonthlyExpenses;
        gameState.balance -= totalMonthlyExpenses;
    }

    // Check for annuity payments (every 365 days)
    if (gameState.daysPassed % 365 === 0) {
        gameState.annuityPayments.forEach(annuity => {
            if (annuity.nextPaymentDay <= gameState.daysPassed && annuity.paymentsRemaining > 0) {
                // Apply taxes (29% total: 24% federal + 5% state)
                const afterTax = annuity.amount * 0.71;
                gameState.balance += afterTax;

                // Update for next payment
                annuity.amount *= (1 + annuity.yearlyIncrease);
                annuity.nextPaymentDay += 365;
                annuity.paymentsRemaining--;
            }
        });

        // Remove completed annuities
        gameState.annuityPayments = gameState.annuityPayments.filter(a => a.paymentsRemaining > 0);
    }

    updateUI();

    // Check for game over
    if (gameState.balance < 0) {
        gameOver();
    }
}

// Find item by ID and category
function findItem(itemId, category) {
    return gameItems[category].find(item => item.id === itemId);
}

// Calculate total debt
function calculateTotalDebt() {
    return gameState.ownedItems.reduce((total, owned) => {
        return total + (owned.remainingBalance || 0);
    }, 0);
}

// Calculate net assets (total value of items - debt)
function calculateNetAssets() {
    let totalAssetValue = 0;

    gameState.ownedItems.forEach(owned => {
        const item = findItem(owned.itemId, owned.category);
        // Skip subscriptions (they have no asset value)
        if (item.isSubscription) return;

        const daysOwned = gameState.daysPassed - owned.purchaseDay;
        const yearsOwned = daysOwned / 365;
        const depreciationRate = item.depreciation || 0.10;
        const currentValue = owned.purchasePrice * Math.pow(1 - depreciationRate, yearsOwned);

        totalAssetValue += currentValue * (owned.quantity || 1);
    });

    return totalAssetValue - calculateTotalDebt();
}

// Calculate available credit (credit limit - current debt)
function getAvailableCredit() {
    return gameState.creditLimit - calculateTotalDebt();
}

// Render Shop
function renderShop() {
    renderCategory('housingItems', gameItems.housing, 'housing');
    renderCategory('vehicleItems', gameItems.vehicles, 'vehicles');
    renderCategory('luxuryItems', gameItems.luxury, 'luxury');
    renderCategory('lifestyleItems', gameItems.lifestyle, 'lifestyle');
}

function renderCategory(containerId, items, category) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    items.forEach(item => {
        const itemCard = createItemCard(item, category);
        container.appendChild(itemCard);
    });
}

function createItemCard(item, category) {
    const card = document.createElement('div');
    card.className = 'item-card';

    const ownedItem = gameState.ownedItems.find(owned => owned.itemId === item.id && owned.category === category);
    const quantity = ownedItem ? ownedItem.quantity : 0;
    const availableCredit = getAvailableCredit();

    // For subscriptions (rent, lifestyle), just need to afford monthly expense
    const isSubscription = item.isSubscription || item.price === 0;

    // Can afford if you have cash OR available credit
    const canAffordCash = gameState.balance >= item.price;
    const canAffordWithCredit = item.price > 0 && (gameState.balance + availableCredit) >= item.price;
    const canAfford = canAffordCash || (canAffordWithCredit && !isSubscription);

    // For financing, check if can afford down payment (cash or credit)
    const downPaymentAmount = item.downPayment ? item.price * item.downPayment : item.price;
    const canAffordDownPaymentCash = gameState.balance >= downPaymentAmount;
    const canAffordDownPaymentCredit = (gameState.balance + availableCredit) >= downPaymentAmount;
    const canAffordDownPayment = item.downPayment ? (canAffordDownPaymentCash || canAffordDownPaymentCredit) : canAfford;

    if (quantity > 0 && !item.allowMultiple) {
        card.classList.add('owned');
    }

    const monthlyPayment = item.downPayment ? calculateMonthlyPayment(item.price - downPaymentAmount, item.interestRate, item.financeMonths) : 0;

    // Determine which buttons to show
    let buttonsHTML = '';
    if (!ownedItem || item.allowMultiple || item.isSubscription) {
        if (isSubscription) {
            // Subscription items (rent, lifestyle)
            buttonsHTML = `
                <button class="item-btn subscribe-btn" data-action="subscribe">
                    ${item.canCancel ? 'Subscribe' : 'Add'}
                </button>
            `;
        } else {
            // Purchase items
            buttonsHTML = `
                ${item.downPayment ? `
                    <button class="item-btn ${canAffordDownPayment ? 'finance-btn' : 'disabled'}"
                            ${canAffordDownPayment ? '' : 'disabled'}
                            data-action="finance">
                        Finance ${!canAffordDownPaymentCash ? '(using credit)' : ''}
                    </button>
                ` : ''}
                <button class="item-btn ${canAfford ? '' : 'disabled'}"
                        ${canAfford ? '' : 'disabled'}
                        data-action="buy">
                    Buy Cash ${!canAffordCash && canAffordWithCredit ? '(using credit)' : ''}
                </button>
            `;
        }
    }

    card.innerHTML = `
        <div class="item-emoji">${item.emoji}</div>
        <div class="item-name">${item.name}</div>
        ${quantity > 0 ? `<div class="item-quantity">Owned: ${quantity}</div>` : ''}
        ${item.price > 0 ? `<div class="item-price">${formatMoney(item.price)}</div>` : ''}
        ${item.downPayment ? `
            <div class="item-down-payment">Down: ${formatMoney(downPaymentAmount)} (${(item.downPayment * 100).toFixed(0)}%)</div>
            <div class="item-financing">+${formatMoney(monthlyPayment)}/mo for ${item.financeMonths}mo</div>
        ` : ''}
        <div class="item-expense">${item.monthlyExpense > 0 ? formatMoney(item.monthlyExpense) + '/mo' : 'No upkeep'}</div>
        <div class="item-buttons">
            ${buttonsHTML}
        </div>
    `;

    // Add event listeners for buttons
    const buyBtn = card.querySelector('[data-action="buy"]');
    if (buyBtn && canAfford) {
        buyBtn.addEventListener('click', () => buyItem(item, category, false));
    }

    const financeBtn = card.querySelector('[data-action="finance"]');
    if (financeBtn && canAffordDownPayment) {
        financeBtn.addEventListener('click', () => buyItem(item, category, true));
    }

    const subscribeBtn = card.querySelector('[data-action="subscribe"]');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', () => buyItem(item, category, false));
    }

    return card;
}

// Calculate monthly payment for financing
function calculateMonthlyPayment(principal, annualRate, months) {
    if (months === 0 || annualRate === 0) return principal;
    const monthlyRate = annualRate / 12;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
}

// Buy Item
function buyItem(item, category, useFinancing) {
    const cost = useFinancing && item.downPayment ? item.price * item.downPayment : item.price;
    const availableCredit = getAvailableCredit();

    // For subscriptions with no purchase price
    if (item.price === 0 || item.isSubscription) {
        addItem(item, category, false);
        renderShop();
        updateUI();
        return;
    }

    // Check if can afford with cash
    if (gameState.balance >= cost) {
        gameState.balance -= cost;
        addItem(item, category, useFinancing);
        renderShop();
        updateUI();
    }
    // Check if can afford with credit
    else if (gameState.balance + availableCredit >= cost) {
        // Use remaining cash, finance the rest as debt
        const needsFromCredit = cost - gameState.balance;
        gameState.balance = 0; // Use all available cash

        // When using credit, item is automatically financed
        addItem(item, category, true, needsFromCredit);
        renderShop();
        updateUI();
    }
}

function addItem(item, category, isFinanced, creditUsed = 0) {
    const existingItem = gameState.ownedItems.find(owned => owned.itemId === item.id && owned.category === category);

    if (existingItem && item.allowMultiple) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;

        // Add financing info if financed
        if (isFinanced) {
            let principal;
            let interestRate;
            let financeMonths;

            if (creditUsed > 0) {
                // Used credit to purchase
                principal = creditUsed;
                interestRate = 0.08; // Credit card rate ~8% APR
                financeMonths = 120; // 10 years for credit purchases
            } else if (item.downPayment) {
                // Traditional financing
                principal = item.price * (1 - item.downPayment);
                interestRate = item.interestRate;
                financeMonths = item.financeMonths;
            }

            if (principal) {
                const monthlyPayment = calculateMonthlyPayment(principal, interestRate, financeMonths);
                existingItem.isFinanced = true;
                existingItem.remainingBalance = (existingItem.remainingBalance || 0) + principal;
                existingItem.monthlyPayment = (existingItem.monthlyPayment || 0) + monthlyPayment;
                existingItem.interestRate = interestRate;
            }
        }
    } else if (!existingItem) {
        const ownedItem = {
            itemId: item.id,
            category: category,
            quantity: 1,
            purchasePrice: item.price,
            purchaseDay: gameState.daysPassed,
            isFinanced: false,
            remainingBalance: 0,
            monthlyPayment: 0
        };

        // Add financing info if financed
        if (isFinanced) {
            let principal;
            let interestRate;
            let financeMonths;

            if (creditUsed > 0) {
                // Used credit to purchase
                principal = creditUsed;
                interestRate = 0.08; // Credit card rate ~8% APR
                financeMonths = 120; // 10 years for credit purchases
            } else if (item.downPayment) {
                // Traditional financing
                principal = item.price * (1 - item.downPayment);
                interestRate = item.interestRate;
                financeMonths = item.financeMonths;
            }

            if (principal) {
                const monthlyPayment = calculateMonthlyPayment(principal, interestRate, financeMonths);
                ownedItem.isFinanced = true;
                ownedItem.remainingBalance = principal;
                ownedItem.monthlyPayment = monthlyPayment;
                ownedItem.interestRate = interestRate;
            }
        }

        gameState.ownedItems.push(ownedItem);
    }

    updateOwnedItems();
}

// Sell Item
function sellItem(itemId, category) {
    const ownedItem = gameState.ownedItems.find(owned => owned.itemId === itemId && owned.category === category);
    if (!ownedItem) return;

    const item = findItem(itemId, category);
    const daysOwned = gameState.daysPassed - ownedItem.purchaseDay;
    const yearsOwned = daysOwned / 365;

    // Calculate depreciated value
    const depreciationRate = item.depreciation || 0.10;
    const currentValue = ownedItem.purchasePrice * Math.pow(1 - depreciationRate, yearsOwned);

    // If financed, need to pay off remaining balance
    let saleProceeds = currentValue;
    if (ownedItem.isFinanced && ownedItem.remainingBalance > 0) {
        saleProceeds -= ownedItem.remainingBalance;
    }

    gameState.balance += saleProceeds;

    // Decrease quantity or remove item
    if (ownedItem.quantity > 1) {
        ownedItem.quantity--;
        // Reduce financing proportionally
        if (ownedItem.isFinanced) {
            const ratio = (ownedItem.quantity) / (ownedItem.quantity + 1);
            ownedItem.remainingBalance *= ratio;
            ownedItem.monthlyPayment *= ratio;
        }
    } else {
        const index = gameState.ownedItems.indexOf(ownedItem);
        gameState.ownedItems.splice(index, 1);
    }

    renderShop();
    updateOwnedItems();
    updateUI();
}

// Cancel subscription
function cancelSubscription(itemId, category) {
    const index = gameState.ownedItems.findIndex(owned => owned.itemId === itemId && owned.category === category);
    if (index !== -1) {
        gameState.ownedItems.splice(index, 1);
        updateOwnedItems();
        renderShop();
        updateUI();
    }
}

// Update UI
function updateUI() {
    // Update financial stats
    gameState.totalDebt = calculateTotalDebt();
    gameState.netAssets = calculateNetAssets();
    const availableCredit = getAvailableCredit();

    document.getElementById('balance').textContent = formatMoney(gameState.balance);
    document.getElementById('balance').className = 'stat-value ' + (gameState.balance < 0 ? 'negative' : gameState.balance < gameState.monthlyExpenses ? 'warning' : '');
    document.getElementById('income').textContent = formatMoney(gameState.annualIncome);
    document.getElementById('expenses').textContent = formatMoney(gameState.monthlyExpenses);
    document.getElementById('daysSurvived').textContent = gameState.daysPassed;

    // Update new stats if elements exist
    const netAssetsEl = document.getElementById('netAssets');
    if (netAssetsEl) {
        netAssetsEl.textContent = formatMoney(gameState.netAssets);
        netAssetsEl.className = 'stat-value ' + (gameState.netAssets < 0 ? 'negative' : '');
    }

    const totalDebtEl = document.getElementById('totalDebt');
    if (totalDebtEl) {
        totalDebtEl.textContent = formatMoney(gameState.totalDebt);
        totalDebtEl.className = 'stat-value ' + (gameState.totalDebt > 0 ? 'warning' : '');
    }

    const availableCreditEl = document.getElementById('availableCredit');
    if (availableCreditEl) {
        availableCreditEl.textContent = formatMoney(availableCredit);
        availableCreditEl.className = 'stat-value ' + (availableCredit < gameState.creditLimit * 0.2 ? 'warning' : '');
    }
}

function updateOwnedItems() {
    const container = document.getElementById('ownedList');

    if (gameState.ownedItems.length === 0) {
        container.innerHTML = '<p class="no-items">No items yet. Start shopping!</p>';
        return;
    }

    container.innerHTML = gameState.ownedItems.map(owned => {
        const item = findItem(owned.itemId, owned.category);
        const daysOwned = gameState.daysPassed - owned.purchaseDay;
        const yearsOwned = daysOwned / 365;
        const depreciationRate = item.depreciation || 0.10;
        const currentValue = owned.purchasePrice * Math.pow(1 - depreciationRate, yearsOwned);
        const saleValue = owned.isFinanced ? currentValue - owned.remainingBalance : currentValue;

        const totalMonthlyExpense = (item.monthlyExpense * (owned.quantity || 1)) + (owned.monthlyPayment || 0);

        return `
            <div class="owned-item">
                <div class="owned-header">
                    <span class="owned-emoji">${item.emoji}</span>
                    <span class="owned-name">${item.name}${owned.quantity > 1 ? ` x${owned.quantity}` : ''}</span>
                    <span class="owned-cost">${formatMoney(totalMonthlyExpense)}/mo</span>
                </div>
                ${owned.isFinanced ? `
                    <div class="owned-financing">
                        Loan: ${formatMoney(owned.remainingBalance)} remaining
                    </div>
                ` : ''}
                <div class="owned-actions">
                    <span class="sell-value">Sell: ${formatMoney(saleValue)}</span>
                    ${item.isSubscription && item.canCancel ? `
                        <button class="action-btn cancel-btn" onclick="cancelSubscription('${owned.itemId}', '${owned.category}')">Cancel</button>
                    ` : `
                        <button class="action-btn sell-btn" onclick="sellItem('${owned.itemId}', '${owned.category}')">Sell</button>
                    `}
                </div>
            </div>
        `;
    }).join('');
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
    document.getElementById('finalItems').textContent = gameState.ownedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    showScreen('gameOverScreen');
}

// Reset Game
function resetGame() {
    if (gameState.gameLoop) {
        clearInterval(gameState.gameLoop);
    }
    showScreen('startScreen');
}

// Life Events - Income Adjustment
function openIncomeModal() {
    document.getElementById('newIncome').value = gameState.annualIncome;
    document.getElementById('incomeModal').style.display = 'block';
}

function applyNewIncome() {
    const newIncome = parseInt(document.getElementById('newIncome').value);
    if (newIncome > 0) {
        gameState.annualIncome = newIncome;
        gameState.monthlyIncome = newIncome / 12;
        gameState.creditLimit = newIncome * 6;
        updateUI();
        closeModals();
    }
}

// Life Events - Powerball
function openPowerballModal() {
    document.getElementById('powerballModal').style.display = 'block';
    updatePowerballCalculations();
}

function updatePowerballCalculations() {
    const jackpot = parseFloat(document.getElementById('jackpotAmount').value) || 100000000;

    // Cash option calculations (52% of jackpot)
    const cashValue = jackpot * 0.52;
    const federalTaxCash = cashValue * 0.24;
    const stateTaxCash = cashValue * 0.05;
    const takeHomeCash = cashValue - federalTaxCash - stateTaxCash;

    document.getElementById('cashValue').textContent = formatMoney(cashValue);
    document.getElementById('federalTaxCash').textContent = '-' + formatMoney(federalTaxCash);
    document.getElementById('stateTaxCash').textContent = '-' + formatMoney(stateTaxCash);
    document.getElementById('takeHomeCash').textContent = formatMoney(takeHomeCash);

    // Annuity calculations (30 payments with 5% annual increase)
    const firstPayment = jackpot / 30; // Simplified: total divided by 30
    const finalPayment = firstPayment * Math.pow(1.05, 29); // After 29 increases
    const takeHomeFirst = firstPayment * 0.71; // After 29% taxes

    document.getElementById('firstPayment').textContent = formatMoney(firstPayment);
    document.getElementById('finalPayment').textContent = formatMoney(finalPayment);
    document.getElementById('takeHomeAnnuity').textContent = formatMoney(takeHomeFirst);
}

function choosePowerballPayout(type) {
    const jackpot = parseFloat(document.getElementById('jackpotAmount').value) || 100000000;

    if (type === 'cash') {
        // Lump sum: 52% of jackpot, minus 29% taxes
        const cashValue = jackpot * 0.52;
        const takeHome = cashValue * 0.71;
        gameState.balance += takeHome;
    } else {
        // Annuity: 30 payments starting now, increasing 5% per year
        const firstPayment = jackpot / 30;
        const afterTax = firstPayment * 0.71;

        // Add first payment immediately
        gameState.balance += afterTax;

        // Schedule remaining 29 payments
        gameState.annuityPayments.push({
            amount: firstPayment * 1.05, // Next year's payment (5% increase)
            nextPaymentDay: gameState.daysPassed + 365,
            paymentsRemaining: 29,
            yearlyIncrease: 0.05
        });
    }

    updateUI();
    closeModals();
}

function closeModals() {
    document.getElementById('incomeModal').style.display = 'none';
    document.getElementById('powerballModal').style.display = 'none';
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
