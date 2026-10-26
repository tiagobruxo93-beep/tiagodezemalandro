#!/usr/bin/env bash
# Instala o site na VPS, configura o Nginx e (opcional) emite o HTTPS.
#
# Uso, dentro da pasta extraída do ZIP:
#   sudo bash deploy/install.sh seudominio.com.br
#   sudo bash deploy/install.sh seudominio.com.br --ssl seu@email.com
#
set -euo pipefail

DOMAIN="${1:-}"
SSL_FLAG="${2:-}"
EMAIL="${3:-${EMAIL:-}}"
APP_DIR="${APP_DIR:-/var/www/paitiago}"

if [ -z "$DOMAIN" ]; then
  echo "Informe o domínio. Exemplo: sudo bash deploy/install.sh seudominio.com.br --ssl seu@email.com"
  exit 1
fi

if [ ! -d "dist" ]; then
  echo "Pasta 'dist' não encontrada. Rode este script na raiz do projeto (onde está o package.json)."
  exit 1
fi

if ! command -v nginx >/dev/null 2>&1; then
  echo "==> Instalando Nginx"
  if command -v apt-get >/dev/null 2>&1; then
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -qq
    apt-get install -y -qq nginx curl unzip >/dev/null
  elif command -v dnf >/dev/null 2>&1; then
    dnf install -y -q nginx curl unzip >/dev/null
  elif command -v yum >/dev/null 2>&1; then
    yum install -y -q nginx curl unzip >/dev/null
  else
    echo "Não consegui instalar o Nginx automaticamente. Instale e rode o script de novo."
    exit 1
  fi
fi

WEB_USER="www-data"
id -u "$WEB_USER" >/dev/null 2>&1 || WEB_USER="nginx"

echo "==> Publicando os arquivos em $APP_DIR/dist"
mkdir -p "$APP_DIR"
rm -rf "$APP_DIR/dist"
cp -r dist "$APP_DIR/"
chown -R "$WEB_USER":"$WEB_USER" "$APP_DIR" 2>/dev/null || true

write_config() {
  cat > "$1" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    root $APP_DIR/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(js|css|jpg|jpeg|png|webp|svg|ico|woff2?)\$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location = /index.html {
        add_header Cache-Control "no-cache, must-revalidate";
    }

    gzip on;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    add_header X-Content-Type-Options nosniff;
    client_max_body_size 10m;
}
NGINX
}

if [ -d /etc/nginx/sites-available ]; then
  echo "==> Escrevendo /etc/nginx/sites-available/paitiago"
  write_config /etc/nginx/sites-available/paitiago
  ln -sf /etc/nginx/sites-available/paitiago /etc/nginx/sites-enabled/paitiago
  [ -f /etc/nginx/sites-enabled/default ] && rm -f /etc/nginx/sites-enabled/default
else
  echo "==> Escrevendo /etc/nginx/conf.d/paitiago.conf"
  write_config /etc/nginx/conf.d/paitiago.conf
fi

nginx -t
systemctl reload nginx 2>/dev/null || systemctl restart nginx
systemctl enable nginx >/dev/null 2>&1 || true

echo "==> Site publicado em http://$DOMAIN"

if [ "$SSL_FLAG" = "--ssl" ]; then
  echo "==> Emitindo certificado HTTPS"
  if command -v apt-get >/dev/null 2>&1; then
    export DEBIAN_FRONTEND=noninteractive
    apt-get install -y -qq certbot python3-certbot-nginx >/dev/null
  elif command -v dnf >/dev/null 2>&1; then
    dnf install -y -q certbot python3-certbot-nginx >/dev/null
  elif command -v yum >/dev/null 2>&1; then
    yum install -y -q certbot python3-certbot-nginx >/dev/null
  fi

  if [ -n "$EMAIL" ]; then
    certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" -m "$EMAIL" --agree-tos --non-interactive --redirect
  else
    certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --redirect
  fi
  echo "==> HTTPS ativo em https://$DOMAIN"
else
  echo "Para ativar o HTTPS depois: sudo bash deploy/install.sh $DOMAIN --ssl seu@email.com"
fi

echo
echo "Resumo:"
echo "  Site        : $APP_DIR/dist"
echo "  Config Nginx: sites-available/paitiago (ou conf.d/paitiago.conf)"
echo "  Logs        : /var/log/nginx/error.log"
