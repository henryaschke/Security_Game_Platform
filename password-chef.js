// Password Chef Academy - The Funniest Password Security Game Ever! 👨‍🍳🔐

let chef = {
    score: 0,
    level: 1,
    ordersCompleted: 0,
    disasters: 0,
    selectedIngredients: new Set(),
    currentOrder: 0,
    currentPhase: 'selection', // 'selection', 'ordering', 'result'
    ingredientOrder: [],
    generatedPassword: '',
    
    orders: [
        {
            title: "🍕 Super Secure Password Pizza",
            description: "A customer wants a 'Super Secure Password Pizza' for their banking account! Make it extra strong with special toppings.",
            requirements: ['lowercase', 'uppercase', 'numbers', 'symbols', 'length'],
            tip: "Banking passwords need ALL the ingredients!",
            successMessage: "Perfect! This password pizza is so secure, even the Italian cyber-mafia can't crack it! 🍕🔐",
            points: 100
        },
        {
            title: "🍔 Email Account Burger",
            description: "Someone ordered an 'Email Account Burger' - they want it medium-rare security!",
            requirements: ['lowercase', 'uppercase', 'numbers', 'length'],
            tip: "Email accounts need good basics: letters and numbers with length!",
            successMessage: "Delicious! This burger is so secure, spam emails bounce right off! 🍔✉️",
            points: 80
        },
        {
            title: "🌮 Social Media Taco Supreme",
            description: "A trendy customer wants a 'Social Media Taco Supreme' - Instagram-worthy but Fort Knox secure!",
            requirements: ['lowercase', 'uppercase', 'symbols', 'unique'],
            tip: "Social media passwords should be unique and have some spice!",
            successMessage: "Amazing! This taco is so secure, even hackers will double-tap it! 🌮📱",
            points: 90
        },
        {
            title: "🍰 Work Account Layer Cake",
            description: "The boss ordered a 'Work Account Layer Cake' for the entire office - it better be enterprise-grade delicious!",
            requirements: ['lowercase', 'uppercase', 'numbers', 'symbols', 'length', 'unique'],
            tip: "Work passwords need EVERYTHING - this is serious business!",
            successMessage: "Magnificent! This cake is so secure, it got promoted to Senior Password! 🍰💼",
            points: 150
        },
        {
            title: "🍦 Gaming Account Ice Cream",
            description: "A hardcore gamer wants 'Gaming Account Ice Cream' that's cooler than their RGB setup!",
            requirements: ['lowercase', 'uppercase', 'numbers', 'symbols'],
            tip: "Gaming accounts need solid security - no noobs allowed!",
            successMessage: "Epic! This ice cream is so secure, it has its own achievement unlock! 🍦🎮",
            points: 85
        }
    ],
    
    disasterScenarios: [
        {
            title: "🔥 PASSWORD EXPLOSION! 🔥",
            message: "Your password caught fire because it was too weak! The smoke alarm is going crazy! 🚨",
            reason: "Missing ingredients make passwords vulnerable!"
        },
        {
            title: "🐀 HACKER RATS INVASION! 🐀", 
            message: "Cyber-rats invaded because they smelled weak passwords! 🐭🐭🐭",
            reason: "Simple passwords attract digital pests!"
        },
        {
            title: "❄️ SECURITY FREEZE! ❄️",
            message: "Your password was so predictable, it froze the kitchen! 🧊",
            reason: "Predictable passwords are cold as yesterday's leftovers!"
        },
        {
            title: "🌋 VOLCANIC MELTDOWN! 🌋",
            message: "Your password was so short, it caused a volcanic eruption in the kitchen! Lava everywhere! 🌋",
            reason: "Short passwords create explosive security vulnerabilities!"
        },
        {
            title: "👻 GHOST HACKERS! 👻",
            message: "Spooky ghost hackers materialized because your password had no symbols! They're haunting your kitchen! 👻",
            reason: "No symbols means no protection from supernatural cyber threats!"
        }
    ],
    
    init() {
        this.loadFromLocalStorage(); // Load saved progress
        this.loadOrder();
        this.updateDisplay();
        this.startKitchenAmbiance();
        this.updateCookButton();
    },
    
    updateCookButton() {
        const cookBtn = document.querySelector('.chef-btn[onclick="cookPassword()"]');
        if (cookBtn) {
            if (this.currentPhase === 'selection') {
                cookBtn.innerHTML = '<i class="fas fa-fire"></i> Cook Password!';
            } else if (this.currentPhase === 'ordering') {
                cookBtn.innerHTML = '<i class="fas fa-sort"></i> Prioritize Ingredients!';
            }
        }
    },
    
    startKitchenAmbiance() {
        // Add some kitchen atmosphere
        console.log("🍳 Welcome to Password Chef Academy!");
        console.log("👨‍🍳 Remember: A good password is like a good recipe - it needs the right ingredients!");
    },
    
    loadOrder() {
        const order = this.orders[this.currentOrder];
        document.getElementById('orderDescription').textContent = order.description;
        document.getElementById('chefTip').textContent = order.tip;
        this.selectedIngredients.clear();
        this.updateRecipeDisplay();
        this.updatePasswordStrength();
        this.clearSelectedIngredients();
    },
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('orders').textContent = this.ordersCompleted;
        document.getElementById('disasters').textContent = this.disasters;
        
        // Save to localStorage
        this.saveToLocalStorage();
    },
    
    saveToLocalStorage() {
        const gameData = {
            score: this.score,
            level: this.level,
            ordersCompleted: this.ordersCompleted,
            disasters: this.disasters,
            lastPlayed: new Date().toISOString(),
            gameName: 'Password Chef Academy'
        };
        
        // Save individual game data
        localStorage.setItem('passwordChefData', JSON.stringify(gameData));
        
        // Update overall user profile
        let userProfile = JSON.parse(localStorage.getItem('cyberGuardProfile')) || {
            totalScore: 0,
            gamesPlayed: [],
            achievements: [],
            lastActive: new Date().toISOString()
        };
        
        // Update or add this game's data
        const existingGameIndex = userProfile.gamesPlayed.findIndex(game => game.gameName === 'Password Chef Academy');
        if (existingGameIndex >= 0) {
            userProfile.gamesPlayed[existingGameIndex] = gameData;
        } else {
            userProfile.gamesPlayed.push(gameData);
        }
        
        // Calculate total score across all games
        userProfile.totalScore = userProfile.gamesPlayed.reduce((total, game) => total + (game.score || 0), 0);
        userProfile.lastActive = new Date().toISOString();
        
        // Check for achievements
        this.checkAchievements(userProfile, gameData);
        
        localStorage.setItem('cyberGuardProfile', JSON.stringify(userProfile));
    },
    
    loadFromLocalStorage() {
        const savedData = localStorage.getItem('passwordChefData');
        if (savedData) {
            const gameData = JSON.parse(savedData);
            this.score = gameData.score || 0;
            this.level = gameData.level || 1;
            this.ordersCompleted = gameData.ordersCompleted || 0;
            this.disasters = gameData.disasters || 0;
        }
    },
    
    checkAchievements(userProfile, gameData) {
        const newAchievements = [];
        
        // Password Chef specific achievements
        if (gameData.score >= 500 && !userProfile.achievements.includes('chef_master')) {
            newAchievements.push({
                id: 'chef_master',
                title: '👨‍🍳 Master Chef',
                description: 'Scored 500+ points in Password Chef Academy',
                earnedDate: new Date().toISOString()
            });
        }
        
        if (gameData.ordersCompleted >= 10 && !userProfile.achievements.includes('order_master')) {
            newAchievements.push({
                id: 'order_master',
                title: '🍽️ Order Master',
                description: 'Completed 10 orders in Password Chef Academy',
                earnedDate: new Date().toISOString()
            });
        }
        
        if (gameData.disasters === 0 && gameData.ordersCompleted >= 5 && !userProfile.achievements.includes('disaster_free')) {
            newAchievements.push({
                id: 'disaster_free',
                title: '🏆 Disaster-Free Chef',
                description: 'Completed 5+ orders without any kitchen disasters',
                earnedDate: new Date().toISOString()
            });
        }
        
        // Overall platform achievements
        if (userProfile.totalScore >= 1000 && !userProfile.achievements.includes('cyber_warrior')) {
            newAchievements.push({
                id: 'cyber_warrior',
                title: '🛡️ Cyber Warrior',
                description: 'Achieved 1000+ total points across all games',
                earnedDate: new Date().toISOString()
            });
        }
        
        // Add new achievements
        newAchievements.forEach(achievement => {
            if (!userProfile.achievements.find(a => a.id === achievement.id)) {
                userProfile.achievements.push(achievement);
                this.showAchievementNotification(achievement);
            }
        });
    },
    
    showAchievementNotification(achievement) {
        // Create achievement notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 2000;
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #333; padding: 15px 20px; border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            max-width: 300px; animation: slideIn 0.5s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="font-size: 24px;">🏆</div>
                <div>
                    <div style="font-weight: bold; font-size: 16px;">Achievement Unlocked!</div>
                    <div style="font-size: 14px;">${achievement.title}</div>
                    <div style="font-size: 12px; opacity: 0.8;">${achievement.description}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Add click to close
        notification.addEventListener('click', () => notification.remove());
    },
    
    clearSelectedIngredients() {
        document.querySelectorAll('.ingredient').forEach(el => {
            el.classList.remove('selected');
        });
    },
    
    updateRecipeDisplay() {
        const recipeDiv = document.getElementById('currentRecipe');
        if (this.selectedIngredients.size === 0) {
            recipeDiv.textContent = "No ingredients added yet...";
            return;
        }
        
        const ingredientNames = {
            lowercase: "🔤 Lowercase Letters",
            uppercase: "🔠 Uppercase Letters", 
            numbers: "🔢 Numbers",
            symbols: "🎭 Special Symbols",
            length: "📏 Extra Length",
            unique: "✨ Uniqueness Spice"
        };
        
        const recipe = Array.from(this.selectedIngredients)
            .map(ing => ingredientNames[ing])
            .join(" + ");
        
        recipeDiv.textContent = recipe;
    },
    
    updatePasswordStrength() {
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        const strength = this.selectedIngredients.size;
        
        strengthFill.className = 'strength-fill';
        
        if (strength === 0) {
            strengthText.textContent = "Add ingredients to see strength!";
        } else if (strength <= 2) {
            strengthFill.classList.add('strength-weak');
            strengthText.textContent = "🔥 DANGER ZONE! This password will explode!";
        } else if (strength <= 3) {
            strengthFill.classList.add('strength-fair');
            strengthText.textContent = "⚠️ Getting warmer... but still risky!";
        } else if (strength <= 4) {
            strengthFill.classList.add('strength-good');
            strengthText.textContent = "😊 Looking good! Almost restaurant quality!";
        } else {
            strengthFill.classList.add('strength-excellent');
            strengthText.textContent = "🌟 MASTERPIECE! Gordon Ramsay approved!";
        }
    },
    
    updatePotContents() {
        const potContents = document.getElementById('potContents');
        const ingredientCount = this.selectedIngredients.size;
        
        const potStates = [
            "Empty Pot 🍳",
            "Something's Cooking... 🥄",
            "Bubbling Away! 🫧",
            "Smells Good! 😋",
            "Almost Ready... 🔥",
            "Perfect Recipe! ⭐"
        ];
        
        potContents.textContent = potStates[Math.min(ingredientCount, 5)];
        
        if (ingredientCount >= 4) {
            potContents.style.background = '#4caf50';
        } else if (ingredientCount >= 2) {
            potContents.style.background = '#ffa726';
        } else {
            potContents.style.background = '#74b9ff';
        }
    },
    
    // The correct priority order for password security (most to least important)
    correctOrder: ['length', 'unique', 'symbols', 'numbers', 'uppercase', 'lowercase'],
    
    generatePassword() {
        let password = '';
        const ingredients = Array.from(this.selectedIngredients);
        
        // Base components for password generation
        const components = {
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };
        
        // Determine password length
        let targetLength = 8;
        if (this.selectedIngredients.has('length')) {
            targetLength = 16; // Extra length ingredient gives longer password
        }
        
        // Start with at least one character from each selected component
        let charset = '';
        if (this.selectedIngredients.has('lowercase')) {
            password += this.getRandomChar(components.lowercase);
            charset += components.lowercase;
        }
        if (this.selectedIngredients.has('uppercase')) {
            password += this.getRandomChar(components.uppercase);
            charset += components.uppercase;
        }
        if (this.selectedIngredients.has('numbers')) {
            password += this.getRandomChar(components.numbers);
            charset += components.numbers;
        }
        if (this.selectedIngredients.has('symbols')) {
            password += this.getRandomChar(components.symbols);
            charset += components.symbols;
        }
        
        // Fill remaining length with random characters from charset
        while (password.length < targetLength && charset.length > 0) {
            password += this.getRandomChar(charset);
        }
        
        // If unique ingredient is selected, add site-specific suffix
        if (this.selectedIngredients.has('unique')) {
            const currentOrder = this.orders[this.currentOrder];
            if (currentOrder.title.includes('Banking') || currentOrder.title.includes('Work')) {
                password += '_Bank';
            } else if (currentOrder.title.includes('Email')) {
                password += '_Mail';
            } else if (currentOrder.title.includes('Social')) {
                password += '_Social';
            } else if (currentOrder.title.includes('Gaming')) {
                password += '_Game';
            }
        }
        
        // Shuffle the password
        this.generatedPassword = this.shuffleString(password);
        return this.generatedPassword;
    },
    
    getRandomChar(str) {
        return str.charAt(Math.floor(Math.random() * str.length));
    },
    
    shuffleString(str) {
        return str.split('').sort(() => Math.random() - 0.5).join('');
    },
    
    calculateOrderingScore() {
        let score = 0;
        const selectedInOrder = this.ingredientOrder.filter(ing => this.selectedIngredients.has(ing));
        
        // Points for each ingredient in correct relative position
        for (let i = 0; i < selectedInOrder.length; i++) {
            const ingredient = selectedInOrder[i];
            const correctPosition = this.correctOrder.indexOf(ingredient);
            const actualPosition = i;
            
            // Perfect position = full points, close positions = partial points
            const positionDiff = Math.abs(correctPosition - actualPosition);
            if (positionDiff === 0) {
                score += 50; // Perfect position
            } else if (positionDiff <= 1) {
                score += 30; // Close enough
            } else if (positionDiff <= 2) {
                score += 15; // Not too bad
            }
        }
        
        return score;
    }
};

