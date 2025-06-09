#!/usr/bin/env python3
"""
CyberGuard Training Platform - Game Server
Simple Flask backend for phishing detection game
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import datetime
import os

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# 🛡️ Security Headers Middleware
@app.after_request
def add_security_headers(response):
    """Add security headers to all responses"""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data:; connect-src 'self'"
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    return response

# In-memory storage (in production, use a real database)
game_data = {
    "leaderboard": [
        {"name": "Alex Smith", "score": 1250, "level": 3, "accuracy": 95},
        {"name": "Sarah Johnson", "score": 1180, "level": 2, "accuracy": 89},
        {"name": "Mike Chen", "score": 1120, "level": 2, "accuracy": 92},
        {"name": "Demo Player", "score": 0, "level": 1, "accuracy": 100}
    ],
    "email_scenarios": [
        {
            "id": 1,
            "level": 1,
            "difficulty": "Easy",
            "from": "security@amaz0n-verification.com",
            "to": "user@company.com",
            "subject": "URGENT: Verify Your Account Within 24 Hours",
            "date": "Today 3:47 AM",
            "threats": {
                "suspicious-domain": {
                    "description": "Domain uses '0' instead of 'o' - typosquatting attack!",
                    "points": 25,
                    "category": "Domain Spoofing"
                },
                "malicious-link": {
                    "description": "Suspicious URL with fake verification page",
                    "points": 30,
                    "category": "Malicious Links"
                },
                "impersonation": {
                    "description": "Impersonating Amazon security team",
                    "points": 20,
                    "category": "Brand Impersonation"
                },
                "urgency": {
                    "description": "Creates false urgency to pressure quick action",
                    "points": 15,
                    "category": "Social Engineering"
                }
            }
        },
        {
            "id": 2,
            "level": 2,
            "difficulty": "Medium",
            "from": "noreply@paypaI-security.com",
            "to": "user@company.com",
            "subject": "Payment Authorization Required - Action Needed",
            "date": "Today 11:23 AM",
            "threats": {
                "suspicious-domain": {
                    "description": "Uses capital 'I' instead of lowercase 'l' in 'PayPal'",
                    "points": 30,
                    "category": "Domain Spoofing"
                },
                "fake-transaction": {
                    "description": "Fabricated transaction to create urgency",
                    "points": 25,
                    "category": "Social Engineering"
                },
                "malicious-link": {
                    "description": "Fake cancellation link to steal credentials",
                    "points": 30,
                    "category": "Malicious Links"
                }
            }
        }
    ],
    "statistics": {
        "total_games_played": 156,
        "average_score": 850,
        "common_mistakes": [
            "Missing domain spoofing (45% miss rate)",
            "Clicking malicious links (32% miss rate)",
            "Ignoring urgency tactics (28% miss rate)"
        ]
    }
}

@app.route('/')
def index():
    """Serve the main page"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_file(filename):
    """Serve static files"""
    return send_from_directory('.', filename)

@app.route('/api/game/scenarios')
def get_scenarios():
    """Get all email scenarios for the game"""
    return jsonify({
        "status": "success",
        "scenarios": game_data["email_scenarios"]
    })

@app.route('/api/game/scenario/<int:level>')
def get_scenario(level):
    """Get a specific scenario by level"""
    scenario = next((s for s in game_data["email_scenarios"] if s["level"] == level), None)
    if scenario:
        return jsonify({
            "status": "success",
            "scenario": scenario
        })
    return jsonify({
        "status": "error", 
        "message": "Scenario not found"
    }), 404

@app.route('/api/game/submit-score', methods=['POST'])
def submit_score():
    """Submit game score and update leaderboard"""
    data = request.get_json()
    
    required_fields = ['player_name', 'score', 'level', 'threats_found', 'accuracy']
    if not all(field in data for field in required_fields):
        return jsonify({
            "status": "error",
            "message": "Missing required fields"
        }), 400
    
    # Create new player entry
    new_entry = {
        "name": data['player_name'],
        "score": data['score'],
        "level": data['level'],
        "accuracy": data['accuracy'],
        "threats_found": data['threats_found'],
        "timestamp": datetime.datetime.now().isoformat()
    }
    
    # Add to leaderboard and sort by score
    game_data["leaderboard"].append(new_entry)
    game_data["leaderboard"].sort(key=lambda x: x['score'], reverse=True)
    
    # Keep only top 10
    game_data["leaderboard"] = game_data["leaderboard"][:10]
    
    return jsonify({
        "status": "success",
        "message": "Score submitted successfully",
        "leaderboard_position": next((i+1 for i, entry in enumerate(game_data["leaderboard"]) 
                                     if entry['name'] == data['player_name']), None)
    })

