#!/bin/bash
echo Deleting current jill build at /var/www/p-doc.com/jill
rm -r /var/www/p-doc.com/jill/*
echo Copying jill build to /var/www/p-doc.com/jill
cp -R ./apps/jill/build/* /var/www/p-doc.com/jill
echo jill deployed successfully