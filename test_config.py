"""
Test configuration for Cyber Ninja Academy
"""
import os
import sys
import tempfile
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

# Test configuration
TEST_CONFIG = {
    'TESTING': True,
    'SECRET_KEY': 'test-secret-key-for-testing-only',
    'WTF_CSRF_ENABLED': False,
    'SERVER_NAME': 'localhost:5000'
}

# Test data directory
TEST_DATA_DIR = project_root / 'test_data'
TEST_DATA_DIR.mkdir(exist_ok=True)

def setup_test_environment():
    """Setup test environment variables"""
    os.environ['TESTING'] = 'True'
    os.environ['SECRET_KEY'] = TEST_CONFIG['SECRET_KEY']
    
def cleanup_test_environment():
    """Cleanup test environment"""
    test_files = TEST_DATA_DIR.glob('*')
    for file in test_files:
        if file.is_file():
            file.unlink() 