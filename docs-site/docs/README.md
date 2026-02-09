<pre>
docs/
├── README.md
│   - How to navigate the docs
│   - Doc conventions (domain-first, text > diagrams)
│
├── overview/
│   ├── requirements.md
│   │   - Product requirements, scope, non-goals
│   │
│   ├── system-planning.md
│   │   - Milestones, module roadmap, dependencies
│   │
│   └── glossary.md
│       - Definitions of project terms (session, circle, sudo mode, etc.)
│
├── architecture/
│   ├── system-overview.md
│   │   - High-level system description and boundaries
│   │
│   ├── backend-architecture.md
│   │   - Backend layering, module boundaries, shared libraries
│   │
│   └── database-architecture.md
│       - Cross-domain DB rules, migrations, naming conventions
│
├── platform/
│   ├── overview.md
│   │   - What counts as platform (global services)
│   │   - What must NOT go into domains
│   │
│   ├── audit-logging.md
│   │   - audit_logs usage, when to log, examples
│   │
│   └── rate-limiting.md
│       - Global rate limit rules and lockout policies
│
├── domains/
│   ├── auth/
│   │   ├── overview.md
│   │   │   - What auth is responsible for
│   │   │   - Dependencies on platform services
│   │   │
│   │   ├── authentication-model.md
│   │   │   - End-to-end auth flow (signup, login, refresh, logout)
│   │   │   - Security invariants (CSRF, rotation, revocation)
│   │   │
│   │   ├── endpoints.md
│   │   │   - /login, /register, /refresh, /logout contracts
│   │   │
│   │   ├── services.md
│   │   │   - AuthService, SessionService, TokenService responsibilities
│   │   │
│   │   └── database.md
│   │       - users, auth_sessions, auth_credentials tables
│
│   └── accounts/
│       ├── overview.md
│       │   - What an account is, ownership rules
│       │
│       ├── endpoints.md
│       │   - create/update/archive account endpoints
│       │
│       ├── services.md
│       │   - AccountService logic, audit hooks
│       │
│       └── database.md
│           - accounts, account_audit_logs tables
│
└── setup/
    ├── local-dev.md
    │   - How to run locally
    │
    └── docker-postgres.md
        - Docker + Postgres setup
</pre>