// Global functions for HTML onclick events
function addIngredient(type) {
    if (chef.selectedIngredients.has(type)) {
        chef.selectedIngredients.delete(type);
        document.querySelector(`[data-type="${type}"]`).classList.remove('selected');
    } else {
        chef.selectedIngredients.add(type);
        document.querySelector(`[data-type="${type}"]`).classList.add('selected');
    }
    
    chef.updateRecipeDisplay();
    chef.updatePasswordStrength();
    chef.updatePotContents();
}

function cookPassword() {
    if (chef.currentPhase === 'selection') {
        // Check if we have any ingredients selected
        if (chef.selectedIngredients.size === 0) {
            alert("🍳 Add some ingredients first, chef!");
            return;
        }
        
        // Move to ordering phase
        chef.currentPhase = 'ordering';
        showOrderingPhase();
    } else if (chef.currentPhase === 'ordering') {
        // Process the final cooking with order scoring
        const currentOrder = chef.orders[chef.currentOrder];
        const missingIngredients = currentOrder.requirements.filter(req => 
            !chef.selectedIngredients.has(req)
        );
        
        // More forgiving system - allow success if they have most ingredients or enough security elements
        const hasBasicSecurity = chef.selectedIngredients.has('lowercase') && 
                                chef.selectedIngredients.has('uppercase') && 
                                (chef.selectedIngredients.has('numbers') || chef.selectedIngredients.has('symbols'));
        
        const hasGoodLength = chef.selectedIngredients.has('length') || chef.selectedIngredients.size >= 4;
        
        // Success if: no missing ingredients OR has basic security + good length OR has 4+ ingredients
        if (missingIngredients.length === 0 || (hasBasicSecurity && hasGoodLength) || chef.selectedIngredients.size >= 4) {
            const orderingBonus = chef.calculateOrderingScore();
            chef.generatePassword();
            showSuccess(currentOrder, orderingBonus, missingIngredients);
            chef.score += currentOrder.points + orderingBonus;
            chef.ordersCompleted++;
            
            if (chef.ordersCompleted % 3 === 0) {
                chef.level++;
            }
            
            chef.updateDisplay();
        } else {
            showDisaster(missingIngredients);
            chef.disasters++;
            chef.updateDisplay();
        }
        
        chef.currentPhase = 'result';
    }
}

