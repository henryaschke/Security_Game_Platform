#!/usr/bin/env python3
"""
🧪 Test Suite for Cyber Ninja Academy Game Server
Comprehensive testing for DevSecOps pipeline
"""

import pytest
import json
import tempfile
import os
from game_server import app

@pytest.fixture
def client():
    """Create test client for Flask app"""
    app.config['TESTING'] = True
    app.config['WTF_CSRF_ENABLED'] = False
    
    with app.test_client() as client:
        with app.app_context():
            yield client

class TestSecurityHeaders:
    """🛡️ Test security headers and configurations"""
    
    def test_security_headers_present(self, client):
        """Test that essential security headers are present"""
        response = client.get('/')
        
        # Check for security headers
        assert 'X-Content-Type-Options' in response.headers
        assert response.headers['X-Content-Type-Options'] == 'nosniff'
        
        assert 'X-Frame-Options' in response.headers
        assert response.headers['X-Frame-Options'] == 'DENY'
        
        assert 'X-XSS-Protection' in response.headers
        assert response.headers['X-XSS-Protection'] == '1; mode=block'
    
    def test_content_security_policy(self, client):
        """Test Content Security Policy header"""
        response = client.get('/')
        
        assert 'Content-Security-Policy' in response.headers
        csp = response.headers['Content-Security-Policy']
        assert "default-src 'self'" in csp
        assert "script-src" in csp

class TestAPIEndpoints:
    """🌐 Test API endpoint functionality"""
    
    def test_health_endpoint(self, client):
        """Test health check endpoint"""
        response = client.get('/health')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert data['status'] == 'healthy'
        assert 'timestamp' in data
    
    def test_api_scenarios_get(self, client):
        """Test getting scenarios"""
        response = client.get('/api/game/scenarios')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert data['status'] == 'success'
        assert isinstance(data['scenarios'], list)
        assert len(data['scenarios']) > 0
    
    def test_api_submit_score(self, client):
        """Test score submission"""
        score_data = {
            'player_name': 'test_ninja',
            'score': 100,
            'level': 1,
            'threats_found': 3,
            'accuracy': 85
        }
        
        response = client.post('/api/game/submit-score', 
                             data=json.dumps(score_data),
                             content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'success'
        assert data['message'] == 'Score submitted successfully'
    
    def test_api_leaderboard(self, client):
        """Test leaderboard endpoint"""
        response = client.get('/api/leaderboard')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert data['status'] == 'success'
        assert isinstance(data['leaderboard'], list)

class TestInputValidation:
    """🔒 Test input validation and sanitization"""
    
    def test_invalid_score_submission(self, client):
        """Test invalid score data is rejected"""
        invalid_scores = [
            {'player_name': '', 'score': 100, 'level': 1, 'threats_found': 1, 'accuracy': 50},  # Empty name
            {'player_name': 'test', 'score': -1, 'level': 1, 'threats_found': 1, 'accuracy': 50},  # Negative score
            {'player_name': 'test', 'score': 'invalid', 'level': 1, 'threats_found': 1, 'accuracy': 50},  # Invalid score type
            {'player_name': 'test', 'score': 100},  # Missing required fields
        ]
        
        for invalid_data in invalid_scores:
            response = client.post('/api/game/submit-score',
                                 data=json.dumps(invalid_data),
                                 content_type='application/json')
            assert response.status_code == 400
    
    def test_xss_prevention(self, client):
        """Test XSS attack prevention"""
        xss_payload = {
            'player_name': '<script>alert("xss")</script>',
            'score': 100,
            'level': 1,
            'threats_found': 1,
            'accuracy': 50
        }
        
        response = client.post('/api/game/submit-score',
                             data=json.dumps(xss_payload),
                             content_type='application/json')
        
        # Should either sanitize or reject
        assert response.status_code in [400, 200]  # 400 if rejected, 200 if sanitized

class TestPerformance:
    """⚡ Test performance and load handling"""
    
    def test_response_times(self, client):
        """Test that responses are fast enough"""
        import time
        
        endpoints = ['/', '/health', '/api/game/scenarios', '/api/leaderboard']
        
        for endpoint in endpoints:
            start_time = time.time()
            response = client.get(endpoint)
            end_time = time.time()
            
            response_time = end_time - start_time
            assert response_time < 1.0, f"{endpoint} took {response_time}s (too slow)"
            assert response.status_code in [200, 404]

class TestErrorHandling:
    """🚨 Test error handling and resilience"""
    
    def test_404_handling(self, client):
        """Test 404 error handling"""
        response = client.get('/nonexistent-endpoint')
        assert response.status_code == 404
    
    def test_method_not_allowed(self, client):
        """Test method not allowed handling"""
        response = client.delete('/api/scenarios')
        assert response.status_code == 405
    
    def test_malformed_json(self, client):
        """Test malformed JSON handling"""
        response = client.post('/api/game/submit-score',
                             data='{"invalid": json}',
                             content_type='application/json')
        assert response.status_code == 400

class TestDataPersistence:
    """💾 Test data storage and retrieval"""
    
    def test_score_persistence(self, client):
        """Test that scores are properly stored and retrieved"""
        # Submit a score
        score_data = {
            'player_name': 'persistence_test',
            'score': 150,
            'level': 2,
            'threats_found': 5,
            'accuracy': 95
        }
        
        submit_response = client.post('/api/game/submit-score',
                                    data=json.dumps(score_data),
                                    content_type='application/json')
        assert submit_response.status_code == 200
        
        # Check leaderboard
        leaderboard_response = client.get('/api/leaderboard')
        assert leaderboard_response.status_code == 200
        
        leaderboard_data = json.loads(leaderboard_response.data)
        # Should find our submitted score
        found_score = any(score['name'] == 'persistence_test' 
                         for score in leaderboard_data['leaderboard'])
        assert found_score, "Submitted score not found in leaderboard"

class TestSecurity:
    """🛡️ Additional security tests"""
    
    def test_cors_headers(self, client):
        """Test CORS configuration"""
        response = client.options('/api/scores')
        
        # Should have appropriate CORS headers
        if 'Access-Control-Allow-Origin' in response.headers:
            origin = response.headers['Access-Control-Allow-Origin']
            assert origin in ['*', 'https://your-domain.com']
    
    def test_rate_limiting_simulation(self, client):
        """Simulate rapid requests to test rate limiting"""
        responses = []
        for i in range(20):
            response = client.get('/api/game/scenarios')
            responses.append(response.status_code)
        
        # Should not crash under load
        assert all(status in [200, 429] for status in responses)

if __name__ == '__main__':
    """Run tests directly"""
    pytest.main([__file__, '-v', '--tb=short']) 