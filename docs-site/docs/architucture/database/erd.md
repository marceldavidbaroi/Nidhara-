Perfect! We can split your large ERD **module by module** so it’s easier to visualize. I’ll create separate Mermaid diagrams for each major module, keeping relationships **within the module**.

---

## 🔐 **Core Identity & Security (Auth + Recovery + Security)**

```mermaid
erDiagram
    USERS ||--o{ AUTH_CREDENTIALS : has
    USERS ||--o{ AUTH_SESSIONS : has
    USERS ||--o{ SECURITY_EVENTS : generates
    USERS ||--o{ RECOVERY_KEYS : has
    USERS ||--o{ SUDO_SESSIONS : has
    USERS ||--o{ USER_ACCOUNT_SECURITY_STATE : has

    AUTH_CREDENTIALS {
        BIGSERIAL id
        BIGSERIAL user_id
        TEXT type
        TEXT secret_hash
        JSONB metadata
        TIMESTAMP created_at
    }

    AUTH_SESSIONS {
        BIGSERIAL id
        BIGSERIAL user_id
        TEXT refresh_token_hash
        TEXT ip_address
        TEXT user_agent
        TEXT device_name
        TIMESTAMP expires_at
        TIMESTAMP revoked_at
        TIMESTAMP created_at
    }

    SECURITY_EVENTS {
        BIGSERIAL id
        BIGSERIAL user_id
        TEXT type
        JSONB metadata
        TIMESTAMP created_at
    }

    RECOVERY_KEYS {
        BIGSERIAL id
        BIGSERIAL user_id
        TEXT key_hash
        TIMESTAMP used_at
        TIMESTAMP created_at
    }

    SUDO_SESSIONS {
        BIGSERIAL user_id
        TEXT method
        TIMESTAMP sudo_until
        TEXT ip_address
        TEXT user_agent
        TIMESTAMP created_at
    }

    USER_ACCOUNT_SECURITY_STATE {
        BIGSERIAL user_id
        INT failed_attempts
        TIMESTAMP cooldown_until
        BOOLEAN permanently_locked
        TIMESTAMP last_failed_at
        TIMESTAMP updated_at
    }
```

---

## 👤 **User & Ownership (Users, Circles, Permissions)**

```mermaid
erDiagram
    USERS ||--o{ CIRCLES : owns
    CIRCLES ||--o{ CIRCLE_MEMBERS : has
    CIRCLES ||--o{ CIRCLE_EVENTS : logs
    PERMISSION_POLICIES ||--o{ PERMISSION_LOGS : logs

    CIRCLES {
        BIGSERIAL id
        TEXT name
        BIGSERIAL owner_id
        TEXT status
        TIMESTAMP created_at
    }

    CIRCLE_MEMBERS {
        BIGSERIAL id
        BIGSERIAL circle_id
        BIGSERIAL user_id
        TEXT role
        TIMESTAMP joined_at
    }

    CIRCLE_EVENTS {
        BIGSERIAL id
        BIGSERIAL circle_id
        TEXT type
        JSONB payload
        TIMESTAMP created_at
    }

    PERMISSION_POLICIES {
        BIGSERIAL id
        TEXT role
        TEXT resource
        TEXT action
        BOOLEAN allowed
    }

    PERMISSION_LOGS {
        BIGSERIAL id
        BIGSERIAL policy_id
        BIGSERIAL changed_by
        JSONB old_value
        JSONB new_value
        TIMESTAMP created_at
    }
```

---

## 💰 **Finance System (Accounts, Transactions, Categories & Tags)**

```mermaid
erDiagram
    CIRCLES ||--o{ ACCOUNTS : has
    ACCOUNTS ||--o{ TRANSACTIONS : has
    TRANSACTIONS ||--o{ TRANSACTION_RECEIPTS : has
    TRANSACTIONS ||--o{ TRANSACTION_LOGS : logs
    CATEGORIES ||--o{ TAG_RELATIONS : has
    TAGS ||--o{ TAG_RELATIONS : has

    ACCOUNTS {
        BIGSERIAL id
        BIGSERIAL circle_id
        BIGSERIAL owner_id
        TEXT type
        TEXT name
        TIMESTAMP archived_at
        TIMESTAMP created_at
    }

    TRANSACTIONS {
        BIGSERIAL id
        BIGSERIAL account_id
        NUMERIC amount
        TEXT direction
        TEXT status
        BIGSERIAL category_id
        BIGSERIAL created_by
        TIMESTAMP created_at
    }

    TRANSACTION_RECEIPTS {
        BIGSERIAL id
        BIGSERIAL transaction_id
        TEXT document_url
        TIMESTAMP created_at
    }

    TRANSACTION_LOGS {
        BIGSERIAL id
        BIGSERIAL transaction_id
        TEXT old_status
        TEXT new_status
        BIGSERIAL changed_by
        TIMESTAMP created_at
    }

    CATEGORIES {
        BIGSERIAL id
        TEXT module
        TEXT name
        BOOLEAN system_defined
    }

    TAGS {
        BIGSERIAL id
        TEXT name
        TEXT module
    }

    TAG_RELATIONS {
        BIGSERIAL tag_id
        BIGSERIAL entity_id
        TEXT entity_type
    }
```

