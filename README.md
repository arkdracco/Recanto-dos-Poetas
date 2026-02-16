# 📚 Recanto dos Poetas - Plataforma Literária Digital

Um site completo para publicação, leitura e venda de direitos autorais de textos literários com proteção via Creative Commons.

## ✨ Funcionalidades

### Para Autores
- ✅ Cadastro seguro com email e senha
- ✅ Perfil de autor com bio, foto e dados de pagamento
- ✅ Publicação de textos mit draft/preview/publicado
- ✅ Escolha de licença CC (BY, BY-SA, BY-NC, BY-ND, etc)
- ✅ Venda individual de direitos autorais
- ✅ Painel de ganhos e transações
- ✅ Edição e exclusão de textos

### Para Leitores
- ✅ Busca e exploração de textos por categoria/autor
- ✅ Leitura confortável com zoom e temas (claro/escuro)
- ✅ Perfil para acompanhar autores favoritos
- ✅ Sistema de compra de licenças individuais
- ✅ Download de licença em PDF

### Segurança e Proteção
- 🔒 Proteção anti-cópia (CSS disable select, watermark)
- 🔐 Autenticação JWT com refresh tokens
- 📝 Watermark digital nos textos
- 🛡️ Rate limiting e proteção anti-scraping
- 🔑 Bcrypt para senhas, chave privada para tokens

## 🏗️ Arquitetura

```
Recanto-dos-Poetas/
├── backend/          # API REST Node.js + Express
├── frontend/         # SPA React + Next.js
├── docs/             # Documentação e diagramas
└── docker-compose.yml # Ambiente local
```

### Stack Tecnológico

**Backend:**
- Node.js + Express
- PostgreSQL
- JWT para autenticação
- Stripe/Mercado Pago para pagamentos
- Nodemailer para emails
- Multer para uploads

**Frontend:**
- Next.js 14+
- React 18+
- TailwindCSS
- Axios
- React Query para cache

**Infraestrutura:**
- Docker & Docker Compose
- AWS S3 (imagens/capas)
- Nginx (reverse proxy)

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+ (ou via Docker)
- Conta Stripe (opcional, para pagamentos)

### Instalação Local

1. **Clonar e entrar no diretório:**
```bash
cd /workspaces/Recanto-dos-Poetas
```

2. **Iniciar banco de dados:**
```bash
docker-compose up -d postgres redis
```

3. **Backend (em um terminal):**
```bash
cd backend
npm install
npm run migrate
npm run dev
```

4. **Frontend (em outro terminal):**
```bash
cd frontend
npm install
npm run dev
```

5. **Acessar:**
- Frontend: http://localhost:3000
- API: http://localhost:5000
- Banco: localhost:5432

## 📊 Modelo de Dados

### Usuários (`users`)
```sql
- id (UUID)
- email (unique)
- password_hash
- name
- role (author, reader, admin)
- profile_picture
- created_at
- updated_at
```

### Perfil de Autor (`author_profiles`)
```sql
- id (UUID)
- user_id (FK)
- bio
- website
- social_media (JSON)
- stripe_account (para pagamentos)
- verified (boolean)
```

### Textos (`texts`)
```sql
- id (UUID)
- author_id (FK)
- title
- content
- slug (unique)
- description
- category
- cover_image
- license_type (CC-BY, CC-BY-NC, etc)
- status (draft, published, archived)
- word_count
- created_at
- updated_at
- published_at
```

### Licenças Individuais (`text_licenses`)
```sql
- id (UUID)
- text_id (FK)
- buyer_id (FK)
- license_type (use_terms)
- price (centavos)
- status (pending, completed, refunded)
- expires_at (null = perpetua)
- created_at
```

### Transações (`transactions`)
```sql
- id (UUID)
- buyer_id (FK)
- author_id (FK)
- text_id (FK)
- amount (centavos)
- platform_fee
- author_revenue
- status (pending, completed, failed)
- stripe_id
- receipt_url
- created_at
```

## 🔒 Fluxo de Proteção

### Como funciona o bloqueio de cópia:

1. **CSS Protection:**
   - `user-select: none` nos textos
   - Context menu desativado
   - Overflow hidden em seleções

2. **JavaScript:**
   - Event listeners para copy, cut, select
   - Detectar ferramenta do desenvolvedor
   - Anti-scraping verificando User-Agent

3. **Watermark Visual:**
   - Nome do autor + URL do site
   - Posicionado ao fundo com opacidade
   - Incluído em downloads

4. **Backend Security:**
   - Rate limiting por IP
   - Detecção de comportamento suspeito
   - Logs de acesso
   - CORS restrictivo

5. **Legal:**
   - Termos de uso claros
   - Licença Creative Commons explícita
   - Aviso de plágio no rodapé
   - Link para denunciar violação

## 💰 Modelo de Monetização

### Opção 1: Licença Individual Simples
```
Autor publica texto com CC-BY-NC
Leitor quer uso comercial
Clica "Solicitar licença especial"
Formulário + contato direto com o autor
```

### Opção 2: Marketplace de Licenças
```
Autor publica com preço de licença especial
Ex: CC-BY-NC + $50 para uso comercial
Leitor clica "Comprar licença"
Integração Stripe/Mercado Pago
Autor recebe em conta (70% / 30% plataforma)
```

### Comissão da Plataforma
- 30% em transações via Stripe
- 5% em pagamentos PayPal direto
- 0% em doações (autor 100%)

## 📧 Fluxo de Emails

- Bem-vindo ao cadastro
- Verificação de email
- Reset de senha
- Publicação confirmada
- Novo seguidor
- Compra de licença confirmada
- Pagamento processado
- Recebimento de licença solicitada

## 🔐 Segurança

- **Hash de senha:** Bcrypt (rounds: 12)
- **JWT:** HS256, 15 min de expiração
- **Refresh token:** 7 dias
- **HTTPS:** Obrigatório em produção
- **CORS:** Whitelist de domínios
- **Rate Limiting:** 100 req/min por IP
- **2FA:** Opcional para autores

## 📱 Responsive Design

- Mobile-first approach
- Tablets: layout adaptado
- Desktop: layout completo com sidebar
- Touch-friendly buttons (min 44px)

## 🧪 Testes

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

## 🚢 Deployment

### Heroku / Railway
```bash
# Backend
npm run build
npm start

# Frontend (Next.js)
npm run build
npm start
```

### Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 Documentação Adicional

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Security Guidelines](./docs/SECURITY.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 👨‍💻 Desenvolvimento

### Commits
```
feat: nova funcionalidade
fix: correção de bug
docs: atualização de documentação
refactor: refatoração de código
test: adição de testes
```

### Branches
```
main          - produção
develop       - staging
feature/*     - new features
hotfix/*      - urgent fixes
```

## 📄 Licença

MIT License - Veja [LICENSE](./LICENSE) para detalhes.

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

- Issues: GitHub Issues
- Email: suporte@recantodospoetas.com
- Docs: https://docs.recantodospoetas.com

---

**Desenvolvido com ❤️ para autores independentes**
