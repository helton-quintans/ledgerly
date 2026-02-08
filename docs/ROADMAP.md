# 📋 Roadmap

Future plans and upcoming features for Ledgerly.

## Version 1.0 (Current) ✅

- [x] User authentication (email/password)
- [x] Google OAuth integration
- [x] PostgreSQL database with Prisma
- [x] Basic dashboard layout
- [x] Module structure (Finance, Projects, Career, Health, AI)
- [x] Responsive design foundation
- [x] Production deployment on Vercel

---

## Version 1.1 (In Progress) 🚧

### Financial Management
- [ ] Transaction CRUD operations
- [ ] Category management
- [ ] Budget creation and tracking
- [ ] Financial overview dashboard
- [ ] Export transactions (CSV/PDF)

### User Experience
- [ ] Profile management
- [ ] Settings page
- [ ] Notifications system
- [ ] Toast notifications
- [ ] Loading states and skeletons
- [ ] PWA Support - Offline access, installable, push notifications

### Developer Experience
- [ ] Comprehensive test coverage
- [ ] Storybook for components
- [ ] API documentation
- [ ] E2E tests with Playwright

---

## Version 1.2 (Q2 2026) 📅

### Projects Module
- [ ] Create and manage projects
- [ ] Task tracking with status
- [ ] Project timeline/Gantt chart
- [ ] File attachments
- [ ] Project analytics

### Career Module
- [ ] Goal setting and tracking
- [ ] Skills assessment
- [ ] Career milestones
- [ ] Job applications tracker
- [ ] Resume builder

### Enhancements
- [ ] Dark mode improvements
- [ ] Mobile app (React Native)
- [ ] Offline support with PWA
- [ ] Real-time updates (WebSockets)

---

## Version 2.0 (Q3 2026) 🚀

### AI Integration
- [ ] Smart transaction categorization
- [ ] Budget recommendations
- [ ] Financial insights
- [ ] Natural language queries
- [ ] Automated reports

### Health & Wellness
- [ ] Activity logging
- [ ] Habit tracking
- [ ] Health metrics visualization
- [ ] Wellness goals
- [ ] Integration with fitness apps

### Analytics
- [ ] Advanced data visualization
- [ ] Custom reports builder
- [ ] Trends and predictions
- [ ] Comparative analysis
- [ ] Export dashboard as PDF

---

## Version 2.1 (Q4 2026) 🌟

### Collaboration
- [ ] Shared budgets (family accounts)
- [ ] Project collaboration
- [ ] Comments and notes
- [ ] Activity feed
- [ ] User roles and permissions

### Integrations
- [ ] Bank account sync (Plaid)
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Slack/Discord webhooks
- [ ] API for third-party apps

### Internationalization
- [ ] Multi-language support
- [ ] Currency conversion
- [ ] Timezone handling
- [ ] Localized date formats

---

## Future Considerations 💭

### Enterprise Features
- [ ] Multi-tenant support
- [ ] SSO/SAML authentication
- [ ] Advanced security controls
- [ ] Audit logs
- [ ] White-label options

### Advanced Features
- [ ] Blockchain integration for financial records
- [ ] Machine learning for predictions
- [ ] Voice commands
- [ ] Augmented reality data visualization
- [ ] Smart contracts for goals

### Platform Expansion
- [ ] Desktop app (Electron)
- [ ] Browser extension
- [ ] Apple Watch app
- [ ] Smart home integration
- [ ] Wearable device sync

---

## Community Requests 💬

Vote on features you'd like to see:

1. **Recurring Transactions** - Automatic scheduling
2. **Multi-Currency Support** - Handle multiple currencies
3. **Investment Tracking** - Stocks, crypto, real estate
4. **Bill Reminders** - Never miss a payment
5. **Receipt Scanner** - OCR for paper receipts

---

## How to Contribute

Want to help build these features?

1. Check [Contributing Guidelines](CONTRIBUTING.md)
2. Pick an item from the roadmap
3. Open an issue to discuss implementation
4. Submit a pull request

---

## Feedback

Have ideas for new features? 

- Open a [GitHub Discussion](https://github.com/helton-quintans/ledgerly/discussions)
- Create a [Feature Request](https://github.com/helton-quintans/ledgerly/issues/new?template=feature_request.md)
- Contact us directly

---

**Last Updated:** January 2026

*This roadmap is subject to change based on user feedback and priorities.*

---

# Épico: MVP – Gestão de Vida com 3 Pilares + Ficha de Produtividade Alfa

Objetivo
Lançar um aplicativo que permite ao usuário acompanhar sua evolução em Carreira, Finanças e Saúde & Bem-estar, além de registrar diariamente sua Ficha de Produtividade Alfa (FPA), conectando ações e metas pessoais.

1. Pilares do App

Carreira
Registro de metas profissionais (ex: concluir curso, entregar projeto, receber promoção).
Registro de conquistas e eventos relevantes.
Visualização de progresso: barra de metas, gráfico de evolução, contador de conquistas.
Possibilidade de adicionar novas metas/conquistas manualmente.

Finanças
Registro manual de receitas e despesas.
Categorização dos gastos (ex: alimentação, lazer, contas).
Visualização de distribuição (gráfico de pizza), evolução mensal (barras/linha), saldo atual.
Possibilidade de adicionar transações manualmente.

Saúde & Bem-estar
Registro de hábitos (ex: exercícios, sono, consultas, meditação).
Visualização de hábitos cumpridos (barra de progresso), radar de hábitos, evolução ao longo do tempo.
Possibilidade de adicionar eventos/hábitos manualmente.

2. Ficha de Produtividade Alfa (FPA)

Funcionalidades
Usuário preenche a ficha diariamente (idealmente à noite, para o dia seguinte).
Campos:
Foco do dia (texto curto, até 400 caracteres)
Prioridades do dia (até 10 itens)
Extras (tarefas corriqueiras, até 20 itens)
Para evitar no dia (texto breve, até 400 caracteres)
Solução para evitar (texto breve, até 400 caracteres)
Como foi meu dia? (nota de 0 a 10)
O que aprendi hoje? (até 400 caracteres)
Hoje tenho gratidão por? (até 400 caracteres)
Todos os campos de texto possuem limitação de 400 caracteres.
FPA conectada aos objetivos/metas do usuário (ex: prioridades podem ser metas dos pilares).
Contador de fichas feitas (desde sempre e no mês corrente).
Visualização das fichas do mês corrente (lista simples).
Possibilidade de ver a quantidade de fichas feitas no ano (gráfico estilo commits do GitHub – melhoria futura).
Animação ou destaque motivacional ao preencher a ficha.

Localização no App
Novo menu na sidebar: “Produtividade Alfa”
Tela dedicada para preencher a ficha do dia e visualizar fichas recentes.
Contador visível na tela e/ou dashboard.

3. MVP – O que será entregue

Onboarding apresentando os 3 pilares e a FPA.
Dashboard na home com gráficos animados (shadcn/ui) para cada pilar.
Registro manual de metas, transações e hábitos.
Visualização de progresso (gráficos, barras, contadores).
Módulo FPA com preenchimento diário, contador e visualização das fichas do mês.
Sidebar com menu para cada pilar e para a FPA.
Autenticação (login/cadastro).
Layout responsivo e usável.

4. Melhorias Futuras

Gráfico anual estilo commits do GitHub para FPA.
Relatórios avançados, notificações, integração bancária, gamificação.
Visualização de fichas antigas (opcional).

---