function showSuccess(order, orderingBonus = 0, missingIngredients = []) {
    const successDiv = document.getElementById('successCelebration');
    const successMessage = document.getElementById('successMessage');
    
    // Determine the success level
    let successLevel = "PERFECT";
    let successEmoji = "🎉";
    let bonusMessage = "";
    
    if (missingIngredients.length > 0) {
        successLevel = "GOOD ENOUGH";
        successEmoji = "👍";
        const ingredientNames = {
            lowercase: "lowercase letters",
            uppercase: "uppercase letters", 
            numbers: "numbers",
            symbols: "symbols",
            length: "extra length",
            unique: "uniqueness"
        };
        const missingNames = missingIngredients.map(ing => ingredientNames[ing]).join(", ");
        bonusMessage = `<p style="color: #ff9a56;"><strong>Note:</strong> Missing ${missingNames}, but you had enough security ingredients to pass!</p>`;
    }
    
    successMessage.innerHTML = `
        <h3>${successEmoji} ${successLevel} ${successEmoji}</h3>
        <p>${order.successMessage}</p>
        <p><strong>📊 Base Points:</strong> +${order.points}</p>
        ${orderingBonus > 0 ? `<p><strong>🎯 Ordering Bonus:</strong> +${orderingBonus} points!</p>` : ''}
        ${bonusMessage}
        ${chef.generatedPassword ? `<div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #007bff;">
            <strong>🔐 Your Cooked Password:</strong><br/>
            <code style="font-size: 18px; color: #007bff; background: white; padding: 5px; border-radius: 4px;">${chef.generatedPassword}</code>
        </div>` : ''}
        <p style="font-size: 12px; color: #666;">💡 Copy this password and use it for your ${order.title.toLowerCase()}!</p>
    `;
    successDiv.style.display = 'flex';
    
    // Add confetti effect
    setTimeout(() => {
        console.log("🎉 " + order.successMessage);
        console.log("🔐 Generated Password: " + chef.generatedPassword);
    }, 100);
}

