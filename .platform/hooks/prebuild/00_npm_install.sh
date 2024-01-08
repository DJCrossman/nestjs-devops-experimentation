#!/bin/bash
cd /var/app/staging
sudo -u webapp npm install sharp --omit=dev
sudo -u webapp npm install pm2