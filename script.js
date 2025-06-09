// DOM elements
const modal = document.getElementById('moduleModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    console.log('🛡️ CyberGuard Training Platform loaded');
    
    // Load and display user profile
    loadUserProfile();
    
    // Add event listeners for navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // You can add page navigation logic here later
            console.log('Navigated to:', this.textContent);
        });
    });
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
});

// User Profile Functions
function loadUserProfile() {
    const userProfile = JSON.parse(localStorage.getItem('cyberGuardProfile'));
    if (userProfile) {
        displayUserStats(userProfile);
        createProfileSection(userProfile);
    } else {
        createWelcomeMessage();
    }
}

function displayUserStats(userProfile) {
    // Update hero section with user stats
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const statsHtml = `
            <div class="user-stats" style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); 
                 border-radius: 15px; padding: 20px; margin: 20px 0; display: grid; 
                 grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                <div class="stat-item" style="text-align: center; color: white;">
                    <div style="font-size: 24px; font-weight: bold;">${userProfile.totalScore || 0}</div>
                    <div style="font-size: 14px; opacity: 0.9;">Total Score</div>
                </div>
                <div class="stat-item" style="text-align: center; color: white;">
                    <div style="font-size: 24px; font-weight: bold;">${userProfile.gamesPlayed?.length || 0}</div>
                    <div style="font-size: 14px; opacity: 0.9;">Games Played</div>
                </div>
                <div class="stat-item" style="text-align: center; color: white;">
                    <div style="font-size: 24px; font-weight: bold;">${userProfile.achievements?.length || 0}</div>
                    <div style="font-size: 14px; opacity: 0.9;">Achievements</div>
                </div>
                <div class="stat-item" style="text-align: center; color: white;">
                    <div style="font-size: 24px; font-weight: bold;">${getLastActiveText(userProfile.lastActive)}</div>
                    <div style="font-size: 14px; opacity: 0.9;">Last Active</div>
                </div>
            </div>
        `;
        
        // Insert stats after hero content
        const heroContent = heroSection.querySelector('.hero-content');
        if (heroContent) {
            heroContent.insertAdjacentHTML('afterend', statsHtml);
        }
    }
}

function createProfileSection(userProfile) {
    // Add profile section after modules
    const modulesSection = document.querySelector('.modules');
    if (modulesSection) {
        const profileHtml = `
            <section class="profile-section" style="background: #f8f9fa; padding: 2rem 0; margin-top: 2rem;">
                <div class="container">
                    <h2 style="text-align: center; margin-bottom: 2rem; color: #2c3e50;">
                        <i class="fas fa-user-circle"></i> Your Progress
                    </h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                        <div class="game-scores" style="background: white; padding: 1.5rem; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <h3 style="color: #667eea; margin-bottom: 1rem;">🎮 Game Scores</h3>
                            ${generateGameScoresHtml(userProfile.gamesPlayed)}
                        </div>
                        
                        <div class="achievements" style="background: white; padding: 1.5rem; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <h3 style="color: #667eea; margin-bottom: 1rem;">🏆 Achievements</h3>
                            ${generateAchievementsHtml(userProfile.achievements)}
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <button class="btn btn-primary" onclick="resetProgress()" style="margin-right: 1rem;">
                            🔄 Reset Progress
                        </button>
                        <button class="btn btn-primary" onclick="exportProgress()">
                            📊 Export Data
                        </button>
                    </div>
                </div>
            </section>
        `;
        
        modulesSection.insertAdjacentHTML('afterend', profileHtml);
    }
}

function createWelcomeMessage() {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const welcomeHtml = `
            <div class="welcome-message" style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); 
                 border-radius: 15px; padding: 20px; margin: 20px 0; text-align: center; color: white;">
                <h3>👋 Welcome to CyberGuard!</h3>
                <p>Start playing games to track your progress and earn achievements!</p>
                <button class="btn btn-primary" onclick="window.location.href='password-chef.html'" 
                        style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3);">
                    🍳 Start with Password Chef Academy
                </button>
            </div>
        `;
        
        const heroContent = heroSection.querySelector('.hero-content');
        if (heroContent) {
            heroContent.insertAdjacentHTML('afterend', welcomeHtml);
        }
    }
}

