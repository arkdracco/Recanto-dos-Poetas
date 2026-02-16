# 📚 API Documentation - Recanto dos Poetas

**Base URL:** `http://localhost:5000/api`

## 🔐 Autenticação

Todo endpoint ao exceto `/auth/register`, `/auth/login`, `/texts/published` e `/texts/search` requer JWT token no header:

```
Authorization: Bearer <SEU_TOKEN_AQUI>
```

---

## 👤 Auth Endpoints (`/auth`)

### Register - Criar Nova Conta

```http
POST /auth/register
Content-Type: application/json

{
  "email": "novo@usuario.com",
  "password": "SenhaForte123!",
  "firstName": "João",
  "lastName": "Silva"
}
```

**Response (201):**
```json
{
  "message": "Usuário registrado com sucesso",
  "user": {
    "id": "uuid",
    "email": "novo@usuario.com",
    "firstName": "João",
    "lastName": "Silva",
    "role": "reader"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

---

### Login - Fazer Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "novo@usuario.com",
  "password": "SenhaForte123!"
}
```

**Response (200):**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": "uuid",
    "email": "novo@usuario.com",
    "firstName": "João",
    "lastName": "Silva",
    "role": "reader",
    "emailVerified": true
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

---

### Verify Email - Verificar Email

```http
POST /auth/verify-email
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "message": "Email verificado com sucesso",
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "emailVerified": true
  }
}
```

---

### Forgot Password - Solicitar Reset

```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "usuario@email.com"
}
```

**Response (200):**
```json
{
  "message": "Se o email existe em nossa base, um link de reset foi enviado"
}
```

---

### Reset Password - Redefinir Senha

```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "NovaSenha123!"
}
```

**Response (200):**
```json
{
  "message": "Senha alterada com sucesso",
  "user": {
    "id": "uuid",
    "email": "usuario@email.com"
  }
}
```

---

### Get Current User - Obter Dados do Usuário

```http
GET /auth/me
Authorization: Bearer <TOKEN>
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "firstName": "João",
    "lastName": "Silva",
    "role": "author",
    "bio": "Poeta apaixonado...",
    "profilePicture": "https://...",
    "emailVerified": true,
    "isActive": true,
    "createdAt": "2024-02-01T10:00:00Z"
  }
}
```

---

### Update Profile - Atualizar Perfil

```http
PUT /auth/profile
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "firstName": "João",
  "lastName": "Silva",
  "bio": "Escritor independente",
  "profilePicture": "https://example.com/avatar.jpg"
}
```

**Response (200):**
```json
{
  "message": "Perfil atualizado com sucesso",
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "firstName": "João",
    "lastName": "Silva",
    "bio": "Escritor independente",
    "profilePicture": "https://example.com/avatar.jpg"
  }
}
```

---

## 📖 Text Endpoints (`/texts`)

### Create Text - Criar novo Texto

```http
POST /texts
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "Meu Primeiro Poema",
  "content": "Quando as cores do entardecer rebelam...",
  "description": "Um poema sobre a beleza do fim do dia",
  "category": "poesia",
  "licenseType": "CC-BY-SA",
  "coverImage": "https://example.com/capa.jpg"
}
```

**Response (201):**
```json
{
  "message": "Texto criado com sucesso",
  "text": {
    "id": "uuid",
    "title": "Meu Primeiro Poema",
    "slug": "meu-primeiro-poema-abc123",
    "status": "draft",
    "wordCount": 457,
    "readingTime": 2,
    "createdAt": "2024-02-16T10:00:00Z"
  }
}
```

---

### Get Text by ID - Obter Texto por ID

```http
GET /texts/id/{textId}
Authorization: Bearer <TOKEN> (opcional)
```

**Response (200):**
```json
{
  "text": {
    "id": "uuid",
    "title": "Meu Primeiro Poema",
    "content": "Quando as cores do entardecer rebelam...",
    "slug": "meu-primeiro-poema-abc123",
    "description": "Um poema...",
    "category": "poesia",
    "licenseType": "CC-BY-SA",
    "status": "published",
    "wordCount": 457,
    "readingTime": 2,
    "viewCount": 45,
    "likeCount": 12,
    "author": {
      "firstName": "João",
      "lastName": "Silva",
      "profilePicture": "https://..."
    },
    "publishedAt": "2024-02-10T14:30:00Z",
    "createdAt": "2024-02-01T10:00:00Z"
  }
}
```

---

### Get Text by Slug - Obter Texto por URL slug

```http
GET /texts/slug/{slug}
```

**Response (200):** Mesmo que acima

---

### Update Text - Atualizar Texto (Draft)

