# 🏗️ Arquitetura do Recanto dos Poetas

## Visão Geral

O Recanto dos Poetas é uma aplicação fullstack construída com:

- **Frontend:** Next.js 14 + React 18 + Zustand + Axios
- **Backend:** Node.js + Express + PostgreSQL
- **Autenticação:** JWT
- **Pagamentos:** Stripe / Mercado Pago
- **Cache:** Redis
- **Uploads:** AWS S3 (opcional)

## Diagrama da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                           │
│              (Next.js SPA, HTML, CSS, JS)                    │
└──────┬────────────────────────────────────────────────────┬──┘
       │                                                       │
       │ HTTPS/TLS                                            │
       │                                                       │
┌──────▼─────────────────────────────────────────────────────▼──┐
│                     API Gateway / Nginx                       │
│                     (Rate Limiting, CORS)                     │
└──────┬────────────────────────────────────────────────────────┘
       │
       │ HTTP/1.1
       │
┌──────▼────────────────────────────────────────────────────────┐
│                  Backend Node.js + Express                     │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Routes (API Endpoints)                                  │   │
│  │ - /api/auth                                            │   │
│  │ - /api/texts                                           │   │
│  │ - /api/authors                                         │   │
│  │ - /api/licenses                                        │   │
│  │ - /api/transactions                                    │   │
│  └────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Middleware                                              │   │
│  │ - Authentication (JWT)                                 │   │
│  │ - Error Handling                                       │   │
│  │ - Validation                                           │   │
│  └────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Controllers                                             │   │
│  │ - Auth Logic                                           │   │
│  │ - Text Management                                      │   │
│  │ - Payment Processing                                   │   │
│  └────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Services                                                │   │
│  │ - Email Service (Nodemailer)                           │   │
│  │ - Payment Service (Stripe)                             │   │
│  │ - S3 Upload Service                                    │   │
│  └────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Models / Queries                                        │   │
│  │ - User                                                 │   │
│  │ - Text                                                 │   │
│  │ - Transaction                                          │   │
│  └────────────────────────────────────────────────────────┘   │
└──────────────┬────────────────┬────────────────┬────────────────┘
               │                │                │
               │                │                │
       ┌───────▼────┐   ┌───────▼──────┐   ┌────▼──────────┐
       │ PostgreSQL │   │  Redis Cache  │   │  External     │
       │ (Primary)  │   │  (Sessions)   │   │  Services     │
       │            │   │  (Temp Data)  │   │  - Stripe     │
       │ Schema:    │   └───────────────┘   │  - SendGrid   │
       │ - users    │                       │  - S3 / AWS   │
       │ - texts    │                       │  - Analytics  │
       │ - txns     │                       └───────────────┘
       │ - etc      │
       └────────────┘
```

## Estrutura de Pastas

### Backend

```
backend/
├── src/
│   ├── server.js              # Entry point
│   ├── config/
│   │   ├── database.js        # Pool de conexão
│   │   └── constants.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── textRoutes.js
│   │   └── ...
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── textController.js
│   │   └── ...
│   ├── models/
│   │   ├── User.js
│   │   ├── Text.js
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── services/
│   │   ├── emailService.js
│   │   ├── stripeService.js
│   │   └── s3Service.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── validators.js
│   └── db/
│       ├── schema.sql
│       └── migrations/
├── .env.example
├── package.json
└── Dockerfile
```

### Frontend

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── login/
│   │   ├── register/
│   │   └── ...
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── TextReader.tsx
│   │   ├── TextForm.tsx
│   │   └── ...
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useText.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   └── textStore.ts
│   ├── services/
│   │   ├── api.ts
│   │   └── AuthAPI.ts
│   ├── utils/
│   │   └── validators.ts
│   └── styles/
│       └── globals.css
├── public/
├── next.config.js
├── tailwind.config.js
└── package.json
```

## Fluxo de Dados

### 1. Autenticação

```
User → Login Form
  ↓
API POST /auth/login (email, password)
  ↓
Backend: verifyPassword() → generateTokens()
  ↓
Response: { accessToken, refreshToken, user }
  ↓
Frontend: Zustand store + localStorage
```

### 2. Publicação de Texto

```
Author → Criar/Editar Texto
  ↓
API POST /texts (title, content, license)
  ↓
Backend: TextModel.create() → validate → save
  ↓
Response: { textId, slug, status }
  ↓
Author: API POST /texts/:id/publish
  ↓
Backend: updateStatus = 'published'
  ↓
Email: Notificar seguidores (async job)
```

### 3. Compra de Licença

```
Buyer → Clicar em "Comprar Licença"
  ↓
Frontend: createCheckoutSession() → Stripe Hosted
  ↓
Stripe: Processar Pagamento
  ↓
Webhook: Receber confirmação
  ↓
Backend: createTransaction() + sendEmail()
  ↓
Buyer: Download PDF da Licença
```

## Modelo de Dados (Simplificado)

```
users
├── id (UUID)
├── email
├── password_hash
├── first_name, last_name
└── ...

texts
├── id (UUID)
├── author_id (FK users)
├── title, content, slug
├── status (draft, published, archived)
├── license_type (CC-BY, CC-BY-NC, etc)
└── ...

transactions
├── id (UUID)
├── buyer_id (FK users)
├── author_id (FK users)
├── text_id (FK texts)
├── amount_cents
├── status (pending, completed, refunded)
└── ...

text_licenses
├── id (UUID)
├── text_id (FK texts)
├── buyer_id (FK users)
├── license_type
├── expires_at
└── ...
```

## Proteção contra Cópia (Camadas)

### Camada 1: Frontend (CSS/JS)
- `user-select: none` no texto
- Context menu desativado
- Event listeners para copy/cut

### Camada 2: Watermark
- Visual no topo da página
- Integrada ao PDF download

### Camada 3: Backend
- Rate limiting por IP
- Logs de acesso
- Detecção de User-Agent suspeito

### Camada 4: Legal
- Termos de Uso explícitos
- Licença Creative Commons
- Link para denunciar plágio

## Fluxo de Segurança

```
Request (com Token JWT)
  ↓
CORS Check → IP Whitelist?
  ↓
Rate Limit Check → Passou 100 req/min?
  ↓
JWT Verify → Token válido?
  ↓
Role Check → Permissão adequada?
  ↓
Resource Owner Check → Acesso ao próprio recurso?
  ↓
Execute Controller → Lógica de negócio
  ↓
Log (auditoria) → Registrar ação
  ↓
Response → Cliente
```

## Tecnologias Chave

| Componente | Technology | Versão |
|-----------|-----------|--------|
| Runtime Backend | Node.js | 18+ |
| Framework Web | Express | 4.18+ |
| DB Principal | PostgreSQL | 14+ |
| Cache | Redis | 7+ |
| Runtime Frontend | Node.js | 18+ |
| Framework Web | Next.js | 14+ |
| UI Library | React | 18+ |
| State Management | Zustand | 4.4+ |
| CSS | Tailwind | 3.3+ |
| HTTP Client | Axios | 1.6+ |
| Auth | JWT (jsonwebtoken) | 9.1+ |
| Pagamento | Stripe | 14.8+ |
| Email | Nodemailer | 6.9+ |
| DB Password | Bcryptjs | 2.4+ |

## Deployment

### Desenvolvimento Local
- `docker-compose up` (all services)
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- DB: localhost:5432

### Staging / Production
- Docker Compose ou Kubernetes
- Nginx como reverse proxy
- HTTPS obrigatório
- Environment variables de produção
- Backups automáticos do DB
- CDN para assets estáticos
