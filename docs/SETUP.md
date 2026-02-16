# 🚀 Guia de Setup - Recanto dos Poetas

## Pré-requisitos

### Sistema Local
- **Node.js:** 18.x ou superior
- **npm:** 9.x ou superior (vem com Node)
- **PostgreSQL:** 14+ (opcional se usar Docker)
- **Docker & Docker Compose:** para ambiente containerizado
- **Git:** para versionamento

### Contas Externas (Opcionais)
- **Stripe:** https://stripe.com (para pagamentos)
- **AWS S3:** https://aws.amazon.com (para uploads de imagens)
- **Gmail App Password:** para enviar emails

---

## ⚡ Quickstart com Docker (Recomendado)

### 1. Clone o Repositório

```bash
git clone https://github.com/SEU_USUARIO/Recanto-dos-Poetas.git
cd Recanto-dos-Poetas
```

### 2. Configurare Environment Variables

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.example
```

Edite `.env` e adicione seus valores:

```bash
DB_PASSWORD=postgres
JWT_SECRET=sua_chave_super_secreta
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
```

### 3. Inicie com Docker Compose

```bash
docker-compose up
```

Isso vai:
- ✅ Criar e iniciar PostgreSQL
- ✅ Criar e iniciar Redis
- ✅ Rodar Backend (npm run dev)
- ✅ Rodar Frontend (npm run dev)

### 4. Acesse as Aplicações

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

### 5. Parar os Containers

```bash
docker-compose down
```

---

## 🛠️ Setup Manual (Sem Docker)

### 1. Database Setup

#### Opção A: PostgreSQL Local

```bash
# Criar database
createdb recanto_db

# Criar usuário (se necessário)
createuser -P postgres

# Executar schema SQL
psql -U postgres -d recanto_db -f backend/src/db/schema.sql

# Verificar tabelas
psql -U postgres -d recanto_db -c "\dt"
```

#### Opção B: PostgreSQL via Docker (sem compose)

```bash
docker run --name postgres-recanto \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=recanto_db \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  -d postgres:15-alpine

# Executar schema após iniciar
docker exec -i postgres-recanto psql -U postgres -d recanto_db < backend/src/db/schema.sql
```

### 2. Backend Setup

```bash
cd backend

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env

# Editar .env com configurações locais
nano .env
```

Exemplo de `.env` mínimo:

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=recanto_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=dev_secret_key_change_in_production
JWT_REFRESH_SECRET=dev_refresh_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
```

#### Iniciar Backend

```bash
# Development (com nodemon)
npm run dev

# Production
npm run build
npm start
```

Saída esperada:
```
✅ Servidor rodando em http://localhost:5000
📊 Health check em http://localhost:5000/health
```

### 3. Frontend Setup

```bash
cd frontend

# Instalar dependências
npm install

# Criar arquivo .env.local
cp .env.example .env.local

# Editar configurações (opcional)
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Iniciar Frontend

```bash
# Development (com hot reload)
npm run dev

# Production
npm run build
npm start

# Lint
npm run lint
```

Acesse: http://localhost:3000

---

## 🔧 Scripts Úteis

### Backend

```bash
cd backend

# Instalação
npm install

# Desenvolvimento
npm run dev          # Inicia com nodemon

# Build
npm run build

# Produção
npm start

# Testes
npm test
npm run test:watch

# Linting
npm run lint
npm run lint:fix

# Database
npm run migrate      # Executar migrations (se houver)
npm run seed         # Seed com dados de teste

# Logs
npm run logs         # Ver logs (se configurado)
```

### Frontend

```bash
cd frontend

# Instalação
npm install

# Desenvolvimento
npm run dev          # Inicia servidor dev (localhost:3000)

# Build
npm run build        # Build para produção

# Produção
npm start            # Serve arquivos buildados

# Linting
npm run lint

# Type checking
npm run type-check   # Verifica tipos TypeScript
```

---

## 📝 Primeiros Passos após Setup

### 1. Verificar Saúde da API

```bash
curl http://localhost:5000/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-02-16T10:30:00.000Z",
  "environment": "development"
}
```

### 2. Criar um Usuário de Teste (via API)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "SenhaForte123!",
    "firstName": "João",
    "lastName": "Silva"
  }'
```

### 3. Fazer Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "SenhaForte123!"
  }'
```

Copie o `accessToken` da resposta.

### 4. Criar um Texto de Teste

```bash
curl -X POST http://localhost:5000/api/texts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "title": "Meu Primeiro Poema",
    "content": "Este é um poema sobre as belezas da vida...",
    "description": "Um poema tocante",
    "category": "poesia",
    "licenseType": "CC-BY-SA"
  }'
```

---

## 🌍 Variáveis de Ambiente

### Obrigatórias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NODE_ENV` | Ambiente | `development`, `production` |
| `DB_HOST` | Host do PostgreSQL | `localhost` |
| `DB_PORT` | Porta | `5432` |
| `DB_NAME` | Nome do banco | `recanto_db` |
| `DB_USER` | Usuário | `postgres` |
| `DB_PASSWORD` | Senha | `postgres` |
| `JWT_SECRET` | Chave JWT | `sua_chave_super_secreta` |

### Recomendadas

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do Backend | `5000` |
| `CORS_ORIGIN` | Origins CORS | `http://localhost:3000` |
| `JWT_EXPIRE` | Expiração JWT | `15m` |
| `NEXT_PUBLIC_API_URL` | URL da API | `http://localhost:5000` |

### Opcionais (para Funcionalidades Completas)

```env
# Stripe
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
S3_BUCKET=recanto-uploads

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sua_email@gmail.com
SMTP_PASS=sua_senha_app
```

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"

```bash
# Verificar se PostgreSQL está rodando
psql -U postgres

# Se usar Docker
docker ps | grep postgres
docker logs postgres-recanto

# Verificar credenciais em .env
```

### Erro: "Port 5000 already in use"

```bash
# Encontre o processo usando a porta
netstat -lntp | grep 5000

# Mate o processo
kill -9 <PID>

# Ou mude a PORT em .env
PORT=5001
```

### Erro: "NEXT_PUBLIC_API_URL not found"

```bash
# Criar arquivo .env.local no frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > frontend/.env.local
```

### Erro: "Token expired"

Os tokens JWT têm expiração configurável: JWT_EXPIRE=15m

### Erro: "Email service not working"

Verificar:
- Credenciais SMTP em .env
- Gmail: Ativar 2FA e gerar App Password
- Firewall: permitir porta SMTP (587 ou 465)

---

## ✅ Checklist de Setup

- [ ] Node.js 18+ instalado: `node --version`
- [ ] npm 9+ instalado: `npm --version`
- [ ] Clonar repositório: `git clone ...`
- [ ] Criar .env na raiz: `cp .env.example .env`
- [ ] Criar backend/.env: `cp backend/.env.example backend/.env`
- [ ] Criar frontend/.env.local: (opcional)
- [ ] Docker Compose: `docker-compose up` (ou setup manual)
- [ ] Verificar health: `curl http://localhost:5000/health`
- [ ] Acessar frontend: http://localhost:3000
- [ ] Registrar usuário de teste
- [ ] Publicar texto de teste
- [ ] Verificar logs: `docker-compose logs -f`

---

## 📚 Recursos Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [Express Docs](https://expressjs.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Docker Docs](https://docs.docker.com)
- [Stripe API](https://stripe.com/docs/api)
- [JWT.io](https://jwt.io)

## 🆘 Suporte

- **Issues:** GitHub Issues
- **Discussões:** GitHub Discussions
- **Email:** suporte@recantodospoetas.com
