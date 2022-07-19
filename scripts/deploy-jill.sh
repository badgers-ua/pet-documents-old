#!/bin/bash
echo Pulling changes
cd ./apps/jill
touch .env.production
echo Fetching environment variables
echo ${1}
cat > .env.production <<EOF
    REACT_APP_PRODUCTION=${1}
    REACT_APP_API_URL=${2}
    REACT_APP_FIREBASE_CONFIG=${3}
EOF
cd ../../
echo Installing dependencies
yarn
echo Building jill
yarn build
echo Deleting current jill build at /var/www/p-doc.com/jill
rm -r /var/www/p-doc.com/jill/*
echo Copying jill build to /var/www/p-doc.com/jill
cp -R ./apps/jill/build/* /var/www/p-doc.com/jill
echo jill deployed successfully