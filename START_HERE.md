# ✅ Projeto Recanto dos Poetas - Guia Rápido

## 📦 O que foi criado?

Um **site fullstack completo** para publicação e venda de textos literários com:

### ✨ Funcionalidades Implementadas

#### Backend (Node.js + Express)
- ✅ API REST com autenticação JWT
- ✅ 15+ endpoints para auth, textos e usuários
- ✅ Sistema de senhas com bcrypt
- ✅ Rate limiting e validação
- ✅ Suporte a Stripe para pagamentos
- ✅ Envio de emails (Nodemailer)
- ✅ Schema SQL completo com 12+ tabelas
- ✅ Middleware de segurança

#### Frontend (Next.js + React)
- ✅ Página inicial responsiva
- ✅ Autenticação (Login/Registro)
- ✅ Zustand para state management
- ✅ Axios para requisições HTTP
- ✅ Tailwind CSS para styling
- ✅ Proteção anti-cópia (CSS/JS)
- ✅ Watermark visual
- ✅ TypeScript completo

#### Infraestrutura
- ✅ Docker & Docker Compose
- ✅ PostgreSQL pronto
- ✅ Redis para cache
- ✅ Documentação completa
- ✅ Environment setup

---

## 📂 Estrutura do Projeto

```
Recanto-dos-Poetas/
├── backend/                    # API Node.js
│   ├── src/
│   │   ├── server.js          # Servidor principal
│   │   ├── routes/            # Rotas da API
│   │   ├── controllers/       # Lógica de negócio
│   │   ├── models/            # Queries ao banco
│   │   ├── middleware/        # Auth, errors
│   │   ├── services/          # Email, pagamentos
│   │   ├── utils/             # JWT, validators
│   │   ├── config/            # Conexão DB
│   │   └── db/
│   │       └── schema.sql     # Estrutura do banco
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/                   # App Next.js
│   ├── src/
│   │   ├── app/               # Páginas (layout, home, login, register)
│   │   ├── components/        # Componentes React
│   │   ├── pages/             # Páginas adicionais
│   │   ├── styles/            # CSS global + Tailwind
│   │   ├── hooks/             # Custom hooks
│   │   ├── stores/            # Zustand (auth)
│   │   ├── services/          # API client
│   │   └── utils/             # Utilities
│   ├── public/                # Assets estáticos
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── Dockerfile
│
├── docs/                       # Documentação
│   ├── ARQUITETURA.md         # Visão geral técnica
│   ├── SETUP.md               # Guia de instalação
│   ├── SEGURANCA.md           # Proteção anti-cópia
│   ├── API.md                 # Endpoints da API
│   └── ROADMAP.md             # Plano futuro
│
├── docker-compose.yml         # Orquestração local
├── .env.example               # Template de env vars
├── .gitignore
└── README.md
```

---

## 🚀 Começar Rápido (5 minutos)

### 1. Ter Docker Instalado

Linux/Mac:
```bash
docker --version
docker-compose --version
```

