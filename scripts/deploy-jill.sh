#!/bin/sh
echo Pulling changes
cd ./apps/jill
touch .env.production
echo Fetching environment variables
cat > .env.production <<EOF
    REACT_APP_PRODUCTION=${{secrets.JILL_REACT_APP_PRODUCTION}}
    REACT_APP_API_URL=${{secrets.JILL_REACT_APP_API_URL}}
    REACT_APP_FIREBASE_CONFIG=${{secrets.JILL_REACT_APP_FIREBASE_CONFIG}}
EOF
cd ../../
echo Installing dependencies
yarn
echo Building jill
yarn jill-build
echo Deleting current jill build at /var/www/p-doc.com/jill
rm -r /var/www/p-doc.com/jill/*
echo Copying jill build to /var/www/p-doc.com/jill
cp -R ./apps/jill/build/* /var/www/p-doc.com/jill
echo jill deployed successfully