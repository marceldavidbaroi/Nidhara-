# **Database Schema Grouped by Modules**

---

## 🔐 **Core Identity & Security (Highest Priority)**

### **AuthModule**

- `users`

```sql
users (
  id BIGSERIAL PK,

  username TEXT UNIQUE,
  email TEXT UNIQUE,

  display_name TEXT,

  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

```

- `auth_credentials`

```sql
auth_credentials (
  id BIGSERIAL PK,
  user_id BIGSERIAL FK(users.id),

  type ENUM('PASSWORD','PASSKEY','SECRET_QUESTION'),
  secret_hash TEXT,
  metadata JSONB,

  created_at TIMESTAMP
)

```

- `auth_sessions`

```sql
auth_sessions (
  id BIGSERIAL PK,
  user_id BIGSERIAL FK(users.id),

  refresh_token_hash TEXT,
  csrf_token TEXT,
  ip_address TEXT,
  user_agent TEXT,
  device_name TEXT,

  expires_at TIMESTAMP,
  revoked_at TIMESTAMP NULL,

  created_at TIMESTAMP
)


```

- `security_events` (Auth-specific log)

```sql
security_events (
  id BIGSERIAL PK,
  user_id BIGSERIAL,

  type ENUM(
    'LOGIN_SUCCESS',
    'LOGIN_FAILED',
    'LOGOUT',
    'REFRESH_ROTATED',
    'ACCOUNT_LOCKED',
    'ACCOUNT_UNLOCKED',
    'PASSWORD_CHANGED',
    'RECOVERY_KEY_USED',
    'RECOVERY_KEY_REGENERATED',
    'SUDO_MODE_ENABLED'
  ),

  metadata JSONB,
  created_at TIMESTAMP
)

```

- `user_account_security_state`

```sql
user_account_security_state (
  user_id BIGSERIAL PK FK(users.id),

  failed_attempts INT DEFAULT 0,
  cooldown_until TIMESTAMP NULL,
  permanently_locked BOOLEAN DEFAULT FALSE,
  last_failed_at TIMESTAMP NULL,

  updated_at TIMESTAMP
)

```

- `sudo_sessions`

```sql
sudo_sessions (
  user_id BIGSERIAL PK FK(users.id),

  sudo_until TIMESTAMP,
  method ENUM('PASSWORD','RECOVERY_KEY','MFA'),

  ip_address TEXT,
  user_agent TEXT,

  created_at TIMESTAMP
)


```

---

### **RecoveryModule**

- `recovery_keys`

```sql
recovery_keys (
  id BIGSERIAL PK,
  user_id BIGSERIAL FK(users.id),

  key_hash TEXT,
  used_at TIMESTAMP NULL,

  created_at TIMESTAMP
)

```
```sql
security_questions (
  id BIGSERIAL PK,
  user_id BIGSERIAL FK(users.id) NOT NULL,
  question TEXT NOT NULL,
  answer_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
)
```
---

### **SecurityModule**

- No additional tables yet, relies on `security_events` for logs.

---

## 👤 **User & Ownership**

### **UserModule**

- Already uses `users` table.

### **CircleModule**

- `circles`

```sql
circles (
  id BIGSERIAL PK,
  name TEXT,
  owner_id BIGSERIAL FK(users.id),
  status ENUM('ACTIVE','DISSOLVED'),
  created_at TIMESTAMP
)
```

- `circle_members`

```sql
circle_members (
  id BIGSERIAL PK,
  circle_id BIGSERIAL FK(circles.id),
  user_id BIGSERIAL FK(users.id),
  role ENUM('OWNER','ADMIN','EDITOR','VISITOR'),
  joined_at TIMESTAMP
)
```

- `circle_events` (Module log)

```sql
circle_events (
  id BIGSERIAL PK,
  circle_id BIGSERIAL,
  type ENUM('DISSOLVED','OWNER_TRANSFERRED','MEMBER_ADDED','MEMBER_REMOVED'),
  payload JSONB,
  created_at TIMESTAMP
)
```

### **PermissionModule**

- `permission_policies`

```sql
permission_policies (
  id BIGSERIAL PK,
  role ENUM('OWNER','ADMIN','EDITOR','VISITOR'),
  resource TEXT,
  action TEXT,
  allowed BOOLEAN
)
```

- `permission_logs` (Optional module-specific log)

```sql
permission_logs (
  id BIGSERIAL PK,
  policy_id BIGSERIAL FK(permission_policies.id),
  changed_by BIGSERIAL,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMP
)
```

---

## 💰 **Finance System**

### **AccountModule**

- `accounts`

```sql
accounts (
  id BIGSERIAL PK,
  circle_id BIGSERIAL FK(circles.id),
  owner_id BIGSERIAL FK(users.id),
  type ENUM('BANK','WALLET','CREDIT'),
  name TEXT,
  archived_at TIMESTAMP,
  created_at TIMESTAMP
)
```

- `account_audit_logs` (Module-specific log)

```sql
account_audit_logs (
  id BIGSERIAL PK,
  account_id BIGSERIAL,
  action TEXT,
  metadata JSONB,
  created_at TIMESTAMP
)
```

### **TransactionModule**

- `transactions`

```sql
transactions (
  id BIGSERIAL PK,
  account_id BIGSERIAL FK(accounts.id),
  amount NUMERIC,
  direction ENUM('IN','OUT'),
  status ENUM('POSTED','VOIDED'),
  category_id BIGSERIAL,
  created_by BIGSERIAL,
  created_at TIMESTAMP
)
```