@app.route('/api/leaderboard')
def get_leaderboard():
    """Get current leaderboard"""
    return jsonify({
        "status": "success",
        "leaderboard": game_data["leaderboard"]
    })

@app.route('/api/statistics')
def get_statistics():
    """Get game statistics"""
    return jsonify({
        "status": "success",
        "statistics": game_data["statistics"]
    })

@app.route('/api/game/validate-threats', methods=['POST'])
def validate_threats():
    """Validate user's threat identification"""
    data = request.get_json()
    
    level = data.get('level', 1)
    found_threats = set(data.get('found_threats', []))
    
    # Get the scenario for this level
    scenario = next((s for s in game_data["email_scenarios"] if s["level"] == level), None)
    if not scenario:
        return jsonify({
            "status": "error",
            "message": "Invalid level"
        }), 400
    
    all_threats = set(scenario["threats"].keys())
    missed_threats = all_threats - found_threats
    false_positives = found_threats - all_threats
    
    # Calculate score
    score = 0
    for threat in found_threats:
        if threat in scenario["threats"]:
            score += scenario["threats"][threat]["points"]
    
    # Bonus for perfect identification
    if len(missed_threats) == 0 and len(false_positives) == 0:
        score += 50
    
    # Calculate accuracy
    total_clicks = data.get('total_clicks', len(found_threats))
    accuracy = (len(found_threats & all_threats) / max(total_clicks, 1)) * 100
    
    return jsonify({
        "status": "success",
        "validation": {
            "score": score,
            "accuracy": round(accuracy, 1),
            "found_threats": list(found_threats & all_threats),
            "missed_threats": list(missed_threats),
            "false_positives": list(false_positives),
            "total_threats": len(all_threats),
            "threats_found": len(found_threats & all_threats),
            "perfect_score": len(missed_threats) == 0 and len(false_positives) == 0
        }
    })

@app.route('/api/game/hints/<int:level>')
def get_hints(level):
    """Get hints for a specific level"""
    scenario = next((s for s in game_data["email_scenarios"] if s["level"] == level), None)
    if not scenario:
        return jsonify({
            "status": "error",
            "message": "Invalid level"
        }), 400
    
    hints = []
    for threat_type, info in scenario["threats"].items():
        hints.append({
            "threat_type": threat_type,
            "hint": f"Look for {threat_type.replace('-', ' ')}: {info['description']}",
            "category": info["category"],
            "points": info["points"]
        })
    
    return jsonify({
        "status": "success",
        "hints": hints
    })

@app.route('/health')
def health_check_simple():
    """Health check endpoint for App Engine"""
    return jsonify({
        "status": "healthy",
        "service": "Cyber Ninja Academy",
        "version": "1.0.0",
        "timestamp": datetime.datetime.now().isoformat()
    })

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "CyberGuard Game Server",
        "version": "1.0.0",
        "timestamp": datetime.datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🚀 Starting CyberGuard Training Platform Server...")
    print("📊 Game endpoints available:")
    print("   - GET  /api/game/scenarios - Get all scenarios")
    print("   - GET  /api/game/scenario/<level> - Get specific scenario")
    print("   - POST /api/game/submit-score - Submit game score")
    print("   - POST /api/game/validate-threats - Validate threat identification")
    print("   - GET  /api/leaderboard - Get leaderboard")
    print("   - GET  /api/statistics - Get game statistics")
    print("   - GET  /api/game/hints/<level> - Get hints for level")
    print("   - GET  /api/health - Health check")
    print("\n🎮 Game server running on http://localhost:5000")
    print("🌐 Access the game at http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000) 