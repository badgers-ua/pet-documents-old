#!/bin/bash
echo Killing pm2 process
pm2 stop trixie
pm2 kill
echo Starting trixie
yarn trixie-start-prod
echo trixie deployed successfully