#!/bin/bash
set -e

function topic() {
  echo "-----> $*"
}


topic "Entering client directory"
cd client

topic "Run npm install for client dependencies"
./node_modules/gulp/bin/gulp build


exit 0
