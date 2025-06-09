#!/bin/bash
# 🥷 Cyber Ninja Academy - GCP Setup Script
# Run this script to set up your GCP environment for CI/CD deployment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🥷 Cyber Ninja Academy - GCP Setup${NC}"
echo "=================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI not found. Please install it first:${NC}"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project ID
read -p "Enter your GCP Project ID: " PROJECT_ID
if [[ -z "$PROJECT_ID" ]]; then
    echo -e "${RED}❌ Project ID cannot be empty${NC}"
    exit 1
fi

# Set the project
echo -e "${YELLOW}🔧 Setting GCP project...${NC}"
gcloud config set project "$PROJECT_ID"

# Enable required APIs
echo -e "${YELLOW}🔧 Enabling required APIs...${NC}"
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Create App Engine application
echo -e "${YELLOW}🔧 Creating App Engine application...${NC}"
if ! gcloud app describe &> /dev/null; then
    gcloud app create --region=us-central1
    echo -e "${GREEN}✅ App Engine application created${NC}"
else
    echo -e "${GREEN}✅ App Engine application already exists${NC}"
fi

# Create service account
SERVICE_ACCOUNT="cyber-ninja-deploy"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT}@${PROJECT_ID}.iam.gserviceaccount.com"

echo -e "${YELLOW}🔧 Creating service account...${NC}"
if ! gcloud iam service-accounts describe "$SERVICE_ACCOUNT_EMAIL" &> /dev/null; then
    gcloud iam service-accounts create "$SERVICE_ACCOUNT" \
        --description="Service account for Cyber Ninja Academy CI/CD" \
        --display-name="Cyber Ninja Deploy"
    echo -e "${GREEN}✅ Service account created${NC}"
else
    echo -e "${GREEN}✅ Service account already exists${NC}"
fi

# Grant IAM roles
echo -e "${YELLOW}🔧 Granting IAM roles...${NC}"
ROLES=(
    "roles/appengine.deployer"
    "roles/appengine.serviceAdmin"
    "roles/storage.admin"
    "roles/cloudbuild.builds.editor"
)

for role in "${ROLES[@]}"; do
    gcloud projects add-iam-policy-binding "$PROJECT_ID" \
        --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
        --role="$role" &> /dev/null
    echo -e "${GREEN}✅ Granted $role${NC}"
done

# Create service account key
KEY_FILE="cyber-ninja-key.json"
echo -e "${YELLOW}🔧 Creating service account key...${NC}"
gcloud iam service-accounts keys create "$KEY_FILE" \
    --iam-account="$SERVICE_ACCOUNT_EMAIL"

echo -e "${GREEN}✅ Service account key saved to $KEY_FILE${NC}"

# Display GitHub Secrets information
echo ""
echo -e "${BLUE}🔐 GitHub Secrets Configuration${NC}"
echo "================================="
echo -e "${YELLOW}Add these secrets to your GitHub repository:${NC}"
echo ""
echo -e "${GREEN}GCP_PROJECT_ID:${NC} $PROJECT_ID"
echo -e "${GREEN}GCP_SA_KEY:${NC} [Copy the entire contents of $KEY_FILE]"
echo ""
echo -e "${YELLOW}To add secrets:${NC}"
echo "1. Go to your GitHub repository"
echo "2. Settings → Secrets and variables → Actions"
echo "3. Click 'New repository secret'"
echo "4. Add each secret above"
echo ""

# Display next steps
echo -e "${BLUE}📋 Next Steps${NC}"
echo "=============="
echo "1. Copy the contents of $KEY_FILE to GitHub as GCP_SA_KEY secret"
echo "2. Add GCP_PROJECT_ID as a GitHub secret with value: $PROJECT_ID"
echo "3. Push code to 'develop' branch to test staging deployment"
echo "4. Push code to 'main' branch for production deployment"
echo ""

# Security warning
echo -e "${RED}⚠️  SECURITY WARNING ⚠️${NC}"
echo "- Keep $KEY_FILE secure and never commit it to version control"
echo "- Add $KEY_FILE to your .gitignore"
echo "- Delete $KEY_FILE after copying to GitHub secrets"
echo ""

# Add to gitignore
if ! grep -q "$KEY_FILE" .gitignore 2>/dev/null; then
    echo "$KEY_FILE" >> .gitignore
    echo -e "${GREEN}✅ Added $KEY_FILE to .gitignore${NC}"
fi

echo -e "${GREEN}🎉 GCP setup complete! Your Cyber Ninja Academy is ready for deployment!${NC}" 