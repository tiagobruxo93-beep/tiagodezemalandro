#!/usr/bin/env bash
# Deploy do site na VPS (Nginx). Rode na raiz do projeto, dentro da VPS.
#
# Uso:
#   sudo DOMAIN=seudominio.com.br APP_DIR=/var/www/paitiago bash deploy/deploy.sh
#
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/paitiago}"
DOMAIN="${DOMAIN:-seudominio.com.br}"

echo "==> Verificando Node"
if ! command -v node >/dev/null 2>&1; then
  echo "Node não encontrado. Instale antes:"
  echo "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
  echo "  sudo apt-get install -y nodejs"
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "==> Instalando pnpm"
  sudo npm install -g pnpm
fi

echo "==> Instalando dependências"
pnpm install

echo "==> Gerando build de produção"
pnpm build:prod

echo "==> Publicando em $APP_DIR/dist"
sudo mkdir -p "$APP_DIR"
sudo rm -rf "$APP_DIR/dist"
sudo cp -r dist "$APP_DIR/"
sudo chown -R www-data:www-data "$APP_DIR" 2>/dev/null || true

cat <<INFO

Build publicado em: $APP_DIR/dist

Próximos passos:
  1. Copie deploy/nginx.conf para /etc/nginx/sites-available/$DOMAIN
     e ajuste server_name e root ($APP_DIR/dist).
  2. sudo ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
  3. sudo nginx -t && sudo systemctl reload nginx
  4. SSL: sudo apt-get install -y certbot python3-certbot-nginx
          sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN
INFO
