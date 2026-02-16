# 🔒 Segurança e Proteção de Conteúdo

## 1. Proteção contra Cópia (Anti-Copy)

### Importante: Realidade da Web

**É tecnicamente impossível impedir completamente a cópia de conteúdo exibido no navegador.**

Um usuário determinado pode:
- Capturar tela
- Usar devtools para inspecionar HTML
- Fazer scraping
- Usar OCR (Optical Character Recognition)

**A nossa abordagem:** Dificultar, desencorajar e criar consequências legais.

### Camada 1: Frontend (CSS/JavaScript)

#### Desabilitar Seleção de Texto

```css
.protected-text {
  user-select: none !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
}
```

#### Desabilitar Copy/Cut

```javascript
document.addEventListener('copy', function(e) {
  if (e.target?.closest('.protected-text')) {
    e.preventDefault();
    alert('Cópia de conteúdo protegido não é permitida');
  }
});

document.addEventListener('cut', function(e) {
  if (e.target?.closest('.protected-text')) {
    e.preventDefault();
  }
});
```

#### Desabilitar Menu de Contexto

```javascript
document.addEventListener('contextmenu', function(e) {
  if (e.target?.closest('.protected-text')) {
    e.preventDefault();
  }
});
```

#### Detectar Ferramentas do Desenvolvedor

```javascript
// Detector simples
let devtools = { open: false };
const threshold = 160;
setInterval(() => {
  if (window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold) {
    if (!devtools.open) {
      devtools.open = true;
      console.warn('DevTools detectadas');
      // Enviar logging ao servidor
    }
  } else {
    devtools.open = false;
  }
}, 500);
```

### Camada 2: Watermark Visual

#### Watermark Visível no Topo

```jsx
<div className="text-reader">
  <div className="bg-yellow-100 border border-yellow-400 p-4 mb-6 rounded">
    <p className="text-sm text-gray-700">
      <strong>⚖️ Trabalho Protegido</strong>
    </p>
    <p className="text-sm text-gray-600">
      Este texto está licenciado sob 
      <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="underline">
        Creative Commons BY-SA 4.0
      </a>
    </p>
    <p className="text-xs text-gray-500 mt-2">
      Autor: {author.name} | URL: {window.location.href}
    </p>
  </div>
  {/* Conteúdo do texto */}
</div>
```

#### Watermark Visual com CSS

```css
.text-watermark {
  position: relative;
}

.text-watermark::before {
  content: "© Recanto dos Poetas - Conteúdo Protegido";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.05;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-45deg);
  pointer-events: none;
  z-index: -1;
}
```

#### Watermark em PDFs

Se oferecermos downloads, incluir no PDF:
- Nome do autor
- Data de publicação
- Licença (CC-BY, etc)
- URL do texto no site
- ID único para rastreamento

### Camada 3: Backend (Rate Limiting e Logs)

#### Rate Limiting por IP

```javascript
import rateLimit from 'express-rate-limit';

const textLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // 10 requisições por minuto
  message: 'Muitas requisições. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/api/texts/:id', textLimiter, getTextById);
```

#### Detectar Scraping

```javascript
// Controllers/textController.js
export const getTextById = async (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const ip = req.ip;

  // Detectar bots/scrapers
  const scraperPatterns = [
    'curl', 'wget', 'scrapy', 'bot', 'spider',
    'python', 'perl', 'ruby', 'node-fetch'
  ];

  const isSuspect = scraperPatterns.some(pattern =>
    userAgent.toLowerCase().includes(pattern)
  );

  if (isSuspect) {
    await logViolation({
      type: 'suspicious_access',
      ip,
      userAgent,
      textId: req.params.id,
      timestamp: new Date(),
    });

    // Bloquear ou avisar
    return res.status(403).json({
      error: 'Acesso negado',
    });
  }

  // Lógica normal...
};
```

#### Logs de Acesso

```javascript
// middleware/auditLog.js
export const auditLog = async (req, res, next) => {
  const originalJson = res.json;

  res.json = function(data) {
    if (res.statusCode === 200) {
      pool.query(
        `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          req.user?.id,
          req.method + ' ' + req.path,
          'text',
          req.params.id,
          req.ip,
          req.headers['user-agent']
        ]
      ).catch(err => console.error('Log error:', err));
    }

    return originalJson.call(this, data);
  };

  next();
};
```

### Camada 4: Legal (Termos de Uso)

#### Aviso de Direitos Autorais

```jsx
<div className="bg-red-50 border border-red-200 p-4 rounded mb-6">
  <h3 className="font-bold text-red-800 mb-2">⚠️ Aviso de Direitos Autorais</h3>
  <p className="text-sm text-red-700">
    Este texto é propriedade intelectual protegida por lei. A reprodução, 
    distribuição ou qualquer outro uso não autorizado é estritamente proibido 
    e pode resultar em ações legais.
  </p>
  <p className="text-xs text-red-600 mt-2">
    Licença: Creative Commons BY-SA 4.0
  </p>
