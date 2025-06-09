# 🥷 Cyber Ninja Academy - Secure CI/CD Deployment Guide

## 🚀 Overview
This guide walks you through setting up a secure CI/CD pipeline for the Cyber Ninja Academy platform using GitHub Actions and Google Cloud Platform (GCP).

## 📋 Prerequisites

### 1. 🌐 Google Cloud Platform Setup
```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Login and set project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### 2. 🔐 Service Account Creation
```bash
# Create service account for deployment
gcloud iam service-accounts create cyber-ninja-deploy \
    --description="Service account for Cyber Ninja Academy CI/CD" \
    --display-name="Cyber Ninja Deploy"

# Grant necessary permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:cyber-ninja-deploy@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/appengine.deployer"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:cyber-ninja-deploy@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/appengine.serviceAdmin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:cyber-ninja-deploy@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:cyber-ninja-deploy@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/cloudbuild.builds.editor"

# Create and download service account key
gcloud iam service-accounts keys create cyber-ninja-key.json \
    --iam-account=cyber-ninja-deploy@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### 3. 📱 App Engine Setup
```bash
# Enable App Engine API
gcloud services enable appengine.googleapis.com

# Create App Engine application
gcloud app create --region=us-central1
```

## 🔒 GitHub Secrets Configuration

Navigate to your GitHub repository → Settings → Secrets and variables → Actions

### Required Secrets:
```
GCP_PROJECT_ID = your-gcp-project-id
GCP_SA_KEY = [Contents of cyber-ninja-key.json file]
SLACK_WEBHOOK = [Optional: Your Slack webhook URL for notifications]
```

### Adding the Service Account Key:
1. Open `cyber-ninja-key.json` in a text editor
2. Copy the entire JSON content
3. Paste it into the `GCP_SA_KEY` secret (including curly braces)

## 🌳 Branch Strategy

### Main Branch (`main`)
- **Purpose**: Production deployments
- **Triggers**: Push to main branch
- **Environment**: Production App Engine
- **URL**: `https://YOUR_PROJECT_ID.appspot.com`

### Development Branch (`develop`)
- **Purpose**: Staging deployments
- **Triggers**: Push to develop branch
- **Environment**: Staging App Engine service
- **URL**: `https://cyber-ninja-academy-staging-dot-YOUR_PROJECT_ID.appspot.com`

### Feature Branches
- **Purpose**: Development and testing
- **Triggers**: Pull requests to main/develop
- **Actions**: Security scanning, testing, building (no deployment)

## 🛡️ Security Pipeline Stages

### 1. 🔍 Security Scanning
- **Trivy**: Vulnerability scanning
- **CodeQL**: Static analysis
- **ESLint**: JavaScript security
- **Bandit**: Python security
- **OWASP ZAP**: Post-deployment scanning

### 2. 🧪 Testing
- **Unit Tests**: Python/Flask testing
- **Integration Tests**: API endpoint testing
- **Security Tests**: Input validation, XSS prevention
- **Performance Tests**: Response time validation

### 3. 🏗️ Building
- **Dependency Management**: Lock file generation
- **Asset Compilation**: Static file optimization
- **Container Building**: Docker image creation (optional)
- **Artifact Storage**: Build artifact preservation

### 4. 🚀 Deployment
- **Staging**: Automatic deployment on develop push
- **Production**: Automatic deployment on main push
- **Health Checks**: Automated smoke testing
- **Rollback**: Manual rollback capability

## 📊 Monitoring and Alerting

### Health Checks
- **Endpoint**: `/health`
- **Interval**: 30 seconds
- **Timeout**: 4 seconds

### Security Monitoring
- **OWASP ZAP**: Weekly security scans
- **Dependency Updates**: Automated vulnerability scanning
- **Log Monitoring**: GCP Cloud Logging integration

## 🔧 Local Development

### Setup
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/cyber-ninja-academy.git
cd cyber-ninja-academy

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run tests
python -m pytest test_game_server.py -v

# Start development server
python game_server.py
```

### Testing Pipeline Locally
```bash
# Install act (GitHub Actions local runner)
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run security scan locally
act -j security-scan

# Run tests locally
act -j test
```

## 🚨 Emergency Procedures

### Rollback Production
```bash
# List previous versions
gcloud app versions list

# Rollback to previous version
gcloud app services set-traffic default --splits=PREVIOUS_VERSION=1
```

### Security Incident Response
1. **Immediate**: Stop traffic to affected service
2. **Investigate**: Check security scan results and logs
3. **Fix**: Apply security patches
4. **Redeploy**: Use emergency deployment workflow
5. **Monitor**: Increased monitoring post-incident

## 📈 Performance Optimization

### App Engine Configuration
- **Instance Class**: F2 (production), F1 (staging)
- **Auto Scaling**: 1-10 instances (production), 0-3 (staging)
- **CPU Utilization**: 60% target (production), 80% (staging)

### Security Headers
All responses include:
- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `X-XSS-Protection`
- `Content-Security-Policy`
- `Referrer-Policy`

## 🔍 Troubleshooting

### Common Issues

#### Deployment Fails
```bash
# Check App Engine logs
gcloud app logs tail -s default

# Check deployment status
gcloud app versions list
```

#### Security Scan Failures
- Review Trivy/CodeQL reports in GitHub Security tab
- Fix identified vulnerabilities
- Update dependencies if needed

#### Performance Issues
- Monitor App Engine metrics in GCP Console
- Adjust instance configuration if needed
- Review application logs for bottlenecks

## 📞 Support

### Resources
- **GitHub Actions**: `.github/workflows/cicd-pipeline.yml`
- **GCP Console**: `https://console.cloud.google.com`
- **Security Reports**: GitHub Security tab
- **Logs**: GCP Cloud Logging

### Best Practices
1. **Never commit secrets** to the repository
2. **Always test changes** in staging first
3. **Monitor security scans** regularly
4. **Keep dependencies updated**
5. **Review deployment logs** after each release

---

## 🎯 Quick Start Checklist

- [ ] GCP project created and configured
- [ ] Service account created with proper permissions
- [ ] GitHub secrets configured
- [ ] App Engine application created
- [ ] Repository branches (main/develop) set up
- [ ] First deployment tested on staging
- [ ] Security scans passing
- [ ] Production deployment successful
- [ ] Monitoring and alerts configured

**🥷 Your Cyber Ninja Academy is now ready for secure, automated deployments!** 