---

## 🧬 **Life Systems (LifeLogs, Tasks, Notes, Contacts, Travel)**

```mermaid
erDiagram
    CIRCLES ||--o{ LIFELOGS : has
    LIFELOGS ||--o{ CAPSULES : has
    LIFELOGS ||--o{ LIFELOG_LOGS : logs
    CIRCLES ||--o{ TASKS : has
    TASKS ||--o{ TASK_ASSIGNMENTS : has
    TASKS ||--o{ TASK_LOGS : logs
    CIRCLES ||--o{ NOTES : has
    NOTES ||--o{ NOTE_REMINDERS : has
    NOTES ||--o{ NOTE_LOGS : logs
    CIRCLES ||--o{ CONTACTS : has
    CONTACTS ||--o{ CONTACT_LOGS : logs
    CIRCLES ||--o{ TRIPS : has
    TRIPS ||--o{ TRIP_BUDGETS : has
    TRIPS ||--o{ TRIP_LOGS : logs

    LIFELOGS {
        BIGSERIAL id
        BIGSERIAL circle_id
        BIGSERIAL author_id
        TEXT content
        TIMESTAMP created_at
    }

    CAPSULES {
        BIGSERIAL id
        BIGSERIAL lifelog_id
        TIMESTAMP unlock_at
        TIMESTAMP unlocked_at
    }

    LIFELOG_LOGS {
        BIGSERIAL id
        BIGSERIAL lifelog_id
        TEXT old_content
        TEXT new_content
        BIGSERIAL updated_by
        TIMESTAMP created_at
    }

    TASKS {
        BIGSERIAL id
        BIGSERIAL circle_id
        BIGSERIAL creator_id
        TEXT title
        TEXT status
        TIMESTAMP created_at
    }

    TASK_ASSIGNMENTS {
        BIGSERIAL task_id
        BIGSERIAL user_id
    }

    TASK_LOGS {
        BIGSERIAL id
        BIGSERIAL task_id
        TEXT old_status
        TEXT new_status
        BIGSERIAL updated_by
        TIMESTAMP created_at
    }

    NOTES {
        BIGSERIAL id
        BIGSERIAL owner_id
        BIGSERIAL circle_id
        TEXT content
        TIMESTAMP created_at
    }

    NOTE_REMINDERS {
        BIGSERIAL id
        BIGSERIAL note_id
        TIMESTAMP remind_at
    }

    NOTE_LOGS {
        BIGSERIAL id
        BIGSERIAL note_id
        TEXT old_content
        TEXT new_content
        BIGSERIAL updated_by
        TIMESTAMP created_at
    }

    CONTACTS {
        BIGSERIAL id
        BIGSERIAL owner_id
        TEXT name
        JSONB metadata
        TIMESTAMP created_at
    }

    CONTACT_LOGS {
        BIGSERIAL id
        BIGSERIAL contact_id
        JSONB old_value
        JSONB new_value
        BIGSERIAL updated_by
        TIMESTAMP created_at
    }

    TRIPS {
        BIGSERIAL id
        BIGSERIAL circle_id
        BIGSERIAL owner_id
        TEXT title
        DATE start_date
        DATE end_date
    }

    TRIP_BUDGETS {
        BIGSERIAL id
        BIGSERIAL trip_id
        NUMERIC amount
    }

    TRIP_LOGS {
        BIGSERIAL id
        BIGSERIAL trip_id
        JSONB old_value
        JSONB new_value
        BIGSERIAL updated_by
        TIMESTAMP created_at
    }
```

---

## 🔍 **Cross-Cutting Modules (Audit & Search)**

```mermaid
erDiagram
    AUDIT_LOGS {
        BIGSERIAL id
        BIGSERIAL actor_id
        TEXT entity_type
        BIGSERIAL entity_id
        TEXT action
        TIMESTAMP created_at
    }

    SEARCH_INDEX {
        TEXT entity_type
        BIGSERIAL entity_id
        TEXT searchable_text
    }
```

---