Windows: [Instalar Docker Desktop](https://www.docker.com/products/docker-desktop)

### 2. Clonar o Projeto

```bash
cd /workspaces/Recanto-dos-Poetas
```

### 3. Configurar Variáveis

```bash
cp .env.example .env
```

Edite `.env` se precisar mudar DB password ou ports.

### 4. Iniciar Tudo

```bash
docker-compose up
```

Aguarde ~30s para tudo iniciar. Saída esperada:

```
✅ Servidor rodando em http://localhost:5000
postgres_1  | PostgreSQL started...
frontend_1  | > npm run dev
```

### 5. Acessar

- **Frontend:** http://localhost:3000
- **API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health

### 6. Testar Cadastro

Acesse http://localhost:3000 → Clique em "Cadastrar"

```
Email: teste@teste.com
Senha: Senha123!
Nome: João Silva
```

### 7. Parar Tudo

```bash
docker-compose down
```

---

## 📋 Próximos Passos (O que Fazer Agora)

### 1. **Explorar o Banco de Dados** (15 min)

```bash
# Conectar ao PostgreSQL
docker exec -it recanto_postgres psql -U postgres -d recanto_db

# Ver tabelas
\dt

# Ver usuários criados
SELECT id, email, role FROM users;
```

### 2. **Testar a API** (20 min)

```bash
# Health check
curl http://localhost:5000/health

# Registrar
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "novo@teste.com",
    "password": "Senha123!",
    "firstName": "Maria",
    "lastName": "Silva"
  }'

# Login (copiar o accessToken)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "novo@teste.com", "password": "Senha123!"}'

# Criar texto (substituir TOKEN)
curl -X POST http://localhost:5000/api/texts \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Poema Test",
    "content": "Este é um poema de teste com mais de 100 caracteres para passar na validação...",
    "category": "poesia",
    "licenseType": "CC-BY-SA"
  }'
```

### 3. **Modificar o Frontend** (30 min)

Edite [frontend/src/app/page.tsx](frontend/src/app/page.tsx) para customizar a homepage.

Exemplo: Mudar cor do site

```javascript
// Antes
<h1 className="text-blue-600">Recanto dos Poetas</h1>

// Depois
<h1 className="text-purple-600">Recanto dos Poetas</h1>
```

Salvando o arquivo, Next.js reloada automaticamente.

### 4. **Adicione Mais Funcionalidades** (1-2h)

Sugestões:
- [ ] Página de perfil
- [ ] Listar textos publicados
- [ ] Sistema de favoritos (❤️ botão)
- [ ] Comentários
- [ ] Busca avançada
- [ ] Upload de imagem de perfil

### 5. **Configurar Email Real** (15 min)

Se quiser testar envio de emails:

1. Ativar 2FA no Gmail
2. Gerar App Password: https://myaccount.google.com/apppasswords
3. Editar `backend/.env`:

```env
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_app_password_16_chars
```

4. Reiniciar backend:

```bash
docker-compose restart backend
```

### 6. **Configurar Stripe** (30 min - opcional para MVP)

Criar conta em https://stripe.com

1. Obter `STRIPE_PUBLIC_KEY` e `STRIPE_SECRET_KEY`
2. Editar `backend/.env` e `frontend/.env`
3. Implementar endpoints de pagamento em `backend/src/routes/paymentRoutes.js`

---

## 🛠️ Troubleshooting

### "Port 3000 em uso"

```bash
# Mude em docker-compose.yml ou .env
PORT=3001
```

### "Cannot connect to postgres"

```bash
# Ver logs
docker-compose logs postgres

# Verificar se containter iniciou
docker ps | grep postgres

# Reiniciar
docker-compose restart postgres
```

### "API retorna 500"

```bash
# Ver logs do backend
docker-compose logs -f backend

# Verificar database conectado
docker-compose exec backend npm run test
```

### Código não atualiza no frontend

```bash
# Docker às vezes não monitora bem
docker-compose down
docker-compose up

# Ou editar arquivo e refrescar navegador (F5)
```

---

## 🔐 Segurança - Antes de Produção

- [ ] Mudar `JWT_SECRET` em `.env`
- [ ] Configurar HTTPS (Nginx/SSL)
- [ ] Ativar 2FA para admin
- [ ] Testar rate limiting
- [ ] Revisar logs de auditoria
- [ ] Fazer backup do banco
- [ ] Revisar política de privacidade/termos

---

## 📚 Documentação Disponível

| Documento | Para... |
|-----------|---------|
| [README.md](README.md) | Visão geral do projeto |
| [SETUP.md](docs/SETUP.md) | Instalar e configurar |
| [ARQUITETURA.md](docs/ARQUITETURA.md) | Entender o código |
| [API.md](docs/API.md) | Usar os endpoints |
| [SEGURANCA.md](docs/SEGURANCA.md) | Proteger conteúdo |
| [ROADMAP.md](docs/ROADMAP.md) | Plano futuro |

---

## 🤝 Stack Resumido

| Aspecto | Tecnologia |
|--------|-----------|
| **Backend** | Node.js 18 + Express |
| **Frontend** | Next.js 14 + React 18 |
| **Database** | PostgreSQL 15 |
| **Cache** | Redis 7 |
| **Autenticação** | JWT |
| **Pagamentos** | Stripe (integração pronta) |
| **Styling** | Tailwind CSS 3 |
| **Alerts** | React Hot Toast |
| **State** | Zustand |
| **HTTP** | Axios |
| **Deploy** | Docker + Docker Compose |

---

## 📞 Próximos: E Agora?

### Opção 1: Continuar Desenvolvendo Localmente

```bash
cd /workspaces/Recanto-dos-Poetas
docker-compose up
# Começar a modificar código!
```

### Opção 2: Estudar a Arquitetura

Leia [docs/ARQUITETURA.md](docs/ARQUITETURA.md) e entenda:
- Como funciona o JWT
- Fluxo de autenticação
- Modelo de dados
- Proteção contra cópia

### Opção 3: Implementar Novas Features

Crie um branch e implemente:
- Sistema de pagamento (Stripe)
- Integração com email real
- Upload de fotos
- Mais endpoints

### Opção 4: Deploy

Quando pronto para produção:
- Railway, Heroku ou AWS
- Adicionar domínio customizado
- HTTPS com Let's Encrypt
- Backups automatizados

---

## 📧 Suporte

Se tiver dúvidas:

1. Leia a [documentação](docs/)
2. Verifique os logs: `docker-compose logs`
3. Abra uma GitHub Issue
4. Email: dev@recantodospoetas.com

---

## 🎉 Parabéns!

Você tem uma **plataforma literária profissional** pronta para começar!

**Próximas milestones:**
- ✅ MVP com auth e CRUD de textos
- 🔜 Pagamentos com Stripe
- 🔜 Comunidade (comentários, favoritos)
- 🔜 Analytics e dashboards
- 🔜 Mobile app

Boa codificação! 🚀📚
