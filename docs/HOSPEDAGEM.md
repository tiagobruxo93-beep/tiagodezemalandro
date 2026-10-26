# Hospedagem na HostGator (VPS + domínio)

Este projeto é um site React (Vite) que usa o backend do Enter Cloud para banco de
dados e login do painel. Ele pode ser hospedado em qualquer servidor: HostGator VPS,
cPanel, Netlify, Vercel, etc.

Antes de enviar, leia a seção **Backend** no fim deste arquivo — é o ponto que mais
gera dúvida.

---

## O que enviar

O pacote que você recebeu contém:

| Pasta / arquivo | Para que serve |
|---|---|
| `dist/` | **Site já compilado e pronto para publicar.** É isso que vai para o servidor |
| `src/`, `public/`, arquivos de config | Código-fonte, caso queira alterar e compilar de novo |
| `deploy/nginx.conf` | Configuração de servidor para VPS com Nginx |
| `deploy/deploy.sh` | Script que instala dependências, compila e publica na VPS |
| `public/.htaccess` | Regras de rotas e cache para hospedagem Apache/cPanel (já vai dentro de `dist/`) |

---

## Opção A — Hospedagem com painel (cPanel / upload de arquivos)

Funciona no plano de hospedagem comum da HostGator e também na VPS com Apache.

1. No painel da HostGator, abra **Gerenciador de Arquivos** (ou conecte por FTP).
2. Entre na pasta pública do domínio: `public_html` (ou `public_html/seudominio.com.br`
   quando o domínio é adicional).
3. Envie **todo o conteúdo de dentro de `dist/`**, não a pasta `dist` inteira.
   Devem ficar em `public_html`: `index.html`, a pasta `assets`, a pasta `images`,
   `favicon.ico` e o arquivo `.htaccess`.
4. Confirme que o `.htaccess` foi enviado — no Gerenciador de Arquivos ative
   "Mostrar arquivos ocultos". Sem ele, abrir `/anuncio/algum-trabalho` dá erro 404.
5. Ative o SSL grátis no painel (Let's Encrypt/AutoSSL) e force HTTPS.

---

## Opção B — VPS HostGator com Nginx (recomendado para VPS)

Acesse a VPS por SSH (root) e rode:

```bash
# 1. Node 20 e pnpm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm install -g pnpm

# 2. Envie o projeto (git clone, scp ou o ZIP) e entre na pasta
cd /root/tiagodezemalandro

# 3. Instale, compile e publique
sudo DOMAIN=seudominio.com.br APP_DIR=/var/www/paitiago bash deploy/deploy.sh

# 4. Configure o site no Nginx
sudo cp deploy/nginx.conf /etc/nginx/sites-available/paitiago
sudo nano /etc/nginx/sites-available/paitiago    # ajuste server_name e root
sudo ln -s /etc/nginx/sites-available/paitiago /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 5. Certificado SSL gratuito (renova sozinho)
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com.br -d www.seudominio.com.br
```

Se preferir não instalar Node na VPS: suba apenas a pasta `dist/` por SFTP para
`/var/www/paitiago/dist` e siga do passo 4 em diante. Também funciona sem problema,
o site já está compilado.

---

## Domínio e DNS

Na HostGator, no painel do domínio (ou onde o DNS estiver apontado):

| Tipo | Nome | Valor |
|---|---|---|
| A | `@` (o domínio sem www) | IP da sua VPS (ex.: `123.45.67.89`) |
| CNAME | `www` | `@` ou o domínio principal |

- IP da VPS: aparece no painel da HostGator em **VPS / Detalhes do servidor**.
- A propagação leva de alguns minutos a poucas horas.
- Depois que o domínio responder, rode o `certbot` (opção B) ou ative o AutoSSL no painel.

---

## Atualizar o site depois

1. Alterou algo aqui no Enter? Use `Publish` para atualizar a versão do Enter.
2. Para atualizar a VPS, envie novamente o conteúdo de `dist/` (ou rode o
   `deploy.sh` de novo, se o projeto estiver na VPS) e limpe o cache do navegador.

---

## Backend (leia antes de enviar)

O site publicado na HostGator conversa por HTTPS com o backend do Enter Cloud, onde
ficam os anúncios, as configurações, a contagem de cliques e o login do painel. Ou
seja: **a hospedagem serve os arquivos do site; o banco continua no Enter Cloud**, e
nada precisa ser instalado na VPS para o painel funcionar.

Consequências práticas:

- Se o projeto/instância do Enter Cloud for desativado, o painel e a lista de anúncios
  param de funcionar mesmo com o site online na HostGator.
- O endereço e a chave pública do backend ficam em `src/integrations/supabase/client.ts`.
  Essa chave é pública por natureza (o banco tem regras de acesso que impedem leitura
  ou alteração indevida); as senhas do painel nunca ficam no código.
- O painel fica no link secreto que você já recebeu e não aparece em nenhum menu.

Quer rodar 100% na HostGator, sem depender do Enter Cloud? É possível, mas é uma
migração de backend: subir um Postgres na VPS, recriar as quatro tabelas do site
(`spiritual_ads`, `spiritual_site_settings`, `spiritual_ad_clicks`, `spiritual_admins`),
reimplementar o login do painel e ajustar as chamadas do site. Nesse caso me diga que
eu preparo essa versão.

---

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| Página em branco | Os arquivos de `dist/` não foram enviados (faltou `assets/`) |
| 404 ao abrir um anúncio direto | `.htaccess` ausente (Apache) ou `try_files` faltando (Nginx) |
| Site antigo aparecendo | Cache do navegador/CDN — recarregue com Ctrl+Shift+R |
| Painel abre mas não carrega dados | Instância do Enter Cloud pausada ou sem créditos |
| Fotos não aparecem | A pasta `images` não foi enviada junto com o `index.html` |
