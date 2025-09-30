## Project Feature Checklist

Legend: [x] complete · [~] partial · [ ] not started

### AI & ML
- [~] On-device ML inference (TensorFlow Lite bindings, real models)
- [~] Federated learning/training pipelines (server and client coordination)
- [~] AI Image/Video analysis APIs (mocked inference; needs real models + persistence)

### Coaching
- [~] Session lifecycle endpoints (start, end, log events)
- [x] AI Coach chat (streaming via Abacus AI)

### Media Vault
- [x] Private vault (passcode, unlock cookie, upload/list/delete)
- [ ] At-rest encryption for files and stronger unlock/auth

### Subscriptions & Billing
- [x] Stripe checkout session creation
- [x] Stripe webhook handling and subscription tier updates
- [ ] Consolidate env vars and one checkout path
- [ ] Subscription dashboard client completion

### Privacy & Compliance
- [x] Data export/erasure endpoints
- [x] Consent logs and policy acknowledgments
- [ ] Biometric auth integration (platform-specific)
- [ ] True E2E encryption for sensitive data

### RBAC & Access Control
- [x] API-level gating by subscription tier
- [ ] UI gating for premium-only sections

### Account Management
- [~] Email verification flow
- [~] Password reset and recovery

### Content & Education
- [~] UI for positions, quizzes, education, goals, calendar, cycle tracker
- [ ] Backing APIs and persistence for content modules

### Notifications & Feedback
- [ ] Notification delivery system and UI
- [ ] Feedback submission APIs and moderation workflow

### Observability & QA
- [x] Health check endpoint and basic logging
- [ ] Automated tests (unit/integration/e2e)

### Environment & Tooling
- [ ] Remove duplicate Stripe endpoints and unify env names
- [ ] README updates as features land

### Priorities (Next Up)
1) Coaching session lifecycle
2) Stripe webhook + subscription client
3) AI training endpoints (mocked) to stabilize dashboard
4) Persist analysis audit records
