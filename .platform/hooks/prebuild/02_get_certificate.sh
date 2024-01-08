#!/usr/bin/env bash
set -Eeuo pipefail # stop on all errors
# These files are used by nginx, see nginx/conf.d/https.conf
openssl genrsa 2048 > /etc/pki/tls/certs/server.key
openssl req -new -x509 -nodes -sha1 -days 3650 -extensions v3_ca -key /etc/pki/tls/certs/server.key -subj "/CN=localhost" > /etc/pki/tls/certs/server.crt
sudo chmod 744 /etc/pki/tls/certs/server.key