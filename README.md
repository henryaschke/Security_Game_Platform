# 🥷 Cyber Ninja Academy - Security Training Platform

![Security Badge](https://img.shields.io/badge/security-DevSecOps-green.svg)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue.svg)
![Platform](https://img.shields.io/badge/platform-GCP%20App%20Engine-orange.svg)
![License](https://img.shields.io/badge/license-MIT-purple.svg)

## 🌟 Overview

Welcome to the **Cyber Ninja Academy** - an interactive cybersecurity training platform that transforms learning security concepts into an engaging, game-based experience. Built with a dark ninja-themed UI and comprehensive DevSecOps practices.

## ✨ Features

### 🎮 Interactive Training Games
- **🍳 Ninja Password Chef Dojo**: Learn password security through cooking metaphors
- **🕵️ Ninja Trap Detection Dojo**: Master phishing email identification skills
- **📊 Real-time Progress Tracking**: LocalStorage-based achievement system
- **🏆 Leaderboards & Scoring**: Competitive learning environment

### 🛡️ Security-First Design
- **Matrix-themed Dark UI** with animated cyber effects
- **Security Headers**: CSP, HSTS, X-Frame-Options, XSS Protection
- **Input Validation & Sanitization** across all endpoints
- **OWASP Security Standards** compliance

### 🚀 DevSecOps Pipeline
- **Multi-stage Security Scanning**: Trivy, CodeQL, ESLint, Bandit, OWASP ZAP
- **Automated Testing**: Unit, integration, and security tests
- **Infrastructure as Code**: GCP App Engine deployment
- **Environment Separation**: Staging and production workflows

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   CI/CD         │    │   Backend       │
│                 │    │                 │    │                 │
│ • HTML5/CSS3    │    │ • GitHub Actions│    │ • Python/Flask  │
│ • JavaScript    │    │ • Security Scans│    │ • RESTful API   │
│ • Local Storage │    │ • Automated Test│    │ • Health Checks │
│ • Ninja Theme   │    │ • GCP Deploy    │    │ • Secure Headers│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Google Cloud SDK
- Git

### Local Development
```bash
# Clone the repository
git clone https://github.com/henryaschke/Security_Game_Platform.git
cd Security_Game_Platform

# Set up virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python game_server.py

# Visit http://localhost:5000 to access the Ninja Hideout
```

### 🔧 GCP Deployment Setup
```bash
# Run the automated setup script
chmod +x setup-gcp.sh
./setup-gcp.sh

# Configure GitHub Secrets:
# - GCP_PROJECT_ID: Your GCP project ID
# - GCP_SA_KEY: Service account JSON key
```

## 🛡️ Security Features

### Automated Security Scanning
- **🔍 Vulnerability Detection**: Trivy filesystem scanning
- **📝 Static Analysis**: CodeQL for JavaScript and Python
- **🐍 Python Security**: Bandit security linting
- **🌐 Dynamic Testing**: OWASP ZAP post-deployment scans

### Runtime Security
- **Security Headers**: Comprehensive HTTP security headers
- **Input Validation**: XSS and injection prevention
- **Secure Dependencies**: Automated vulnerability monitoring
- **Health Monitoring**: Continuous application health checks

## 📊 Game Modules

### 🍳 Password Chef Academy
Transform password security education into a cooking game where students "cook" secure passwords using various security "ingredients":

- **Ingredients**: Length, symbols, numbers, uniqueness
- **Cooking Process**: Drag-and-drop priority ordering
- **Disasters**: Humorous feedback for weak passwords
- **Real Passwords**: Generate actual secure passwords

### 🕵️ Phishing Detective
Train students to identify phishing emails through interactive analysis:

- **Real-world Scenarios**: Based on actual phishing campaigns
- **Threat Identification**: Click on suspicious elements
- **Educational Feedback**: Detailed explanations of attack vectors
- **Progressive Difficulty**: Multiple skill levels

## 🔄 CI/CD Pipeline

### Workflow Stages
1. **🔍 Security Scan**: Multi-tool vulnerability analysis
2. **🧪 Testing**: Comprehensive test suite execution
3. **🏗️ Build**: Application packaging and containerization
4. **🚀 Deploy**: Automated staging and production deployment
5. **📊 Monitor**: Post-deployment security validation

### Branch Strategy
- `main` → Production deployment
- `develop` → Staging environment
- Feature branches → Security scanning + testing only

## 📈 Monitoring & Analytics

### Performance Metrics
- **Response Time Monitoring**: Sub-1-second response targets
- **Security Scan Results**: Continuous vulnerability tracking
- **User Engagement**: Game completion and achievement rates
- **System Health**: Automated health check monitoring

## 🎯 Educational Objectives

### Learning Outcomes
- **Password Security**: Understanding strong password creation
- **Phishing Awareness**: Identifying common attack vectors
- **Security Mindset**: Developing cybersecurity intuition
- **Risk Assessment**: Evaluating digital security threats

### Target Audience
- **Students**: Cybersecurity and IT programs
- **Professionals**: Corporate security training
- **Educators**: Cybersecurity curriculum enhancement
- **General Users**: Personal security awareness

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the test suite
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OWASP**: Security best practices and guidelines
- **NIST**: Cybersecurity framework standards
- **GitHub Actions**: CI/CD automation platform
- **Google Cloud**: Hosting and deployment infrastructure

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/henryaschke/Security_Game_Platform/issues)
- **Documentation**: [Deployment Guide](DEPLOYMENT_GUIDE.md)
- **Security**: Report security issues privately via email

---

**🥷 "Master the art of cyber security through ninja training!" 🥷**

*Built with ❤️ for cybersecurity education and powered by DevSecOps best practices.*
