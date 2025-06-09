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

### 3. ☁️ Cloud Run Setup
```bash
# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Note: Cloud Run services are created automatically during deployment
```

## 🔒 GitHub Secrets Configuration

Navigate to your GitHub repository → Settings → Secrets and variables → Actions

### Required Secrets:
```
GCP_PROJECT_ID = your-gcp-project-id
GCP_SA_KEY = [Contents of cyber-ninja-key.json file]
GCP_REGION = us-central1  # Optional: defaults to us-central1
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
- **Environment**: Production Cloud Run
- **URL**: Generated after deployment (e.g., `https://cyber-ninja-academy-<hash>-uc.a.run.app`)

### Development Branch (`develop`)
- **Purpose**: Staging deployments
- **Triggers**: Push to develop branch
- **Environment**: Staging Cloud Run service
- **URL**: Generated after deployment (e.g., `https://cyber-ninja-academy-staging-<hash>-uc.a.run.app`)

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
# List previous Cloud Run revisions
gcloud run revisions list --service=cyber-ninja-academy --platform=managed --region=us-central1

# Rollback to previous revision
gcloud run services update-traffic cyber-ninja-academy \
    --to-revisions=PREVIOUS_REVISION=100 \
    --platform=managed --region=us-central1
```

### Security Incident Response
1. **Immediate**: Stop traffic to affected service
2. **Investigate**: Check security scan results and logs
3. **Fix**: Apply security patches
4. **Redeploy**: Use emergency deployment workflow
5. **Monitor**: Increased monitoring post-incident

## 📈 Performance Optimization

### Cloud Run Configuration
- **Memory**: 512Mi (configurable)
- **CPU**: 1 vCPU (configurable)
- **Auto Scaling**: 0-10 instances (production), 0-3 (staging)
- **Concurrency**: 80 requests per instance

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
# Check Cloud Run logs
gcloud logs tail projects/YOUR_PROJECT_ID/logs/run.googleapis.com%2Frequests

# Check deployment status
gcloud run services list --platform=managed --region=us-central1
```

#### Security Scan Failures
- Review Trivy/CodeQL reports in GitHub Security tab
- Fix identified vulnerabilities
- Update dependencies if needed

#### Performance Issues
- Monitor Cloud Run metrics in GCP Console
- Adjust memory/CPU configuration if needed
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
- [ ] GitHub secrets configured (including GCP_REGION)
- [ ] Cloud Run APIs enabled
- [ ] Repository branches (main/develop) set up
- [ ] First deployment tested on staging
- [ ] Security scans passing
- [ ] Production deployment successful
- [ ] Monitoring and alerts configured

> 📖 **Migrating from App Engine?** Check the [Migration Guide](MIGRATION_GUIDE.md) for step-by-step instructions.

**🥷 Your Cyber Ninja Academy is now ready for secure, automated Cloud Run deployments!** 