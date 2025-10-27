#!/usr/bin/env bash
set -euo pipefail

# ========= CONFIG =========
DOMAIN="treasureegypttours.net"
WWW_DOMAIN="www.treasureegypttours.net"
APP_NAME="treasureegypttours"
APP_DIR="/var/www/treasureegypttours"
PORT="3001"

# Clone this repo automatically
REPO_URL="https://github.com/Mustafaelfangary/TreasureEgyptTours"
BRANCH="main"

# Create/overwrite .env automatically (1=yes, 0=no)
WRITE_ENV=1

read -r -d '' ENV_CONTENT << 'EOF'
NODE_ENV=production
PORT=3001
NEXT_PUBLIC_SITE_URL=https://www.treasureegypttours.net
NEXTAUTH_URL=https://www.treasureegypttours.net
# DATABASE_URL=<your-db-url-if-used>
# NEXTAUTH_SECRET=<random-strong-secret-if-used>
# Add other required keys here...
EOF
# ========= END CONFIG =========

echo "==> Starting deployment for $DOMAIN ($APP_NAME on port $PORT)"
if [ "$(id -u)" -ne 0 ]; then
  echo "Please run as root or with sudo."
  exit 1
fi

echo "==> Updating system packages"
apt update -y
apt upgrade -y

echo "==> Installing base dependencies"
apt install -y nginx ufw curl git

echo "==> Installing Node.js LTS and PM2"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
  apt install -y nodejs
fi
npm i -g pm2

echo "==> Installing Certbot via snap (recommended)"
snap install core || true
snap refresh core || true
if ! snap list | grep -q certbot; then
  snap install --classic certbot
fi
if [ ! -e /usr/bin/certbot ]; then
  ln -s /snap/bin/certbot /usr/bin/certbot || true
fi

echo "==> Configuring UFW firewall"
ufw allow OpenSSH || true
ufw allow 'Nginx Full' || true
ufw --force enable || true
ufw status || true

echo "==> Creating app directory: $APP_DIR"
mkdir -p "$APP_DIR"
# Try to set ownership to the logged-in sudo user if available
if [ -n "${SUDO_USER:-}" ] && id "$SUDO_USER" >/dev/null 2>&1; then
  chown -R $SUDO_USER:$SUDO_USER "$APP_DIR" || true
fi

# Clone repo
echo "==> Cloning repository $REPO_URL into $APP_DIR"
if [ -d "$APP_DIR/.git" ]; then
  echo "Repository already present. Pulling latest on $BRANCH"
  su - ${SUDO_USER:-root} -c "cd $APP_DIR && git fetch && git checkout $BRANCH && git pull --ff-only origin $BRANCH"
else
  su - ${SUDO_USER:-root} -c "cd $APP_DIR && git clone -b $BRANCH $REPO_URL ."
fi

echo "==> Installing dependencies and building Next.js"
if [ -f "$APP_DIR/package-lock.json" ]; then
  su - ${SUDO_USER:-root} -c "cd $APP_DIR && npm ci"
else
  su - ${SUDO_USER:-root} -c "cd $APP_DIR && npm install"
fi
su - ${SUDO_USER:-root} -c "cd $APP_DIR && npm run build"

if [ "$WRITE_ENV" -eq 1 ]; then
  echo "==> Writing .env to $APP_DIR"
  ENV_MODIFIED=$(echo "$ENV_CONTENT" | sed "s/PORT=3001/PORT=$PORT/g")
  echo "$ENV_MODIFIED" > "$APP_DIR/.env"
  chmod 600 "$APP_DIR/.env"
else
  echo "==> Skipping .env write (WRITE_ENV=0). Ensure $APP_DIR/.env exists."
fi

echo "==> Starting app with PM2"
pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
PORT="$PORT" pm2 start npm --name "$APP_NAME" -- start
pm2 save
if [ -n "${SUDO_USER:-}" ] && id "$SUDO_USER" >/dev/null 2>&1; then
  pm2 startup -u $SUDO_USER --hp "/home/$SUDO_USER" || true
else
  pm2 startup || true
fi
pm2 status

echo "==> Creating Nginx HTTP server block for $DOMAIN"
NGINX_SITE="/etc/nginx/sites-available/$APP_NAME"
cat > "$NGINX_SITE" <<EOF
server {
  listen 80;
  listen [::]:80;
  server_name $DOMAIN $WWW_DOMAIN;

  location /_next/static/ {
    alias $APP_DIR/.next/static/;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location /public/ {
    alias $APP_DIR/public/;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location / {
    proxy_pass http://127.0.0.1:$PORT;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 60s;
  }

  gzip on;
  gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss image/svg+xml;
  gzip_min_length 10240;
  gzip_comp_level 2;
}
EOF

ln -sf "$NGINX_SITE" "/etc/nginx/sites-enabled/$APP_NAME"
nginx -t
systemctl reload nginx

echo "==> Issuing and installing SSL certificate for $DOMAIN and $WWW_DOMAIN"
set +e
certbot --nginx -d "$DOMAIN" -d "$WWW_DOMAIN" --non-interactive --agree-tos -m "admin@$DOMAIN"
CB_STATUS=$?
set -e

if [ $CB_STATUS -ne 0 ]; then
  echo "==> Certbot installer failed or skipped. Checking if cert exists and applying HTTPS server block manually."
  if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    NGINX_SITE_SSL="/etc/nginx/sites-available/${APP_NAME}-https"
    cat > "$NGINX_SITE_SSL" <<EOF
server {
  listen 80;
  listen [::]:80;
  server_name $DOMAIN $WWW_DOMAIN;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name $DOMAIN $WWW_DOMAIN;

  ssl_certificate     /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

  location /_next/static/ {
    alias $APP_DIR/.next/static/;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location /public/ {
    alias $APP_DIR/public/;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location / {
    proxy_pass http://127.0.0.1:$PORT;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 60s;
  }

  add_header X-Frame-Options SAMEORIGIN;
  add_header X-Content-Type-Options nosniff;
  add_header Referrer-Policy strict-origin-when-cross-origin;
}
EOF
    ln -sf "$NGINX_SITE_SSL" "/etc/nginx/sites-enabled/${APP_NAME}-https"
    nginx -t
    systemctl reload nginx
  else
    echo "==> Certificate not found under /etc/letsencrypt/live/$DOMAIN."
    echo "   Ensure DNS is correct and try: certbot --nginx -d $DOMAIN -d $WWW_DOMAIN"
  fi
fi

echo "==> Verifying"
curl -Is "http://$DOMAIN" | head -n1 || true
curl -Is "https://$DOMAIN" | head -n1 || true
pm2 status || true
nginx -t

echo "==> Done. Site should be reachable at https://$DOMAIN"
echo "Auto-renew is handled by certbot timers; validate with: systemctl list-timers | grep certbot"
