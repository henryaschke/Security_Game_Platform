@echo off
echo Setting up Cloud Run permissions for cyber-ninja-deploy service account...

set PROJECT_ID=capstone-henry
set SA_EMAIL=cyber-ninja-deploy@%PROJECT_ID%.iam.gserviceaccount.com

echo Adding Cloud Run admin role...
gcloud projects add-iam-policy-binding %PROJECT_ID% --member=serviceAccount:%SA_EMAIL% --role=roles/run.admin

echo Adding Service Account User role...
gcloud projects add-iam-policy-binding %PROJECT_ID% --member=serviceAccount:%SA_EMAIL% --role=roles/iam.serviceAccountUser

echo Adding Cloud Build editor role...
gcloud projects add-iam-policy-binding %PROJECT_ID% --member=serviceAccount:%SA_EMAIL% --role=roles/cloudbuild.builds.editor

echo Adding Storage admin role...
gcloud projects add-iam-policy-binding %PROJECT_ID% --member=serviceAccount:%SA_EMAIL% --role=roles/storage.admin

echo Setup complete! Your service account now has the required Cloud Run permissions.
pause 