#!/bin/bash
echo Pulling changes
cd ./apps/trixie
touch .production.env
echo Fetching environment variables
cat > .production.env <<EOF
    DATABASE_URL=${1}
    PORT=${2}
    FB_BUCKET_URL=${3}
    FB_SERVICE_ACCOUNT=${4}
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