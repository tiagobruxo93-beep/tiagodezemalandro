# Pai Tiago de Zé Malandro — Trabalhos espirituais

Site institucional e vitrine dos trabalhos (coletivos, individuais e consultas) com
painel de administração próprio. Cada anúncio tem uma página individual com botão de
encaminhamento para o checkout ou para o WhatsApp.

## Tecnologias

- React 19 + TypeScript + Vite
- Tailwind CSS + componentes shadcn/ui
- React Router
- Enter Cloud (banco de dados, autenticação e políticas de acesso) via `@supabase/supabase-js`

## Como rodar localmente

Precisa de Node 20+ e pnpm.

```bash
pnpm install
pnpm dev
```

O site abre em `http://localhost:3000`.

Outros comandos:

```bash
pnpm build        # build de desenvolvimento
pnpm build:prod   # build de produção
pnpm check        # lint + checagem de tipos
```

## Estrutura

```
src/
  components/site/    componentes públicos (header, hero, abas, card, detalhe, FAQ...)
  components/admin/   painel: login, tabela de anúncios, formulário e configurações
  components/ui/      componentes base (shadcn/ui)
  hooks/              sessão do painel e leitura de dados do site
  lib/ads.ts          tipos, abas, links de encaminhamento e WhatsApp
  lib/admin-ads.ts    operações do painel (criar, editar, duplicar, reordenar, excluir)
  pages/              Index (home), AdPage (/anuncio/:slug), Admin (painel), NotFound
  integrations/       cliente do Enter Cloud (arquivo gerado, não editar)
public/images/        fotos usadas no site
supabase/migrations/  migrations do banco (tabelas do site e do painel)
```

## Banco de dados

Tabelas usadas (todas com RLS ativa):

- `spiritual_ads` — os anúncios (aba, valor, link de encaminhamento, imagem, ordem, status)
- `spiritual_site_settings` — textos do hero, sobre, WhatsApp e aviso de pagamento
- `spiritual_ad_clicks` — contagem de cliques nos botões de encaminhamento
- `spiritual_admins` — quem tem acesso ao painel

O primeiro acesso criado no painel se torna administrador. As demais contas ficam sem
permissão até serem liberadas no banco.

## Painel de administração

O painel fica em um endereço fixo definido em `src/router.tsx`. Por segurança, ele não
aparece em nenhum menu do site e está marcado como `noindex` para não ser indexado por
buscadores. Guarde esse link.

Dentro do painel você pode criar, editar, duplicar, reordenar, destacar, ativar/desativar
e excluir anúncios, copiar o link de cada anúncio e o link de pagamento, ver a contagem de
encaminhamentos e editar os textos e o WhatsApp do site.

## Publicação

O site é publicado pela plataforma Enter (botão **Publish**). O repositório no GitHub é um
espelho do código: enviar para o GitHub não coloca o site no ar nem altera o domínio.