- `transaction_receipts`

```sql
transaction_receipts (
  id BIGSERIAL PK,
  transaction_id BIGSERIAL,
  document_url TEXT,
  created_at TIMESTAMP
)
```

- `transaction_logs` (Optional module-specific log)

```sql
transaction_logs (
  id BIGSERIAL PK,
  transaction_id BIGSERIAL FK(transactions.id),
  old_status ENUM('POSTED','VOIDED'),
  new_status ENUM('POSTED','VOIDED'),
  changed_by BIGSERIAL,
  created_at TIMESTAMP
)
```

### **CategoryTagModule**

- `categories`

```sql
categories (
  id BIGSERIAL PK,
  module ENUM('FINANCE','LIFELOG','KNOWLEDGE'),
  name TEXT,
  system_defined BOOLEAN
)
```

- `tags`

```sql
tags (
  id BIGSERIAL PK,
  name TEXT,
  module TEXT
)
```

- `tag_relations`

```sql
tag_relations (
  tag_id BIGSERIAL,
  entity_id BIGSERIAL,
  entity_type TEXT
)
```

---

## 🧬 **Life Systems**

### **LifeLogModule**

- `lifelogs`

```sql
lifelogs (
  id BIGSERIAL PK,
  circle_id BIGSERIAL,
  author_id BIGSERIAL,
  content TEXT,
  created_at TIMESTAMP
)
```

- `capsules`

```sql
capsules (
  id BIGSERIAL PK,
  lifelog_id BIGSERIAL,
  unlock_at TIMESTAMP,
  unlocked_at TIMESTAMP
)
```

- `lifelog_logs` (Optional module log)

```sql
lifelog_logs (
  id BIGSERIAL PK,
  lifelog_id BIGSERIAL FK(lifelogs.id),
  old_content TEXT,
  new_content TEXT,
  updated_by BIGSERIAL,
  created_at TIMESTAMP
)
```

### **TaskModule**

- `tasks`

```sql
tasks (
  id BIGSERIAL PK,
  circle_id BIGSERIAL,
  creator_id BIGSERIAL,
  title TEXT,
  status ENUM('TODO','IN_PROGRESS','DONE'),
  created_at TIMESTAMP
)
```

- `task_assignments`

```sql
task_assignments (
  task_id BIGSERIAL,
  user_id BIGSERIAL
)
```

- `task_logs` (Optional module log)

```sql
task_logs (
  id BIGSERIAL PK,
  task_id BIGSERIAL FK(tasks.id),
  old_status ENUM('TODO','IN_PROGRESS','DONE'),
  new_status ENUM('TODO','IN_PROGRESS','DONE'),
  updated_by BIGSERIAL,
  created_at TIMESTAMP
)
```

### **KnowledgeBaseModule**

- `notes`

```sql
notes (
  id BIGSERIAL PK,
  owner_id BIGSERIAL,
  circle_id BIGSERIAL,
  content TEXT,
  created_at TIMESTAMP
)
```

- `note_reminders`

```sql
note_reminders (
  id BIGSERIAL PK,
  note_id BIGSERIAL,
  remind_at TIMESTAMP
)
```

- `note_logs` (Optional module log)

```sql
note_logs (
  id BIGSERIAL PK,
  note_id BIGSERIAL FK(notes.id),
  old_content TEXT,
  new_content TEXT,
  updated_by BIGSERIAL,
  created_at TIMESTAMP
)
```

### **ContactModule**

- `contacts`

```sql
contacts (
  id BIGSERIAL PK,
  owner_id BIGSERIAL,
  name TEXT,
  metadata JSONB,
  created_at TIMESTAMP
)
```

- `contact_logs` (Optional module log)

```sql
contact_logs (
  id BIGSERIAL PK,
  contact_id BIGSERIAL FK(contacts.id),
  old_value JSONB,
  new_value JSONB,
  updated_by BIGSERIAL,
  created_at TIMESTAMP
)
```

### **TravelModule**

- `trips`

```sql
trips (
  id BIGSERIAL PK,
  circle_id BIGSERIAL,
  owner_id BIGSERIAL,
  title TEXT,
  start_date DATE,
  end_date DATE
)
```

- `trip_budgets`

```sql
trip_budgets (
  id BIGSERIAL PK,
  trip_id BIGSERIAL,
  amount NUMERIC
)
```

- `trip_logs` (Optional module log)

```sql
trip_logs (
  id BIGSERIAL PK,
  trip_id BIGSERIAL FK(trips.id),
  old_value JSONB,
  new_value JSONB,
  updated_by BIGSERIAL,
  created_at TIMESTAMP
)
```

---

## 🔍 **Cross-Cutting Infrastructure**

### **AuditModule**

- `audit_logs` (Global critical actions)

```sql
audit_logs (
  id BIGSERIAL PK,
  actor_id BIGSERIAL,
  entity_type TEXT,
  entity_id BIGSERIAL,
  action TEXT,
  created_at TIMESTAMP
)
```

### **SearchModule**

- `search_index`

```sql
search_index (
  entity_type TEXT,
  entity_id BIGSERIAL,
  searchable_text TSVECTOR
)
```

---

✅ **Notes on Structure:**

1. **Module-first logs:** Each module has its own log table for detailed tracking and undo/history support.
2. **Global audit logs:** Centralized cross-cutting logging for critical actions (login, circle creation, account updates).
3. **Search index:** References entities for global search without storing actual data.
4. **Development alignment:** Matches your backend module sequence—core first, functional next, infrastructure cross-cutting.
