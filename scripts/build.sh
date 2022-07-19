#!/bin/bash
echo Installing dependencies
yarn install

echo Fetching environment variables
cd ./apps/jill
touch .env.production
cat > .env.production <<EOF
    REACT_APP_PRODUCTION=${1}
    REACT_APP_API_URL=${2}
    REACT_APP_FIREBASE_CONFIG=${3}
EOF
cd ../trixie

touch .production.env
cat > .production.env <<EOF
    DATABASE_URL=${4}
    PORT=${5}
    FB_BUCKET_URL=${6}
    FB_SERVICE_ACCOUNT=${7}
EOF
cd ../../

echo Building apps
yarn build