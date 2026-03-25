# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

TabacariadoMineiro — front-end de loja online de tabacaria (B2C varejo + B2B atacado). UX/UI validation only — sem backend real, dados mockados, deploy na Vercel.

## Repository

- **Remote:** https://github.com/mgffelipebatista02-design/TabacariadoMineiro
- **Branch:** main

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`) — light green theme design system
- **Framer Motion** — animações e transições
- **Radix UI** — primitivos acessíveis (dialog, tabs, accordion, switch, dropdown)
- **Recharts** — gráficos do painel admin
- **@tanstack/react-table + react-virtual** — tabelas virtualizadas (B2B, Admin)
- **react-hook-form + zod** — formulários com validação
- **Swiper** — carrosséis de imagens (produto)
- **papaparse** — importação CSV (pedido rápido B2B)
- **lucide-react** — ícones
- **class-variance-authority + clsx + tailwind-merge** — variantes de componentes

## Commands

- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build (verifica TypeScript)
- `npm run lint` — ESLint
- `npx tsc --noEmit` — type check sem build

## Architecture

```
src/
├── app/                    # Rotas (App Router) — 32 rotas
├── components/
│   ├── ui/                 # 12 primitivos do design system (Button, Input, Badge, Card, Modal, Stepper, Pill, Table, StarRating, QuantitySelector, PriceDisplay, Skeleton)
│   ├── layout/             # Header, Footer, AgeBanner, SearchOverlay, MobileNav
│   ├── home/               # HeroSection, DualModeSection, CategoriesGrid, ComplianceSection
│   ├── catalog/            # ProductCard, ProductGrid, Filters
│   ├── cart/               # CartItem, CartSummary, DiscountBar
│   ├── checkout/           # AgeVerification, Identification, ShippingStep, PaymentStep, Confirmation
│   ├── account/            # (componentes de conta — inline nas páginas)
│   ├── admin/              # (componentes admin — inline nas páginas)
│   └── b2b/                # CsvImport
├── contexts/               # ModeContext (B2C/B2B), CartContext, AuthContext
├── data/                   # Mock data: products (30), orders (10), customers (20), categories (6), admin-metrics
├── hooks/                  # useMode, useCart, useLocalStorage, useMediaQuery
├── lib/                    # utils (cn, formatBRL, slugify), constants
├── types/                  # TypeScript interfaces (Product, Order, Customer, etc.)
└── styles/
    └── globals.css         # Tailwind @theme tokens, noise texture, scrollbar, shimmer animation
```

## Design System (Tailwind @theme tokens)

Cores são usadas como classes Tailwind diretamente (ex: `bg-bg-primary`, `text-accent-green`, `border-border-default`):

- **Backgrounds:** `bg-primary` (#F5F7F0), `bg-secondary` (#EBF0E0), `bg-card` (#FFFFFF), `bg-elevated` (#F0F4E8), `bg-input` (#FFFFFF)
- **Accent:** `accent-green` (#5B7A34), `accent-green-light` (#6B8A3E), `accent-green-dark` (#4A6629), `accent-gold` (#C8956C)
- **Text:** `text-primary` (#1A2E0A), `text-secondary` (#5A6B4A), `text-muted` (#8A9878)
- **Borders:** `border-default` (#D4DCC4), `border-hover` (#B5C4A0), `border-accent` (#5B7A34)
- **Status:** `status-success` (#22C55E), `status-warning`, `status-error` (#EF4444), `status-info`
- **Fonts:** `font-display` (Playfair Display), `font-body` (DM Sans), `font-mono` (JetBrains Mono)
- **Radius:** `rounded-[--radius-sm]` (6px), `rounded-[--radius-md]` (8px), `rounded-[--radius-lg]` (12px), `rounded-[--radius-xl]` (16px), `rounded-[--radius-pill]` (100px)

## Key Patterns

- **Mode B2C/B2B:** `useMode()` retorna `{ mode, toggleMode, setMode }`. Persistido em localStorage. Preços, unidades e features adaptam automaticamente.
- **Cart:** `useCart()` retorna `{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, discount, shipping, total, b2bMinOrderMet }`. Desconto progressivo (5%/8%/12%). Pedido mínimo B2B R$500.
- **Auth:** `useAuth()` retorna `{ user, login, logout, isLoading }`. Mock users: `cliente@email.com`/`123456` (B2C), `lojista@email.com`/`123456` (B2B), `admin@tabacaria.com`/`admin123` (Admin).
- **UI Components:** Todos usam CVA para variantes, `cn()` para merge de classes, `'use client'` directive.
- **Badge:** Usa prop `variant` (olive|green|red|blue|gray), NÃO `color` (conflito com HTML).
- **useSearchParams:** Páginas que usam `useSearchParams` devem ser wrappadas em `<Suspense>` (ver busca/page.tsx).

## ANVISA Compliance (OBRIGATÓRIO)

- **NUNCA** usar "compre agora", "promoção", "oferta", "aproveite", "desconto especial"
- Botões usam linguagem neutra: "Adicionar", "Explorar", "Conhecer", "Informações"
- Sem banners de marketing agressivo
- Aviso "+18" obrigatório no footer de cada página
- Imagens apenas como referência, sem glamourização

## Routes Summary

| Rota | Descrição |
|------|-----------|
| `/` | Home (hero, dual mode, categorias, compliance) |
| `/catalogo` | Catálogo com filtros e pills de categorias |
| `/catalogo/[categoria]` | Catálogo filtrado por categoria |
| `/produto/[slug]` | Detalhe do produto (galeria, tabs, relacionados) |
| `/busca?q=` | Resultados de busca |
| `/carrinho` | Carrinho com descontos e frete |
| `/checkout` | Checkout 5 etapas (idade, ID, entrega, pagamento, confirmação) |
| `/login` | Login |
| `/cadastro` | Cadastro CPF/CNPJ |
| `/minha-conta/*` | Painel B2C (dados, pedidos, endereços, senha) |
| `/painel-b2b/*` | Painel B2B (dashboard, pedidos, recompra, preços, dados fiscais) |
| `/pedido-rapido` | Pedido rápido B2B (tabela virtualizada, CSV import) |
| `/rastreio/[numeroPedido]` | Rastreio de pedido |
| `/feedback/[tokenPedido]` | Feedback pós-compra |
| `/admin/*` | Admin (dashboard com gráficos, inventário, picking, etiquetas, clientes) |
| `/politica-privacidade` | Política de Privacidade |
| `/termos-de-uso` | Termos de Uso |
| `/contato` | Formulário de contato |
| `/compliance` | Página de compliance ANVISA |