function closeSuccess() {
    document.getElementById('successCelebration').style.display = 'none';
    nextOrder();
}

function showDisaster(missingIngredients = []) {
    const disasterDiv = document.getElementById('disasterZone');
    const disasterMessage = document.getElementById('disasterMessage');
    
    // Create specific error messages based on what's actually missing
    let disasterTitle = "🔥 KITCHEN DISASTER! 🔥";
    let disasterText = "";
    let learningText = "";
    
    if (missingIngredients.length > 0) {
        const ingredientNames = {
            lowercase: "lowercase letters (a-z)",
            uppercase: "uppercase letters (A-Z)", 
            numbers: "numbers (0-9)",
            symbols: "special symbols (!@#$)",
            length: "extra length (12+ characters)",
            unique: "uniqueness spice (site-specific)"
        };
        
        const missingNames = missingIngredients.map(ing => ingredientNames[ing]).join(", ");
        
        disasterTitle = "🍽️ RECIPE INCOMPLETE! 🍽️";
        disasterText = `Your password recipe is missing: ${missingNames}! The customer is not fully satisfied!`;
        learningText = "Don't worry chef! With 4+ ingredients or basic security elements, you're still cooking something decent!";
    } else {
        // Generic disaster for other cases
        const randomDisaster = chef.disasterScenarios[Math.floor(Math.random() * chef.disasterScenarios.length)];
        disasterTitle = randomDisaster.title;
        disasterText = randomDisaster.message;
        learningText = randomDisaster.reason;
    }
    
    disasterMessage.innerHTML = `
        <h3>${disasterTitle}</h3>
        <p>${disasterText}</p>
        <p><strong>🧑‍🏫 Learning:</strong> ${learningText}</p>
        <p style="color: #3498db; margin-top: 15px;">💡 <strong>Tip:</strong> Try adding the missing ingredients or aim for at least 4 total ingredients for a decent password!</p>
    `;
    
    disasterDiv.style.display = 'block';
    
    // Make the disaster dramatic
    setTimeout(() => {
        console.log("💥 KITCHEN DISASTER: " + disasterText);
    }, 100);
}