```http
PUT /texts/{textId}
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "Meu Primeiro Poema (Revisado)",
  "content": "Novo conteúdo...",
  "description": "Descrição atualizada",
  "category": "poesia",
  "licenseType": "CC-BY"
}
```

**Response (200):**
```json
{
  "message": "Texto atualizado com sucesso",
  "text": {
    "id": "uuid",
    "title": "Meu Primeiro Poema (Revisado)",
    "slug": "meu-primeiro-poema-abc123",
    "updatedAt": "2024-02-16T15:30:00Z"
  }
}
```

---

### Publish Text - Publicar Texto

```http
POST /texts/{textId}/publish
Authorization: Bearer <TOKEN>
```

**Response (200):**
```json
{
  "message": "Texto publicado com sucesso",
  "text": {
    "id": "uuid",
    "status": "published",
    "publishedAt": "2024-02-16T15:33:00Z"
  }
}
```

---

### Delete Text - Deletar Texto

```http
DELETE /texts/{textId}
Authorization: Bearer <TOKEN>
```

**Response (200):**
```json
{
  "message": "Texto deletado com sucesso",
  "text": {
    "id": "uuid",
    "status": "deleted"
  }
}
```

---

### Get Published Texts - Listar Textos Publicados

```http
GET /texts/published?limit=10&offset=0&category=poesia
```

**Response (200):**
```json
{
  "texts": [
    {
      "id": "uuid",
      "title": "Poema Lindíssimo",
      "slug": "poema-lindissimo",
      "description": "...",
      "category": "poesia",
      "coverImage": "https://...",
      "wordCount": 250,
      "readingTime": 1,
      "viewCount": 123,
      "author": {
        "firstName": "Maria",
        "lastName": "Santos",
        "profilePicture": "https://..."
      },
      "publishedAt": "2024-02-15T10:00:00Z"
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 45,
    "hasMore": true
  }
}
```

---

### Search Texts - Buscar Textos

```http
GET /texts/search?q=amor&limit=20&offset=0
```

**Query Parameters:**
- `q` (required): Termo de busca (min 3 caracteres)
- `limit` (optional): Limite de resultados (default: 20)
- `offset` (optional): Offset para pagination

**Response (200):**
```json
{
  "query": "amor",
  "texts": [
    {
      "id": "uuid",
      "title": "Soneto do Amor",
      "slug": "soneto-do-amor",
      "description": "Um soneto clássico...",
      "viewCount": 456,
      "author": {
        "firstName": "Camões",
        "lastName": "Luiz"
      }
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0
  }
}
```

---

### Get Author Texts - Listar Textos de um Autor

```http
GET /texts/author/{authorId}?status=published
```

**Query Parameters:**
- `status`: `published`, `draft`, `all` (default: published)

**Response (200):**
```json
{
  "texts": [
    {
      "id": "uuid",
      "title": "Poema 1",
      "slug": "poema-1",
      "status": "published",
      "wordCount": 300,
      "viewCount": 89,
      "createdAt": "2024-02-01T10:00:00Z"
    }
  ]
}
```

---

## ⚠️ Error Responses

### 400 Bad Request

```json
{
  "error": "Título e conteúdo são obrigatórios"
}
```

### 401 Unauthorized

```json
{
  "error": "Token de autenticação não fornecido"
}
```

### 403 Forbidden

```json
{
  "error": "Acesso negado",
  "required_roles": ["author"]
}
```

### 404 Not Found

```json
{
  "error": "Texto não encontrado"
}
```

### 409 Conflict

```json
{
  "error": "Registro duplicado",
  "field": "email"
}
```

### 500 Internal Server Error

```json
{
  "error": "Erro interno do servidor"
}
```

---

## 🔄 Rate Limiting

- **Limite:** 100 requisições por 15 minutos por IP
- **Header:** `X-RateLimit-Remaining`

---

## 📝 Padrões de Status HTTP

- `200 OK` - Sucesso (GET, PUT)
- `201 Created` - Recurso criado (POST)
- `204 No Content` - Sucesso sem resposta (DELETE)
- `400 Bad Request` - Erro de validação
- `401 Unauthorized` - Não autenticado
- `403 Forbidden` - Sem permissão
- `404 Not Found` - Recurso não existe
- `409 Conflict` - Conflito (ex: email duplicado)
- `500 Internal Server Error` - Erro do servidor

---

## 🔗 Links Úteis

- [Postman Collection](#) (TBD)
- [OpenAPI/Swagger](#) (TBD)
- [Rate Limiting Docs](#)
- [Authentication Guide](#)

---

## 📞 Suporte

Se encontrar erros na API:

1. Verifique o token JWT
2. Verifique os parâmetros obrigatórios
3. Verifique a autenticação
4. Veja os logs: `docker-compose logs backend`
5. Abra uma issue no GitHub
