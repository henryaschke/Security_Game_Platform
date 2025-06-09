// Phishing Detective Game Logic

let game = {
    score: 0,
    level: 1,
    threatsFound: 0,
    totalClicks: 0,
    correctClicks: 0,
    foundThreats: new Set(),
    hintsUsed: 0,
    maxHints: 3,
    
    threats: {
        "suspicious-domain": { description: "Domain uses '0' instead of 'o' - typosquatting!", points: 25 },
        "malicious-link": { description: "Suspicious URL with fake verification", points: 30 },
        "impersonation": { description: "Fake Amazon security team", points: 20 },
        "urgency": { description: "Creates false urgency pressure", points: 15 }
    },

    init() {
        this.updateDisplay();
        this.attachListeners();
    },

    attachListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('clickable-element')) {
                this.handleClick(e.target);
            }
        });
    },

    handleClick(element) {
        this.totalClicks++;
        const threatType = element.getAttribute('data-threat');
        
        if (threatType && this.threats[threatType]) {
            if (!this.foundThreats.has(threatType)) {
                this.foundThreats.add(threatType);
                this.threatsFound++;
                this.correctClicks++;
                
                const points = this.threats[threatType].points;
                this.score += points;
                
                element.classList.add('found-threat');
                
                const indicator = document.querySelector(`[data-indicator="${threatType}"]`);
                if (indicator) {
                    indicator.classList.add('found');
                }
                
                this.showFeedback(element, `+${points} points!`);
                this.updateDisplay();
            }
        } else {
            element.classList.add('found-safe');
            this.showFeedback(element, 'Safe element');
        }
    },

    showFeedback(element, text) {
        const feedback = document.createElement('div');
        feedback.textContent = text;
        feedback.style.cssText = `
            position: fixed;
            background: #28a745;
            color: white;
            padding: 0.5rem;
            border-radius: 4px;
            font-weight: bold;
            z-index: 1000;
            animation: fadeOut 2s forwards;
        `;
        
        const rect = element.getBoundingClientRect();
        feedback.style.left = rect.left + 'px';
        feedback.style.top = (rect.top - 40) + 'px';
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentNode) {
                document.body.removeChild(feedback);
            }
        }, 2000);
    },

    updateDisplay() {
        document.getElementById('currentLevel').textContent = this.level;
        document.getElementById('score').textContent = this.score;
        document.getElementById('threatsFound').textContent = this.threatsFound;
        
        const accuracy = this.totalClicks > 0 ? Math.round((this.correctClicks / this.totalClicks) * 100) : 100;
        document.getElementById('accuracy').textContent = accuracy + '%';
        
        const hintBtn = document.getElementById('hintBtn');
        if (this.hintsUsed >= this.maxHints) {
            hintBtn.textContent = '💡 No Hints Left';
            hintBtn.disabled = true;
        } else {
            hintBtn.innerHTML = `<i class="fas fa-lightbulb"></i> Get Hint (${this.maxHints - this.hintsUsed} left)`;
        }
    }
};

function submitAnalysis() {
    const totalThreats = Object.keys(game.threats).length;
    const foundCount = game.foundThreats.size;
    
    // Mark missed threats
    Object.keys(game.threats).forEach(threatType => {
        if (!game.foundThreats.has(threatType)) {
            const indicator = document.querySelector(`[data-indicator="${threatType}"]`);
            if (indicator) {
                indicator.classList.add('missed');
            }
        }
    });
    
    const feedbackPanel = document.getElementById('feedbackPanel');
    const feedbackTitle = document.getElementById('feedbackTitle');
    const feedbackContent = document.getElementById('feedbackContent');
    
    let feedbackHTML = '';
    
    if (foundCount === totalThreats) {
        feedbackPanel.className = 'feedback-panel feedback-correct';
        feedbackTitle.textContent = '🎉 Perfect Analysis!';
        feedbackHTML = `<p>Excellent! You found all ${totalThreats} threats.</p>`;
        game.score += 50; // Bonus
    } else {
        feedbackPanel.className = 'feedback-panel feedback-incorrect';
        feedbackTitle.textContent = `⚠️ Analysis Complete`;
        feedbackHTML = `<p>You found ${foundCount} out of ${totalThreats} threats.</p>`;
    }
    
    // Add threat explanations
    feedbackHTML += '<h4>Threat Analysis:</h4>';
    Object.entries(game.threats).forEach(([threatType, info]) => {
        const found = game.foundThreats.has(threatType);
        const icon = found ? '✅' : '❌';
        feedbackHTML += `
            <div style="margin: 0.5rem 0; padding: 0.5rem; border-left: 3px solid ${found ? '#28a745' : '#dc3545'};">
                ${icon} ${info.description} (${info.points} points)
            </div>
        `;
    });
    
    feedbackContent.innerHTML = feedbackHTML;
    feedbackPanel.style.display = 'block';
    
    document.getElementById('nextBtn').style.display = 'inline-block';
    document.getElementById('hintBtn').style.display = 'none';
    
    game.updateDisplay();
}

function showHint() {
    if (game.hintsUsed >= game.maxHints) {
        alert('No more hints available!');
        return;
    }
    
    game.hintsUsed++;
    const remainingThreats = Object.keys(game.threats).filter(
        threat => !game.foundThreats.has(threat)
    );
    
    if (remainingThreats.length > 0) {
        const randomThreat = remainingThreats[0];
        const threatInfo = game.threats[randomThreat];
        alert(`💡 Hint: Look for ${randomThreat.replace('-', ' ')}. ${threatInfo.description}`);
    }
    
    game.updateDisplay();
}

function nextLevel() {
    alert('🎉 Great job! You completed the phishing detection demo!\n\nIn the full version, you would advance to more complex phishing scenarios.');
    window.location.href = 'index.html';
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    game.init();
    console.log('🎮 Phishing Detective Game loaded!');
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            0% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
}); 