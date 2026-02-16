-- ===== TABELA: USUÁRIOS =====
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  profile_picture VARCHAR(500),
  role VARCHAR(50) NOT NULL DEFAULT 'reader' CHECK (role IN ('reader', 'author', 'admin')),
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMP,
  bio TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ===== TABELA: PERFIL DE AUTOR =====
CREATE TABLE IF NOT EXISTS author_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  website VARCHAR(500),
  social_media JSONB, -- { "twitter": "", "instagram": "", "facebook": "" }
  stripe_account_id VARCHAR(255), -- Conta Stripe Conectada
  stripe_account_verified BOOLEAN DEFAULT FALSE,
  paypal_email VARCHAR(255),
  pix_key VARCHAR(255), -- Chave PIX
  followers_count INTEGER DEFAULT 0,
  texts_published INTEGER DEFAULT 0,
  total_revenue_cents INTEGER DEFAULT 0, -- em centavos
  is_verified BOOLEAN DEFAULT FALSE,
  verification_badge BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_author_profiles_user_id ON author_profiles(user_id);
CREATE INDEX idx_author_profiles_verified ON author_profiles(is_verified);

-- ===== TABELA: TEXTOS =====
CREATE TABLE IF NOT EXISTS texts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL, -- Para URLs amigáveis
  category VARCHAR(100), -- poesia, conto, romance, crônica, etc
  cover_image VARCHAR(500), -- URL da capa
  word_count INTEGER NOT NULL,
  reading_time_minutes INTEGER, -- tempo estimado de leitura
  license_type VARCHAR(50) NOT NULL DEFAULT 'CC-BY-SA' CHECK (
    license_type IN ('CC-BY', 'CC-BY-SA', 'CC-BY-NC', 'CC-BY-ND', 'CC-BY-NC-SA', 'CC-BY-NC-ND', 'proprietary')
  ),
  license_custom_price_cents INTEGER, -- preço customizado em centavos
  license_expires_at TIMESTAMP, -- null = nunca expira
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'deleted')),
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP
);

CREATE INDEX idx_texts_author_id ON texts(author_id);
CREATE INDEX idx_texts_slug ON texts(slug);
CREATE INDEX idx_texts_status ON texts(status);
CREATE INDEX idx_texts_published_at ON texts(published_at);
CREATE INDEX idx_texts_category ON texts(category);

-- ===== TABELA: SEGUIDORES =====
CREATE TABLE IF NOT EXISTS followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX idx_followers_follower_id ON followers(follower_id);
CREATE INDEX idx_followers_following_id ON followers(following_id);

-- ===== TABELA: FAVORITOS =====
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text_id UUID NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, text_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_text_id ON favorites(text_id);

-- ===== TABELA: LICENÇAS E VENDAS =====
CREATE TABLE IF NOT EXISTS text_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text_id UUID NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  license_type VARCHAR(100) NOT NULL, -- uso_comercial, traduçao, remixagem, etc
  price_cents INTEGER NOT NULL, -- preço em centavos
  duration_days INTEGER, -- null = perpétua
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'pending')),
  transaction_id UUID REFERENCES transactions(id),
  pdf_url VARCHAR(500), -- URL do PDF da licença
  terms_accepted BOOLEAN DEFAULT TRUE,
  accepted_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_text_licenses_text_id ON text_licenses(text_id);
CREATE INDEX idx_text_licenses_buyer_id ON text_licenses(buyer_id);
CREATE INDEX idx_text_licenses_status ON text_licenses(status);

-- ===== TABELA: TRANSAÇÕES =====
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text_id UUID NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL, -- valor total em centavos
  platform_fee_cents INTEGER NOT NULL, -- taxa da plataforma
  author_revenue_cents INTEGER NOT NULL, -- o que o autor recebe
  currency VARCHAR(3) DEFAULT 'BRL',
  payment_method VARCHAR(50), -- stripe, mercado_pago, paypal, pix
  stripe_payment_id VARCHAR(255),
  mercado_pago_id VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'processing', 'completed', 'failed', 'refunded')
  ),
  receipt_url VARCHAR(500),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX idx_transactions_author_id ON transactions(author_id);
CREATE INDEX idx_transactions_text_id ON transactions(text_id);
CREATE INDEX idx_transactions_status ON transactions(status);

-- ===== TABELA: PAGAMENTOS E RETIRADAS =====
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')
  ),
  payment_method VARCHAR(50), -- stripe, paypal, pix, bank_transfer
  payment_details JSONB, -- dados específicos do método
  stripe_payout_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payouts_author_id ON payouts(author_id);
CREATE INDEX idx_payouts_status ON payouts(status);

-- ===== TABELA: COMENTÁRIOS =====
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text_id UUID NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- Para respostas
  content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected', 'deleted')),
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_text_id ON comments(text_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- ===== TABELA: DENÚNCIAS DE VIOLAÇÃO =====
CREATE TABLE IF NOT EXISTS violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text_id UUID REFERENCES texts(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  violation_type VARCHAR(100) NOT NULL, -- plagio, abuso, conteudo_sexual, etc
  description TEXT NOT NULL,
  evidence_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'confirmed', 'resolved', 'dismissed')),
  admin_notes TEXT,
  resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_violations_text_id ON violations(text_id);
CREATE INDEX idx_violations_reported_by ON violations(reported_by);
CREATE INDEX idx_violations_status ON violations(status);

-- ===== TABELA: AUDITORIA =====
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100), -- users, texts, transactions, etc
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ===== VIEWS ÚTEIS =====
CREATE OR REPLACE VIEW author_stats AS
SELECT
  u.id,
  u.first_name || ' ' || u.last_name AS full_name,
  COUNT(DISTINCT t.id) AS texts_published,
  COALESCE(SUM(t.view_count), 0) AS total_views,
  COALESCE(SUM(t.like_count), 0) AS total_likes,
  COALESCE(COUNT(DISTINCT f.follower_id), 0) AS followers,
  COALESCE(SUM(tr.author_revenue_cents), 0) AS total_revenue
FROM users u
LEFT JOIN texts t ON u.id = t.author_id AND t.status = 'published'
LEFT JOIN followers f ON u.id = f.following_id
LEFT JOIN transactions tr ON u.id = tr.author_id AND tr.status = 'completed'
WHERE u.role = 'author'
GROUP BY u.id, u.first_name, u.last_name;

-- ===== TRIGGER: Atualizar updated_at =====
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_author_profiles_updated_at BEFORE UPDATE ON author_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_texts_updated_at BEFORE UPDATE ON texts
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===== FUNÇÃO: Calcular word_count =====
CREATE OR REPLACE FUNCTION calculate_word_count(text_content TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN array_length(string_to_array(trim(text_content), ' '), 1);
END;
$$ LANGUAGE plpgsql;

-- ===== FUNÇÃO: Gerar slug automático =====
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN

  RETURN lower(
    regexp_replace(
      regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'),
      '\s+',
      '-',
      'g'
    )
  );
END;
$$ LANGUAGE plpgsql;
