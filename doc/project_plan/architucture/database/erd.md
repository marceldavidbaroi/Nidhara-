## **1️⃣ Core Identity & Security Module ERD**

```mermaid
erDiagram
    %% USERS
    users {
        UUID id PK
        TEXT email
        TEXT display_name
        ENUM status
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    %% AUTH_CREDENTIALS
    auth_credentials {
        UUID id PK
        UUID user_id FK
        ENUM type
        TEXT secret_hash
        JSONB metadata
        TIMESTAMP created_at
    }

    %% AUTH_SESSIONS
    auth_sessions {
        UUID id PK
        UUID user_id FK
        TEXT ip_address
        TEXT user_agent
        TIMESTAMP expires_at
        TIMESTAMP created_at
    }

    %% SECURITY_EVENTS
    security_events {
        UUID id PK
        UUID user_id
        ENUM type
        JSONB metadata
        TIMESTAMP created_at
    }

    %% RECOVERY_KEYS
    recovery_keys {
        UUID id PK
        UUID user_id FK
        TEXT key_hash
        TIMESTAMP used_at
        TIMESTAMP created_at
    }

    %% Relationships
    users ||--o{ auth_credentials : has
    users ||--o{ auth_sessions : has
    users ||--o{ recovery_keys : has
    users ||--o{ security_events : generates
```

---

## **2️⃣ Circle & Permissions Module ERD**

```mermaid
erDiagram
    %% CIRCLES
    circles {
        UUID id PK
        TEXT name
        UUID owner_id FK
        ENUM status
        TIMESTAMP created_at
    }

    %% CIRCLE_MEMBERS
    circle_members {
        UUID id PK
        UUID circle_id FK
        UUID user_id FK
        ENUM role
        TIMESTAMP joined_at
    }

    %% CIRCLE_EVENTS
    circle_events {
        UUID id PK
        UUID circle_id
        ENUM type
        JSONB payload
        TIMESTAMP created_at
    }

    %% PERMISSION_POLICIES
    permission_policies {
        UUID id PK
        ENUM role
        TEXT resource
        TEXT action
        BOOLEAN allowed
    }

    %% PERMISSION_LOGS
    permission_logs {
        UUID id PK
        UUID policy_id FK
        UUID changed_by
        JSONB old_value
        JSONB new_value
        TIMESTAMP created_at
    }

    %% Relationships
    circles ||--o{ circle_members : has
    circles ||--o{ circle_events : has
    users ||--o{ circle_members : belongs_to
    permission_policies ||--o{ permission_logs : has
```

---

## **3️⃣ Finance Module ERD**

```mermaid
erDiagram
    %% ACCOUNTS
    accounts {
        UUID id PK
        UUID circle_id FK
        UUID owner_id FK
        ENUM type
        TEXT name
        TIMESTAMP archived_at
        TIMESTAMP created_at
    }

    %% ACCOUNT_AUDIT_LOGS
    account_audit_logs {
        UUID id PK
        UUID account_id
        TEXT action
        JSONB metadata
        TIMESTAMP created_at
    }

    %% TRANSACTIONS
    transactions {
        UUID id PK
        UUID account_id FK
        NUMERIC amount
        ENUM direction
        ENUM status
        UUID category_id
        UUID created_by
        TIMESTAMP created_at
    }

    %% TRANSACTION_RECEIPTS
    transaction_receipts {
        UUID id PK
        UUID transaction_id
        TEXT document_url
        TIMESTAMP created_at
    }

    %% TRANSACTION_LOGS
    transaction_logs {
        UUID id PK
        UUID transaction_id FK
        ENUM old_status
        ENUM new_status
        UUID changed_by
        TIMESTAMP created_at
    }

    %% CATEGORIES
    categories {
        UUID id PK
        ENUM module
        TEXT name
        BOOLEAN system_defined
    }

    %% TAGS
    tags {
        UUID id PK
        TEXT name
        TEXT module
    }

    %% TAG_RELATIONS
    tag_relations {
        UUID tag_id
        UUID entity_id
        TEXT entity_type
    }

    %% Relationships
    accounts ||--o{ transactions : has
    accounts ||--o{ account_audit_logs : has
    transactions ||--o{ transaction_receipts : has
    transactions ||--o{ transaction_logs : has
    categories ||--o{ transactions : categorizes
    tags ||--o{ tag_relations : relates_to
```

---

### **4.1️⃣ Lifelog Module**

```mermaid
erDiagram
    %% LIFELOGS
    lifelogs {
        UUID id PK
        UUID circle_id
        UUID author_id
        TEXT content
        TIMESTAMP created_at
    }

    %% CAPSULES
    capsules {
        UUID id PK
        UUID lifelog_id FK
        TIMESTAMP unlock_at
        TIMESTAMP unlocked_at
    }

    %% LIFELOG_LOGS
    lifelog_logs {
        UUID id PK
        UUID lifelog_id FK
        TEXT old_content
        TEXT new_content
        UUID updated_by
        TIMESTAMP created_at
    }

    lifelogs ||--o{ capsules : has
    lifelogs ||--o{ lifelog_logs : logs
```