function generateGameScoresHtml(gamesPlayed) {
    if (!gamesPlayed || gamesPlayed.length === 0) {
        return '<p style="color: #666; font-style: italic;">No games played yet. Start playing to see your scores!</p>';
    }
    
    return gamesPlayed.map(game => `
        <div style="display: flex; justify-content: space-between; align-items: center; 
             padding: 10px; border-radius: 8px; background: #f8f9fa; margin-bottom: 10px;">
            <div>
                <strong>${game.gameName}</strong><br>
                <small style="color: #666;">Level ${game.level || 1} • ${game.ordersCompleted || 0} completed</small>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 18px; font-weight: bold; color: #667eea;">${game.score}</div>
                <small style="color: #666;">points</small>
            </div>
        </div>
    `).join('');
}

function generateAchievementsHtml(achievements) {
    if (!achievements || achievements.length === 0) {
        return '<p style="color: #666; font-style: italic;">No achievements yet. Keep playing to unlock them!</p>';
    }
    
    return achievements.map(achievement => `
        <div style="display: flex; align-items: center; padding: 10px; border-radius: 8px; 
             background: linear-gradient(135deg, #ffd700, #ffed4e); margin-bottom: 10px;">
            <div style="font-size: 24px; margin-right: 10px;">🏆</div>
            <div>
                <strong>${achievement.title}</strong><br>
                <small style="color: #666;">${achievement.description}</small><br>
                <small style="color: #888;">Earned: ${formatDate(achievement.earnedDate)}</small>
            </div>
        </div>
    `).join('');
}

function getLastActiveText(lastActive) {
    if (!lastActive) return 'Never';
    
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffHours = Math.floor((now - lastActiveDate) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Now';
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return formatDate(lastActive);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
}

function resetProgress() {
    if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
        localStorage.removeItem('cyberGuardProfile');
        localStorage.removeItem('passwordChefData');
        localStorage.removeItem('phishingGameData');
        alert('Progress reset successfully!');
        location.reload();
    }
}

function exportProgress() {
    const userProfile = JSON.parse(localStorage.getItem('cyberGuardProfile'));
    if (!userProfile) {
        alert('No progress data to export!');
        return;
    }
    
    const exportData = {
        exportDate: new Date().toISOString(),
        userProfile: userProfile,
        gamesData: {
            passwordChef: JSON.parse(localStorage.getItem('passwordChefData')),
            phishingGame: JSON.parse(localStorage.getItem('phishingGameData'))
        }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `cyberguard-progress-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    alert('Progress data exported successfully!');
}

function generateLeaderboardContent() {
    const userProfile = JSON.parse(localStorage.getItem('cyberGuardProfile'));
    
    // Simulate other users for demo (in a real app, this would come from a server)
    const simulatedLeaderboard = [
        { name: 'Alex Smith', score: 1250, achievements: 8, gamesPlayed: 3 },
        { name: 'Sarah Johnson', score: 1180, achievements: 6, gamesPlayed: 2 },
        { name: 'Mike Chen', score: 1120, achievements: 7, gamesPlayed: 4 },
        { name: 'Emma Davis', score: 980, achievements: 5, gamesPlayed: 2 },
        { name: 'John Wilson', score: 850, achievements: 4, gamesPlayed: 1 }
    ];
    
    // Add current user if they have a score
    if (userProfile && userProfile.totalScore > 0) {
        simulatedLeaderboard.push({
            name: 'You',
            score: userProfile.totalScore,
            achievements: userProfile.achievements?.length || 0,
            gamesPlayed: userProfile.gamesPlayed?.length || 0,
            isCurrentUser: true
        });
    }
    
    // Sort by score
    simulatedLeaderboard.sort((a, b) => b.score - a.score);
    
    if (simulatedLeaderboard.length === 0) {
        return '<div style="background: #f8f9ff; padding: 1rem; border-radius: 8px; margin: 1rem 0; text-align: center; color: #666;">No scores yet. Play some games to appear on the leaderboard!</div>';
    }
    
    const leaderboardHtml = simulatedLeaderboard.slice(0, 10).map((user, index) => {
        const medals = ['🥇', '🥈', '🥉'];
        const medal = index < 3 ? medals[index] : `${index + 1}.`;
        const isCurrentUser = user.isCurrentUser;
        const bgColor = isCurrentUser ? '#e3f2fd' : '#f8f9ff';
        const borderColor = isCurrentUser ? '#2196f3' : 'transparent';
        
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; 
                 padding: 10px 15px; margin: 5px 0; border-radius: 8px; 
                 background: ${bgColor}; border: 2px solid ${borderColor};">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 18px; min-width: 30px;">${medal}</span>
                    <div>
                        <strong style="${isCurrentUser ? 'color: #2196f3;' : ''}">${user.name}</strong>
                        <div style="font-size: 12px; color: #666;">
                            🏆 ${user.achievements} achievements • 🎮 ${user.gamesPlayed} games
                        </div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 18px; font-weight: bold; ${isCurrentUser ? 'color: #2196f3;' : 'color: #667eea;'}">${user.score}</div>
                    <div style="font-size: 12px; color: #666;">points</div>
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <div style="background: #f8f9ff; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
            <strong>🏆 Top Performers:</strong>
            <div style="margin-top: 10px;">
                ${leaderboardHtml}
            </div>
            ${userProfile && userProfile.totalScore > 0 ? 
                '<div style="margin-top: 10px; padding: 10px; background: rgba(33, 150, 243, 0.1); border-radius: 8px; text-align: center; font-size: 14px; color: #2196f3;"><strong>💡 Tip:</strong> Keep playing games to climb the leaderboard!</div>' : 
                '<div style="margin-top: 10px; padding: 10px; background: rgba(255, 193, 7, 0.1); border-radius: 8px; text-align: center; font-size: 14px; color: #f57c00;"><strong>🎮 Play games to join the leaderboard!</strong></div>'
            }
        </div>
    `;
}

function refreshLeaderboard() {
    // Refresh the leaderboard modal content
    const leaderboardContent = getModuleContent('leaderboard');
    modalBody.innerHTML = leaderboardContent.content;
}

// Module functionality
function openModule(moduleName) {
    // Redirect to specific games based on module
    if (moduleName === 'games') {
        window.location.href = 'password-chef.html';
        return;
    }
    if (moduleName === 'phishing') {
        window.location.href = 'phishing-game.html';
        return;
    }
    
    const moduleContent = getModuleContent(moduleName);
    modalTitle.textContent = moduleContent.title;
    modalBody.innerHTML = moduleContent.content;
    modal.style.display = 'block';
    
    // Add entrance animation
    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
        modal.querySelector('.modal-content').style.opacity = '1';
    }, 10);
    
    console.log('Opened module:', moduleName);
}