function closeDisaster() {
    document.getElementById('disasterZone').style.display = 'none';
}

function clearRecipe() {
    chef.selectedIngredients.clear();
    chef.clearSelectedIngredients();
    chef.updateRecipeDisplay();
    chef.updatePasswordStrength();
    chef.updatePotContents();
}

function getHint() {
    const currentOrder = chef.orders[chef.currentOrder];
    const missingIngredients = currentOrder.requirements.filter(req => 
        !chef.selectedIngredients.has(req)
    );
    
    if (missingIngredients.length === 0) {
        alert("🎉 You already have all the ingredients! Time to cook!");
        return;
    }
    
    const randomMissing = missingIngredients[Math.floor(Math.random() * missingIngredients.length)];
    
    const hints = {
        lowercase: "🔤 Don't forget lowercase letters! Every password needs a-z!",
        uppercase: "🔠 Add UPPERCASE letters! Make your password SHOUT!",
        numbers: "🔢 Throw in some numbers! 1, 2, 3... secure!",
        symbols: "🎭 Spice it up with symbols! !@#$ make hackers cry!",
        length: "📏 Make it longer! 12+ characters for extra security!",
        unique: "✨ Make it unique! Don't reuse like yesterday's leftovers!"
    };
    
    alert(`💡 ${hints[randomMissing]}`);
}

