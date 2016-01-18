#!/bin/bash
set -e

echo "---------> Installing server dependencies"
npm install
echo "---------> Moving into client folder"
cd client
echo "---------> Installing client bower dependencies"
./node_modules/bower/bin/bower install
echo "---------> Installing client dependencies"
npm install

echo "---------> Done"
pause
