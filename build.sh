#!/bin/sh

base=$(pwd)

cd ./src/frontend && npm install && bower install --allow-root && gulp clean && gulp build && cd $base
rm -rf flask/app/
cp -R src/app/ flask/app
rm -rf flask/app/database.db
rm -rf flask/app/flask_session
echo "Done!"