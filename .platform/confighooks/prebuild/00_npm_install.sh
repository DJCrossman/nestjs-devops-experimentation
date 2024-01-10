#!/bin/bash
# write if statement to check if node_modules exists else run npm install
if [ -d "/tmp/node_modules" ]; then
  sudo -u webapp mkdir -p /var/app/staging/node_modules
  sudo -u webapp cp -r /tmp/node_modules/* /var/app/staging/node_modules
  sudo -u webapp cp -r /tmp/node_modules/.bin /var/app/staging/node_modules/.bin
else
  sudo -u webapp npm install sharp --omit=dev
  sudo -u webapp npm install pm2
  sudo -u webapp mkdir -p /tmp/node_modules
  sudo -u webapp cp -r /var/app/staging/node_modules/* /tmp/node_modules/
  sudo -u webapp cp -r /var/app/staging/node_modules/.bin /tmp/node_modules/.bin
fi
