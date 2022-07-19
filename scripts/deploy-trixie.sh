#!/bin/bash
echo Pulling changes
cd ./apps/trixie
touch .production.env
echo Fetching environment variables
cat > .production.env <<EOF
    DATABASE_URL=${DATABASE_URL}
    PORT=${PORT}
    FB_BUCKET_URL=${FB_BUCKET_URL}
    FB_SERVICE_ACCOUNT=${FB_SERVICE_ACCOUNT}
EOF
cd ../../
echo Installing dependencies
yarn
pm2 stop trixie
pm2 kill
echo Building trixie
yarn build
echo Starting Trixie
yarn trixie-start-prod
echo trixie deployed successfully