</div>
```

#### Termos de Uso (pré-read obrigatório)

Adicione a política de aceitar termos antes de acessar:

```javascript
// pages/texto/[slug].tsx
if (!user?.acceptedTerms) {
  return <TermsAcceptanceModal textId={textId} />;
}
```

#### Link para Denunciar Plágio

```jsx
<footer className="mt-8 pt-4 border-t">
  <p className="text-sm text-gray-600">
    Encontrou este texto em outro lugar sem créditos?{' '}
    <a href="/report-plagiarism" className="text-blue-600 underline">
      Denuncie aqui
    </a>
  </p>
</footer>
```

---

## 2. Autenticação e Autorização

### JWT (JSON Web Token)

#### Estrutura de Token

```javascript
// Payload
{
  "id": "uuid-user",
  "email": "autor@exemplo.com",
  "role": "author",
  "iat": 1708089600,
  "exp": 1708090500
}
```

#### Geração de Tokens

```javascript
// utils/jwt.js
import jwt from 'jsonwebtoken';

export const generateTokens = (userId, email, role) => {
  const accessToken = jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Expiração curta = mais seguro
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};
```

#### Verificação de Token

```javascript
// middleware/auth.js
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
```

### Hash de Senhas

```javascript
// models/User.js
import bcryptjs from 'bcryptjs';

// Ao criar/atualizar usuario
const saltRounds = 12;
const passwordHash = await bcryptjs.hash(password, saltRounds);

// Ao fazer login
const passwordMatch = await bcryptjs.compare(plainPassword, hash);
```

### CORS (Cross-Origin Resource Sharing)

```javascript
// server.js
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:3000',
    'https://recantodospoetas.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

## 3. Proteção contra Ataques Comuns

### XSS (Cross-Site Scripting)

#### Validação de Input

```javascript
// middleware/validation.js
import validator from 'validator';
import DOMPurify from 'dompurify';

export const validateTextContent = (content) => {
  // Sanitizar HTML perigoso
  const clean = DOMPurify.sanitize(content);

  // Verificar comprimento
  if (clean.length < 100 || clean.length > 100000) {
    throw new Error('Tamanho inválido');
  }

  return clean;
};
```

#### Renderização Segura (Frontend)

```jsx
import DOMPurify from 'dompurify';

function TextViewer({ text }) {
  const sanitizedContent = DOMPurify.sanitize(text.content);

  return (
    <div 
      className="protected-text"
      dangerouslySetInnerHTML={{
        __html: sanitizedContent
      }}
    />
  );
}
```

### CSRF (Cross-Site Request Forgery)

Se usar sessions/cookies:

```javascript
// server.js
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

app.use(cookieParser());
app.use(csrf({ cookie: false })); // Com session

// Aplicar middleware
app.post('/api/texts', csrf(), textController.create);
```

### SQL Injection

Usar **parameterized queries** (é o padrão):

```javascript
// ✅ CORRETO - Parâmetros
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// ❌ ERRADO - Concatenação de strings
const result = await pool.query(
  `SELECT * FROM users WHERE email = '${email}'`
);
```

---

## 4. Dados Sensíveis

### O que NÃO armazenar

- Senhas em plain text → hash com bcrypt
- Tokens em localStorage → usar httpOnly cookies (melhor)
- Chaves API no código → usar environment variables
- Dados de pagamento → usar Stripe/Mercado Pago (terceiros)

### O que ✅ fazer

```javascript
// Armazenar Stripe Account ID (seguro)
stripe_account_id: 'acct_1234567890',

// NÃO armazenar tokens de pagamento
// Usar Stripe Webhooks para confirmar pagamentos

// Usar HTTPS sempre
process.env.NODE_ENV === 'production' && 
  enforceHttps = true;
```

---

## 5. Checklist de Segurança

### Frontend
- [ ] Validação de inputs (client-side)
- [ ] DOMPurify para sanitizar HTML
- [ ] Tokens em localStorage (ou melhor: httpOnly cookies)
- [ ] Proteção contra XSS
- [ ] Proteção contra cópia (CSS)

### Backend
- [ ] Validação de inputs (server-side)
- [ ] Hash de senhas (bcrypt, rounds=12)
- [ ] JWT verification
- [ ] Rate limiting
- [ ] CORS configurado
- [ ] HTTPS em produção
- [ ] Headers de segurança (Helmet)
- [ ] Logs de auditoria
- [ ] Proteção contra SQL injection (parameterized queries)

### Database
- [ ] Backup automático
- [ ] Criptografia de dados sensíveis
- [ ] Política de retenção de dados
- [ ] Acesso restrito (VPC/firewall)

### Operacional
- [ ] Senhas fortes (>8 chars, mix de tipos)
- [ ] 2FA para contas admin
- [ ] Monitoramento de acesso
- [ ] Alertas para atividades suspeitas
- [ ] Política de private responsável (LGPD)

---

## 6. Relatório de Segurança

Se encontrar uma vulnerabilidade:

1. **NÃO publique** em issues públicas
2. **Email:** security@recantodospoetas.com
3. **Descreva:**
   - Tipo de vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sugestão de fix (opcional)

4. **Prazo:** Responderemos em 48h
