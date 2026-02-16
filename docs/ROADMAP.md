# 🗺️ Roadmap - Recanto dos Poetas

## Status Atual

**Versão:** 0.1.0 (MVP)
**Status:** Em Desenvolvimento

---

## 📅 Fase 1: MVP (Q1 2024)

### Funcionalidades Críticas
- [ ] ✅ Cadastro/Login com Email
- [ ] ✅ Criação de Perfil de Autor
- [ ] ✅ Publicação de Textos (CRUD)
- [ ] ✅ Leitura Pública de Textos
- [ ] ✅ Sistema de Licenças CC
- [ ] ✅ Autenticação JWT
- [ ] ✅ Proteção anti-cópia (CSS/JS)
- [ ] ✅ Email de confirmação
- [ ] ✅ Busca de textos
- [ ] ✅ Perfil de autor com bio
- [ ] ✅ API REST documentada

### Funcionalidades Secundárias
- [ ] Dashboard básico para autores
- [ ] Contador de visualizações
- [ ] Sistema de favoritos
- [ ] Comments em textos

### Infraestrutura
- [ ] Backend com Express
- [ ] Database com PostgreSQL
- [ ] Frontend com Next.js
- [ ] Docker Compose para local
- [ ] Documentação (Setup, Arquitetura)

---

## 📅 Fase 2: Pagamentos (Q2 2024)

### Integração de Pagamentos
- [ ] Integração com Stripe
- [ ] Integração com Mercado Pago (Brasil)
- [ ] Integração com PayPal (opcional)
- [ ] Checkout seguro
- [ ] Confirmação de pagamento
- [ ] Emissão de recibo em PDF

### Licenças Individuais
- [ ] Modelo de preço customizável
- [ ] Geração de licença em PDF com termos
- [ ] Download de licença após compra
- [ ] Email com comprovante

### Dashboard de Autores
- [ ] Estatísticas de visualizações
- [ ] Rastreamento de ganhos
- [ ] Histórico de transações
- [ ] Extrato de pagamentos
- [ ] Configuração de conta Stripe

### Dashboard de Leitores
- [ ] Minhas licenças
- [ ] Histórico de compras
- [ ] Preferências de leitura
- [ ] Textos salvos (drafts de leitura)

---

## 📅 Fase 3: Community (Q3 2024)

### Recursos Sociais
- [ ] Sistema de "seguir" autores
- [ ] Notificações de novas publicações
- [ ] Categorização de textos
- [ ] Tags e marcadores
- [ ] Avaliações de textos (rating)
- [ ] Comentários com moderation

### Descoberta
- [ ] Feed personalizado
- [ ] Recomendações baseadas em leitura
- [ ] Trending texts/autores
- [ ] Listas curadas (curadoria manual)
- [ ] Collection de temas

### Engajamento
- [ ] Like/Favorite de textos
- [ ] Sharing em redes sociais
- [ ] Newsletter semanal
- [ ] Prêmios para autores (badges)
- [ ] Contests/desafios

---

## 📅 Fase 4: Advanced Features (Q4 2024)

### Serviços Premium
- [ ] Plano PRO para autores (limitações removidas)
- [ ] Boost de visibilidade
- [ ] Análise avançada de audiência
- [ ] Upload ilimitado

### Monetização Avançada
- [ ] Modelo de subscrição (leitura ilimitada)
- [ ] Royalties recorrentes
- [ ] Opção de preço dinâmico
- [ ] Sistema de afiliados

### Conteúdo
- [ ] Suporte a múltiplas línguas
- [ ] Audiobook integration
- [ ] EPUB export
- [ ] Page numbering (para PDF)

### Moderação
- [ ] Sistema de denúncias automático
- [ ] Detecção de plágio (Copyscape integration)
- [ ] Filtros de conteúdo
- [ ] Dashboard de admin

---

## 🎯 Etapas Posteriores (2025+)

### Mobile App
- [ ] App iOS
- [ ] App Android
- [ ] Sincronização cloud
- [ ] Offline reading

### Integrations
- [ ] Goodreads API
- [ ] LibbyDev
-OpenLibrary
- [ ] Print-on-demand (Amazon KDP)

### Marketplace Avançado
- [ ] Consultas/edição freelance
- [ ] Ghostwriting marketplace
- [ ] Beta readers network
- [ ] Literary agents integration

### AI/ML
- [ ] Recomendação automática
- [ ] Sugestões de tags
- [ ] Content moderation com IA
- [ ] Analyse de sentimento

---

## 🔄 Ciclos de Desenvolvimento

### Ciclo Típico (2 semanas)

```
Monday      → Planning + Standup
Wed         → Design Review
Fri         → Sprint Review + Retro
Mon (next)  → Deployment
```

### Quality Gates

- [ ] Code review (2 approvals)
- [ ] Tests passed (>80% coverage)
- [ ] No security issues (OWASP)
- [ ] Documentation updated
- [ ] Performance benchmarks passed

---

## 📊 Métricas de Sucesso (por fase)

### MVP
- [ ] 100+ usuários registrados
- [ ] 50+ textos publicados
- [ ] 10+ avaliações 5⭐

### Fase 2
- [ ] 10+ transações por semana
- [ ] Taxa de conversão >2%
- [ ] NPS >40

### Fase 3
- [ ] 1000+ usuários
- [ ] 500+ textos publicados
- [ ] Retenção mensal >30%

### Fase 4
- [ ] 5000+ usuários
- [ ] Revenue mensal >R$10k
- [ ] DAU >500

---

## 🤝 Contribuições Esperadas

### Procuramos por:

- **Developers Fullstack** (Node + React/Next)
- **UI/UX Designers** (Figma expertise)
- **DevOps Enginerrs** (Docker, Kubernetes)
- **Content Moderators** (Community managers)
- **Legal Advisors** (Copyright/LGPD)

### Como Contribuir

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit mudanças: `git commit -m 'feat: descrição'`
4. Push: `git push origin feature/minha-feature`
5. Abra Pull Request

---

## 🐛 Known Issues

### MVP
- [ ] Proteção anti-cópia não é 100% efetiva (por design web)
- [ ] Email pode demora em desenvolvimento local
- [ ] Watermark PDF precisa de melhor posicionamento

### Fase 2
- [ ] Webhook Stripe pode falhar em conexão lenta
- [ ] PDF generation pode ser lento para textos muito longos

---

## 💰 Modelo de Negócio (Planejado)

```
Receita = Comissões de Transações + Planos Premium + Publicidade (futuro)

Taxa de Comissão:
- Pagamento via Stripe: 30% (2,9% Stripe + 27,1% plataforma)
- Pagamento via PIX: 5% (transfer imediata)
- Doações: 0% (100% ao autor)

Plano Premium para Autores:
- R$9,90/mês → Sem anúncios + Analytics avançado
```

---

## 📞 Contato / Discussões

- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions
- **Email:** dev@recantodospoetas.com
- **Discord:** [Link TBD]

---

## 📄 Licença

Este projeto é licenciado sob MIT License.
Textos publicados na plataforma mantêm suas próprias licenças CC.

---

**Última atualização:** Feb 2024
**Próxima revisão:** May 2024