// Get module content based on user stories from CSV
function getModuleContent(moduleName) {
    const modules = {
        games: {
            title: 'Security Games',
            content: `
                <div>
                    <p>🎮 <strong>Password Chef Academy Available!</strong></p>
                    <p>🍳 Cook up secure passwords in our hilarious cooking game!</p>
                    <ul style="margin: 1rem 0; padding-left: 1.5rem;">
                        <li>👨‍🍳 Become a Password Master Chef</li>
                        <li>🔥 Experience hilarious kitchen disasters for bad passwords</li>
                        <li>🏆 Score points for creating secure password recipes</li>
                        <li>📚 Learn password security through comedy</li>
                    </ul>
                    <button class="btn btn-primary" onclick="window.location.href='password-chef.html'" style="margin-top: 1rem;">Play Password Chef!</button>
                </div>
            `
        },
        assessments: {
            title: 'Cybersecurity Assessments',
            content: `
                <div>
                    <p>📋 <strong>Comprehensive Testing System</strong></p>
                    <ul style="margin: 1rem 0; padding-left: 1.5rem;">
                        <li>Department-specific assessments (IT, HR, Finance)</li>
                        <li>Multiple difficulty levels</li>
                        <li>Immediate feedback on answers</li>
                        <li>Multimedia questions with real scenarios</li>
                    </ul>
                    <button class="btn btn-primary" onclick="closeModal()" style="margin-top: 1rem;">Coming Soon!</button>
                </div>
            `
        },
        phishing: {
            title: 'Phishing Simulation',
            content: `
                <div>
                    <p>🎣 <strong>Phishing Awareness Training</strong></p>
                    <ul style="margin: 1rem 0; padding-left: 1.5rem;">
                        <li>Simulated phishing emails</li>
                        <li>Department-specific scenarios</li>
                        <li>Immediate feedback for failed tests</li>
                        <li>One-click threat reporting</li>
                    </ul>
                    <button class="btn btn-primary" onclick="closeModal()" style="margin-top: 1rem;">Coming Soon!</button>
                </div>
            `
        },
        reports: {
            title: 'Progress & Analytics',
            content: `
                <div>
                    <p>📊 <strong>Comprehensive Reporting</strong></p>
                    <ul style="margin: 1rem 0; padding-left: 1.5rem;">
                        <li>Individual and team performance trends</li>
                        <li>Knowledge gap analysis</li>
                        <li>Department completion dashboards</li>
                        <li>Audit-ready compliance reports</li>
                    </ul>
                    <button class="btn btn-primary" onclick="closeModal()" style="margin-top: 1rem;">Coming Soon!</button>
                </div>
            `
        },
        leaderboard: {
            title: 'Leaderboard',
            content: `
                <div>
                    <p>🏆 <strong>Competitive Learning</strong></p>
                    ${generateLeaderboardContent()}
                    <div style="margin-top: 1rem; text-align: center;">
                        <button class="btn btn-primary" onclick="closeModal()" style="margin-right: 1rem;">Close</button>
                        <button class="btn btn-primary" onclick="refreshLeaderboard()">🔄 Refresh</button>
                    </div>
                </div>
            `
        }
    };
    
    return modules[moduleName] || {
        title: 'Module',
        content: '<p>This module is under development.</p>'
    };
}

