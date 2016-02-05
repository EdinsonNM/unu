#!/bin/bash
set -e

echo "---------> Installing server dependencies"
npm install
echo "---------> Moving into client folder"
cd client
echo "---------> Installing client dependencies"
npm install
echo "---------> Installing client bower dependencies"
start ./node_modules/bower/bin/bower install
echo "---------> Done"
start gulp build
