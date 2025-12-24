# Actors

## System (Replacement for Admin)

- Automated processes for system summaries and public user directories.
- Handles account recovery via Encrypted Recovery Keys (Automated) to ensure privacy.

## User

- Full control over personal information and visibility settings.

- **Circle Visibility:** Information is only shared within "Circles" or with specifically invited individuals.

- **Role System:** Every shared entity must have one of: Owner, Admin, Editor, Visitor.

- **Circle Dissolution:** If an Owner leaves without a successor, the Circle is Dissolved.

  - **Recovery Logic:** Upon dissolution, the shared history is wiped for all members (Admin, Editor, Visitor). Only the Owner retains the ability to see or recover the historical data for their personal records.

# Features

## Auth & Security

- Signin/Signup/Logout via Passkeys or Secret Questions.

- **Recovery Key System:** Users generate a one-time key to regain access if locked out.

- **Tiered Lockout:** \* 5 failed attempts: 15-minute cooldown (customizable).

  - **Permanent Lock:** After 20 failed attempts, the account is locked. Unlockable only via physical Recovery Key.

## Finance

### Account

- Multi-account creation (Savings, Checking, Cash).

- **Account Types:** Fixed system types (e.g., Bank, Wallet, Credit).

- **Archiving Privacy:** Supports "Soft Delete" (Archived). Archived data is strictly restricted to the Owner. Even the Admin role loses access to archived history, ensuring the Owner has the final layer of privacy.

- **Audit Logs:** Full history of account modifications.

### Transaction

- **Manual-First Integrity:** Transactions are never automated. Users must manually confirm/input data via UI for maximum awareness.

- **Immutable Ledger:** All transactions are permanent or "Voided."

- **One-Entry Logic:** Simplified Income/Expense tracking where a single entry defines the flow of funds, ensuring the ledger stays balanced without complex multi-step forms.

### Tagging & Categories

- **Hybrid Categories:** System core categories + User-defined Custom Categories.

- **Modular Tag Groups:** Users customize tag groups for each specific module.

- **Module-Specific Search:** Search is scoped to the current module by default. A tag search for #Work in the Finance module will not show entries from the LifeLog module unless a "Global Search" is explicitly toggled.

### Savings & Business

- **\*Goal Tracking:** Set targets for savings accounts with progress visualization.

- **Receipt Generator:** Create receipts/invoices from transactions for business use.

### LifeLog & Capsule

- **Daily Logs:** Narrative entries with tags and mentions of other users.

- **Capsules:** Time-locked logs that trigger reminders for future-self reviews.

### Knowledge Base & Contacts

- **Knowledge Base:** Note-taking with link-saving and spaced-repetition reminders.

- **Contacts:** CRM-style contact list with personal preferences and custom tags.

### Micro Actions

- Task management with status (To-do, In Progress, Done).

- Can be personal or assigned to users within a shared circle.

### Travel Planner

- Integrated module to plan trips, budget, and split costs.

# Why This Integrated System?

Contextual Intelligence: By requiring manual entry but allowing tags to bridge different modules, the user builds a "Life Map." Scoped search ensures the user isn't overwhelmed by data, while Owner-only archiving ensures the most sensitive data remains under the highest level of control.

# Non-functional Requirements

- **Multi-User Ecosystem:** Deeply nested permissions based on "Circles."

- **Data Sovereignty:** The Owner is the ultimate authority. Dissolution and Archiving are "Owner-only" privileges to prevent administrative overreach.

- **Security:** Escalating penalties leading to Permanent Lock.

- **Total Data Expiry:** In line with the principle that "everything dies with the owner," the system does not support data inheritance. If an account remains in a Permanent Lock state or is inactive for a user-defined "Last Will" period without Recovery Key usage, the data is cryptographically purged.