// Help system functionality
function showHelp(helpType) {
    const helpContent = getHelpContent(helpType);
    modalTitle.textContent = helpContent.title;
    modalBody.innerHTML = helpContent.content;
    modal.style.display = 'block';
    
    console.log('Opened help:', helpType);
}

function getHelpContent(helpType) {
    const helpSections = {
        faq: {
            title: 'FAQ',
            content: `
                <div>
                    <h4 style="color: #667eea;">How do I start an assessment?</h4>
                    <p>Click on "Assessments" and select "Take Assessment".</p>
                    <h4 style="color: #667eea;">What if I fail a phishing test?</h4>
                    <p>You'll receive immediate feedback and tips to improve.</p>
                </div>
            `
        },
        tutorials: {
            title: 'Tutorials',
            content: `
                <div>
                    <p>🎥 <strong>Available Tutorials:</strong></p>
                    <ul style="margin: 1rem 0; padding-left: 1.5rem;">
                        <li>Getting Started (5 min)</li>
                        <li>Taking Assessments (3 min)</li>
                        <li>Phishing Simulations (7 min)</li>
                    </ul>
                </div>
            `
        },
        contact: {
            title: 'Contact Support',
            content: `
                <div>
                    <p>📧 Email: support@cyberguard.company</p>
                    <p>📞 Phone: 1-800-CYBER-HELP</p>
                    <p>💬 Live Chat: 9 AM - 5 PM EST</p>
                </div>
            `
        }
    };
    
    return helpSections[helpType] || {
        title: 'Help',
        content: 'Help content not found.'
    };
}

// Quick actions functionality
function quickAction(actionType) {
    // Redirect to phishing game for quick quiz
    if (actionType === 'takeQuiz') {
        window.location.href = 'phishing-game.html';
        return;
    }
    
    const actions = {
        reportThreat: 'Report Security Threat',
        takeQuiz: 'Quick Security Quiz',
        viewTips: 'Security Tips'
    };
    
    const action = actions[actionType];
    if (action) {
        modalTitle.textContent = action;
        modalBody.innerHTML = `
            <div style="text-align: center; padding: 1rem;">
                <p>This feature is coming soon!</p>
                <button class="btn btn-primary" onclick="closeModal()" style="margin-top: 1rem;">Got it!</button>
            </div>
        `;
        modal.style.display = 'block';
    }
    
    console.log('Quick action:', actionType);
}

// Modal functionality
function closeModal() {
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'scale(0.8)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modal.style.display = 'none';
        modalContent.style.transform = 'scale(1)';
        modalContent.style.opacity = '1';
    }, 300);
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
}

// Close modal with escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// Simulate some dynamic data updates (for demo purposes)
function updateStats() {
    // This would normally fetch real data from your backend
    console.log('Stats updated (demo mode)');
}

// Initialize stats update
setInterval(updateStats, 30000); // Update every 30 seconds

// Add some interactive feedback
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        // Add button click animation
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 150);
    }
});

// Console welcome message
console.log(`
🛡️ CyberGuard Training Platform
Version: 1.0.0 (Development)
Based on Agile user stories for comprehensive cybersecurity training.

Features in development:
- Interactive Security Games
- Cybersecurity Assessments  
- Phishing Simulations
- Progress Analytics
- Help & Support System
`);

// Feature flag system for future development
const featureFlags = {
    gamification: true,
    phishingSimulation: true,
    advancedAnalytics: true,
    mobileApp: false,
    samlAuth: false
};

// Export functions for potential future modules
window.CyberGuard = {
    openModule,
    showHelp,
    quickAction,
    closeModal,
    featureFlags
}; 