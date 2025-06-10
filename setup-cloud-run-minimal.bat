@echo off
echo Setting up MINIMAL Cloud Run permissions for cyber-ninja-deploy service account...
echo Based on layer77.net recommendations for Cloud Build + Cloud Run CI/CD

set PROJECT_ID=capstone-henry
set SA_EMAIL=cyber-ninja-deploy@%PROJECT_ID%.iam.gserviceaccount.com

echo.
echo ================================
echo MINIMAL IAM ROLES FOR CI/CD
echo ================================

echo Adding Cloud Build builder role...
gcloud projects add-iam-policy-binding %PROJECT_ID% --member=serviceAccount:%SA_EMAIL% --role=roles/cloudbuild.builds.builder

echo Adding Cloud Build viewer role (for build status)...
gcloud projects add-iam-policy-binding %PROJECT_ID% --member=serviceAccount:%SA_EMAIL% --role=roles/cloudbuild.builds.viewer

echo Adding Logging viewer role (for build logs - optional)...
gcloud projects add-iam-policy-binding %PROJECT_ID% --member=serviceAccount:%SA_EMAIL% --role=roles/logging.viewer

echo Adding Storage admin role (for source tarballs)...
gcloud projects add-iam-policy-binding %PROJECT_ID% --member=serviceAccount:%SA_EMAIL% --role=roles/storage.admin

echo Adding Cloud Run admin role...
gcloud projects add-iam-policy-binding %PROJECT_ID% --member=serviceAccount:%SA_EMAIL% --role=roles/run.admin

echo Adding Service Account User role...
gcloud projects add-iam-policy-binding %PROJECT_ID% --member=serviceAccount:%SA_EMAIL% --role=roles/iam.serviceAccountUser

echo Adding Service Usage Consumer role (for API access)...
gcloud projects add-iam-policy-binding %PROJECT_ID% --member=serviceAccount:%SA_EMAIL% --role=roles/serviceusage.serviceUsageConsumer

echo.
echo ================================
echo SETUP COMPLETE! 
echo ================================
echo Your service account now has the MINIMAL required permissions for:
echo - Building containers with Cloud Build
echo - Deploying to Cloud Run  
echo - No log streaming issues
echo.
echo Next steps:
echo 1. Commit the updated CI/CD pipeline
echo 2. Push to develop branch for staging test
echo 3. Monitor build without streaming issues
echo.
pause 