function showOrderingPhase() {
    const orderingDiv = document.createElement('div');
    orderingDiv.id = 'orderingPhase';
    orderingDiv.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; 
        z-index: 1000; color: white; text-align: center;
    `;
    
    const ingredientNames = {
        lowercase: "🔤 Lowercase Letters",
        uppercase: "🔠 Uppercase Letters", 
        numbers: "🔢 Numbers",
        symbols: "🎭 Special Symbols",
        length: "📏 Extra Length",
        unique: "✨ Uniqueness Spice"
    };
    
    const selectedIngredients = Array.from(chef.selectedIngredients);
    
    orderingDiv.innerHTML = `
        <div style="background: #2c3e50; padding: 30px; border-radius: 15px; max-width: 600px; width: 90%;">
            <h2>🍳 Time to Prioritize Your Ingredients! 🍳</h2>
            <p>Drag the ingredients to arrange them in order of importance for password security!</p>
            <p style="color: #3498db;">💡 <strong>Most important should be at the top!</strong></p>
            
            <div id="sortableIngredients" style="margin: 20px 0; min-height: 200px;">
                ${selectedIngredients.map((ing, index) => `
                    <div class="sortable-ingredient" data-ingredient="${ing}" 
                         style="background: #34495e; margin: 10px; padding: 15px; border-radius: 8px; 
                                cursor: move; border: 2px solid #3498db; user-select: none;">
                        <span style="font-size: 18px;">#${index + 1}</span> ${ingredientNames[ing]}
                    </div>
                `).join('')}
            </div>
            
            <div style="margin: 20px 0;">
                <button onclick="finishOrdering()" style="background: #27ae60; color: white; border: none; padding: 15px 30px; border-radius: 8px; font-size: 16px; cursor: pointer;">
                    🍳 Final Cook! 🍳
                </button>
                <button onclick="closeOrderingPhase()" style="background: #e74c3c; color: white; border: none; padding: 15px 30px; border-radius: 8px; font-size: 16px; cursor: pointer; margin-left: 10px;">
                    ❌ Back to Selection
                </button>
            </div>
            
            <div style="background: #34495e; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <p style="color: #ecf0f1; font-size: 14px; margin: 0;">
                    🧑‍🏫 <strong>Chef's Tip:</strong> In real password security, length and uniqueness matter most, 
                    followed by special characters and numbers. Get the order right for bonus points!
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(orderingDiv);
    makeIngredientsSortable();
    chef.updateCookButton();
}

