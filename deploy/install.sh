#!/usr/bin/env bash
# Instala o site na VPS de forma tolerante a erros.
# Uso (de qualquer lugar dentro do projeto):
#   bash deploy/install.sh seudominio.com.br
#   bash deploy/install.sh seudominio.com.br --ssl seu@email.com
#
set -uo pipefail

# 1. Encontra a raiz do projeto (pasta que tem "dist/"), mesmo se você estiver em outra pasta
ROOT="$(cd "$(dirname "$0")/.." 2>/dev/null && pwd)"
cd "$ROOT" || { echo "ERRO: não consegui acessar a pasta do projeto."; exit 1; }

if [ ! -d dist ]; then
  echo "ERRO: pasta 'dist' não encontrada em $ROOT"
  echo "Rode o script de dentro da pasta extraída do ZIP (a que contém package.json)."
  exit 1
fi

DOMAIN="${1:-}"
if [ -z "$DOMAIN" ]; then
  echo "Informe o domínio. Exemplo:"
  echo "  bash deploy/install.sh seudominio.com.br --ssl seu@email.com"
  exit 1
fi
SSL_FLAG="${2:-}"
EMAIL="${3:-${EMAIL:-}}"

# 2. Precisa ser root, ou usar sudo quando existir
if [ "$(id -u)" -eq 0 ]; then
  SUDO=""
elif command -v sudo >/dev/null 2>&1; then
  SUDO="sudo"
else
  echo "ERRO: rode como root (digite 'su -' e a senha) ou instale o sudo."
  exit 1
fi

echo "==> Projeto: $ROOT"
echo "==> Domínio: $DOMAIN"

# 3. Servidor com Apache/cPanel (caso mais comum na HostGator): publica em public_html
if [ -d /usr/local/cpanel ] || [ -d /etc/apache2 ] || [ -f /etc/httpd/conf/httpd.conf ]; then
  echo "==> Detectado Apache/cPanel: publicando via public_html (sem mexer no Nginx)"

  DOCROOT=""
  for d in /home/*/public_html; do
    if [ -d "$d" ]; then DOCROOT="$d"; break; fi
  done
  [ -n "$DOCROOT" ] || DOCROOT="/var/www/html"

  OWNER="$(stat -c '%U' "$DOCROOT" 2>/dev/null || echo root)"

  # Backupeia o index antigo, se existir
  if [ -f "$DOCROOT/index.html" ]; then
    $SUDO cp "$DOCROOT/index.html" "$DOCROOT/index.html.bak.$(date +%s)" 2>/dev/null || true
  fi

  $SUDO mkdir -p "$DOCROOT"
  $SUDO cp -r dist/. "$DOCROOT"/
  $SUDO chown -R "$OWNER":"$OWNER" "$DOCROOT" 2>/dev/null || true

  echo "==> Site publicado em $DOCROOT"
  echo "Agora ative o HTTPS no cPanel: SSL/TLS Status > Run AutoSSL."
  echo "Depois abra http://$DOMAIN no navegador."
  exit 0
fi

# 4. VPS sem cPanel: configura o Nginx
if ! command -v nginx >/dev/null 2>&1; then
  echo "==> Instalando Nginx"
  if command -v apt-get >/dev/null 2>&1; then
    export DEBIAN_FRONTEND=noninteractive
    $SUDO apt-get update -qq
    $SUDO apt-get install -y -qq nginx curl unzip >/dev/null
  elif command -v dnf >/dev/null 2>&1; then
    $SUDO dnf install -y -q nginx curl unzip >/dev/null
  elif command -v yum >/dev/null 2>&1; then
    $SUDO yum install -y -q nginx curl unzip >/dev/null
  else
    echo "ERRO: não consegui instalar o Nginx. Instale manualmente e rode de novo."
    exit 1
  fi
fi

APP_DIR="${APP_DIR:-/var/www/paitiago}"
WEB_USER="www-data"
id -u "$WEB_USER" >/dev/null 2>&1 || WEB_USER="nginx"

echo "==> Publicando em $APP_DIR/dist"
$SUDO mkdir -p "$APP_DIR"
$SUDO rm -rf "$APP_DIR/dist"
$SUDO cp -r dist "$APP_DIR/"
$SUDO chown -R "$WEB_USER":"$WEB_USER" "$APP_DIR" 2>/dev/null || true

CONF="server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    root $APP_DIR/dist;
    index index.html;

    location / { try_files \$uri \$uri/ /index.html; }

    location ~* \.(js|css|jpg|jpeg|png|webp|svg|ico|woff2?)\$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
        access_log off;
    }

    location = /index.html { add_header Cache-Control \"no-cache, must-revalidate\"; }

    gzip on;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    add_header X-Content-Type-Options nosniff;
    client_max_body_size 10m;
}"

if [ -d /etc/nginx/sites-available ]; then
  echo "==> Configurando /etc/nginx/sites-available/paitiago"
  echo "$CONF" | $SUDO tee /etc/nginx/sites-available/paitiago >/dev/null
  $SUDO ln -sf /etc/nginx/sites-available/paitiago /etc/nginx/sites-enabled/paitiago
  [ -f /etc/nginx/sites-enabled/default ] && $SUDO rm -f /etc/nginx/sites-enabled/default
else
  echo "==> Configurando /etc/nginx/conf.d/paitiago.conf"
  echo "$CONF" | $SUDO tee /etc/nginx/conf.d/paitiago.conf >/dev/null
fi

if $SUDO nginx -t; then
  $SUDO systemctl reload nginx 2>/dev/null || $SUDO systemctl restart nginx
  echo "==> Nginx recarregado"
else
  echo "ERRO: a configuração do Nginx tem problema. Veja a mensagem acima."
  exit 1
fi

if [ "$SSL_FLAG" = "--ssl" ]; then
  echo "==> Emitindo certificado HTTPS"
  if command -v apt-get >/dev/null 2>&1; then
    export DEBIAN_FRONTEND=noninteractive
    $SUDO apt-get install -y -qq certbot python3-certbot-nginx >/dev/null
  elif command -v dnf >/dev/null 2>&1; then
    $SUDO dnf install -y -q certbot python3-certbot-nginx >/dev/null
  elif command -v yum >/dev/null 2>&1; then
    $SUDO yum install -y -q certbot python3-certbot-nginx >/dev/null
  fi

  if [ -n "$EMAIL" ]; then
    $SUDO certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" -m "$EMAIL" --agree-tos --non-interactive --redirect || true
  else
    $SUDO certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --redirect || true
  fi
fi

echo
echo "Pronto. Abra: http://$DOMAIN"
echo "Site: $APP_DIR/dist | Config: /etc/nginx/sites-available/paitiago | Log: /var/log/nginx/error.log"