---

### **4.2️⃣ Task Module**

```mermaid
erDiagram
    %% TASKS
    tasks {
        UUID id PK
        UUID circle_id
        UUID creator_id
        TEXT title
        ENUM status
        TIMESTAMP created_at
    }

    %% TASK_ASSIGNMENTS
    task_assignments {
        UUID task_id FK
        UUID user_id FK
    }

    %% TASK_LOGS
    task_logs {
        UUID id PK
        UUID task_id FK
        ENUM old_status
        ENUM new_status
        UUID updated_by
        TIMESTAMP created_at
    }

    tasks ||--o{ task_assignments : assigns
    tasks ||--o{ task_logs : logs
```

---

### **4.3️⃣ Notes Module**

```mermaid
erDiagram
    %% NOTES
    notes {
        UUID id PK
        UUID owner_id
        UUID circle_id
        TEXT content
        TIMESTAMP created_at
    }

    %% NOTE_REMINDERS
    note_reminders {
        UUID id PK
        UUID note_id FK
        TIMESTAMP remind_at
    }

    %% NOTE_LOGS
    note_logs {
        UUID id PK
        UUID note_id FK
        TEXT old_content
        TEXT new_content
        UUID updated_by
        TIMESTAMP created_at
    }

    notes ||--o{ note_reminders : has
    notes ||--o{ note_logs : logs
```

---

### **4.4️⃣ Contacts Module**

```mermaid
erDiagram
    %% CONTACTS
    contacts {
        UUID id PK
        UUID owner_id
        TEXT name
        JSONB metadata
        TIMESTAMP created_at
    }

    %% CONTACT_LOGS
    contact_logs {
        UUID id PK
        UUID contact_id FK
        JSONB old_value
        JSONB new_value
        UUID updated_by
        TIMESTAMP created_at
    }

    contacts ||--o{ contact_logs : logs
```

---

### **4.5️⃣ Travel Module**

```mermaid
erDiagram
    %% TRIPS
    trips {
        UUID id PK
        UUID circle_id
        UUID owner_id
        TEXT title
        DATE start_date
        DATE end_date
    }

    %% TRIP_BUDGETS
    trip_budgets {
        UUID id PK
        UUID trip_id FK
        NUMERIC amount
    }

    %% TRIP_LOGS
    trip_logs {
        UUID id PK
        UUID trip_id FK
        JSONB old_value
        JSONB new_value
        UUID updated_by
        TIMESTAMP created_at
    }

    trips ||--o{ trip_budgets : has
    trips ||--o{ trip_logs : logs
```

---

## **5️⃣ Cross-Cutting Infrastructure ERD**

```mermaid
erDiagram
    %% AUDIT_LOGS
    audit_logs {
        UUID id PK
        UUID actor_id
        TEXT entity_type
        UUID entity_id
        TEXT action
        TIMESTAMP created_at
    }

    %% SEARCH_INDEX
    search_index {
        TEXT entity_type
        UUID entity_id
        TSVECTOR searchable_text
    }
```

---

## ✅ Full App ERD (Condensed Relationships)

You can combine all the above modules into **one big ERD**, showing FK relationships across modules. For readability, I recommend using the **module-specific ERDs** for design discussions, but the **full ERD** could be merged like this:

```mermaid
erDiagram
    users ||--o{ auth_credentials : has
    users ||--o{ auth_sessions : has
    users ||--o{ recovery_keys : has
    users ||--o{ security_events : generates
    users ||--o{ circle_members : belongs_to
    users ||--o{ accounts : owns
    users ||--o{ tasks : created_by
    users ||--o{ lifelogs : authored
    users ||--o{ notes : owns
    users ||--o{ contacts : owns
    users ||--o{ trips : owns
    circles ||--o{ circle_members : has
    circles ||--o{ circle_events : has
    circles ||--o{ accounts : has
    circles ||--o{ tasks : has
    circles ||--o{ lifelogs : has
    circles ||--o{ notes : has
    circles ||--o{ trips : has
    accounts ||--o{ transactions : has
    accounts ||--o{ account_audit_logs : has
    transactions ||--o{ transaction_receipts : has
    transactions ||--o{ transaction_logs : has
    categories ||--o{ transactions : categorizes
    tags ||--o{ tag_relations : relates_to
    lifelogs ||--o{ capsules : has
    lifelogs ||--o{ lifelog_logs : logs
    tasks ||--o{ task_assignments : assigns
    tasks ||--o{ task_logs : logs
    notes ||--o{ note_reminders : has
    notes ||--o{ note_logs : logs
    contacts ||--o{ contact_logs : logs
    trips ||--o{ trip_budgets : has
    trips ||--o{ trip_logs : logs
    permission_policies ||--o{ permission_logs : has
```

---

I can also **generate a fully detailed “all-in-one” Mermaid ERD with all column names visible** in one diagram, but it will be very large.

Do you want me to do that next?