function makeIngredientsSortable() {
    const container = document.getElementById('sortableIngredients');
    let draggedElement = null;
    
    Array.from(container.children).forEach(item => {
        item.draggable = true;
        
        item.addEventListener('dragstart', (e) => {
            draggedElement = item;
            item.style.opacity = '0.5';
        });
        
        item.addEventListener('dragend', (e) => {
            item.style.opacity = '1';
            updateOrderNumbers();
        });
        
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedElement !== item) {
                const rect = item.getBoundingClientRect();
                const next = (e.clientY - rect.top) > (rect.height / 2) ? item.nextSibling : item;
                container.insertBefore(draggedElement, next);
                updateOrderNumbers();
            }
        });
    });
}

function updateOrderNumbers() {
    const container = document.getElementById('sortableIngredients');
    Array.from(container.children).forEach((item, index) => {
        const span = item.querySelector('span');
        span.textContent = `#${index + 1}`;
    });
}

function finishOrdering() {
    const container = document.getElementById('sortableIngredients');
    chef.ingredientOrder = Array.from(container.children).map(item => 
        item.getAttribute('data-ingredient')
    );
    
    // Process the final cooking BEFORE closing the ordering phase
    cookPassword();
    
    // Close the ordering phase UI
    const orderingDiv = document.getElementById('orderingPhase');
    if (orderingDiv) {
        orderingDiv.remove();
    }
}

function closeOrderingPhase() {
    const orderingDiv = document.getElementById('orderingPhase');
    if (orderingDiv) {
        orderingDiv.remove();
    }
    chef.currentPhase = 'selection';
    chef.updateCookButton();
}

function nextOrder() {
    chef.currentOrder = (chef.currentOrder + 1) % chef.orders.length;
    chef.currentPhase = 'selection';
    chef.ingredientOrder = [];
    chef.generatedPassword = '';
    chef.loadOrder();
    
    if (chef.currentOrder === 0 && chef.ordersCompleted > 0) {
        alert(`🎉 Menu cycle complete!\n\n🏆 Score: ${chef.score}\n⭐ Level: ${chef.level}\n🍽️ Orders: ${chef.ordersCompleted}\n💥 Disasters: ${chef.disasters}`);
    }
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    chef.init();
    console.log('👨‍🍳 Password Chef Academy loaded!');
    console.log('🎯 Goal: Create secure passwords by combining the right ingredients!');
    console.log('⚠️ Warning: Bad recipes cause hilarious kitchen disasters!');
}); 