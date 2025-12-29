# **Database Schema Grouped by Modules**

---

## 🔐 **Core Identity & Security (Highest Priority)**

### **AuthModule**

- `users`

```sql
users (
  id UUID PK,
  email TEXT UNIQUE,
  display_name TEXT,
  status ENUM('ACTIVE','LOCKED','PERMANENT_LOCK'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

- `auth_credentials`

```sql
auth_credentials (
  id UUID PK,
  user_id UUID FK(users.id),
  type ENUM('PASSKEY','SECRET_QUESTION'),
  secret_hash TEXT,
  metadata JSONB,
  created_at TIMESTAMP
)
```

- `auth_sessions`

```sql
auth_sessions (
  id UUID PK,
  user_id UUID FK(users.id),
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP
)
```

- `security_events` (Auth-specific log)

```sql
security_events (
  id UUID PK,
  user_id UUID,
  type ENUM('FAILED_LOGIN','LOCKOUT','UNLOCK'),
  metadata JSONB,
  created_at TIMESTAMP
)
```

---

### **RecoveryModule**

- `recovery_keys`

```sql
recovery_keys (
  id UUID PK,
  user_id UUID FK(users.id),
  key_hash TEXT,
  used_at TIMESTAMP,
  created_at TIMESTAMP
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
  id UUID PK,
  name TEXT,
  owner_id UUID FK(users.id),
  status ENUM('ACTIVE','DISSOLVED'),
  created_at TIMESTAMP
)
```

- `circle_members`

```sql
circle_members (
  id UUID PK,
  circle_id UUID FK(circles.id),
  user_id UUID FK(users.id),
  role ENUM('OWNER','ADMIN','EDITOR','VISITOR'),
  joined_at TIMESTAMP
)
```

- `circle_events` (Module log)

```sql
circle_events (
  id UUID PK,
  circle_id UUID,
  type ENUM('DISSOLVED','OWNER_TRANSFERRED','MEMBER_ADDED','MEMBER_REMOVED'),
  payload JSONB,
  created_at TIMESTAMP
)
```

### **PermissionModule**

- `permission_policies`

```sql
permission_policies (
  id UUID PK,
  role ENUM('OWNER','ADMIN','EDITOR','VISITOR'),
  resource TEXT,
  action TEXT,
  allowed BOOLEAN
)
```

- `permission_logs` (Optional module-specific log)

```sql
permission_logs (
  id UUID PK,
  policy_id UUID FK(permission_policies.id),
  changed_by UUID,
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
  id UUID PK,
  circle_id UUID FK(circles.id),
  owner_id UUID FK(users.id),
  type ENUM('BANK','WALLET','CREDIT'),
  name TEXT,
  archived_at TIMESTAMP,
  created_at TIMESTAMP
)
```

- `account_audit_logs` (Module-specific log)

```sql
account_audit_logs (
  id UUID PK,
  account_id UUID,
  action TEXT,
  metadata JSONB,
  created_at TIMESTAMP
)
```

### **TransactionModule**

- `transactions`

```sql
transactions (
  id UUID PK,
  account_id UUID FK(accounts.id),
  amount NUMERIC,
  direction ENUM('IN','OUT'),
  status ENUM('POSTED','VOIDED'),
  category_id UUID,
  created_by UUID,
  created_at TIMESTAMP
)
```

- `transaction_receipts`

```sql
transaction_receipts (
  id UUID PK,
  transaction_id UUID,
  document_url TEXT,
  created_at TIMESTAMP
)
```

- `transaction_logs` (Optional module-specific log)

```sql
transaction_logs (
  id UUID PK,
  transaction_id UUID FK(transactions.id),
  old_status ENUM('POSTED','VOIDED'),
  new_status ENUM('POSTED','VOIDED'),
  changed_by UUID,
  created_at TIMESTAMP
)
```

### **CategoryTagModule**

- `categories`

```sql
categories (
  id UUID PK,
  module ENUM('FINANCE','LIFELOG','KNOWLEDGE'),
  name TEXT,
  system_defined BOOLEAN
)
```

- `tags`

```sql
tags (
  id UUID PK,
  name TEXT,
  module TEXT
)
```

- `tag_relations`

```sql
tag_relations (
  tag_id UUID,
  entity_id UUID,
  entity_type TEXT
)
```

---

## 🧬 **Life Systems**

### **LifeLogModule**

- `lifelogs`

```sql
lifelogs (
  id UUID PK,
  circle_id UUID,
  author_id UUID,
  content TEXT,
  created_at TIMESTAMP
)
```

- `capsules`

```sql
capsules (
  id UUID PK,
  lifelog_id UUID,
  unlock_at TIMESTAMP,
  unlocked_at TIMESTAMP
)
```

- `lifelog_logs` (Optional module log)

```sql
lifelog_logs (
  id UUID PK,
  lifelog_id UUID FK(lifelogs.id),
  old_content TEXT,
  new_content TEXT,
  updated_by UUID,
  created_at TIMESTAMP
)
```

### **TaskModule**

- `tasks`

```sql
tasks (
  id UUID PK,
  circle_id UUID,
  creator_id UUID,
  title TEXT,
  status ENUM('TODO','IN_PROGRESS','DONE'),
  created_at TIMESTAMP
)
```

- `task_assignments`

```sql
task_assignments (
  task_id UUID,
  user_id UUID
)
```

- `task_logs` (Optional module log)

```sql
task_logs (
  id UUID PK,
  task_id UUID FK(tasks.id),
  old_status ENUM('TODO','IN_PROGRESS','DONE'),
  new_status ENUM('TODO','IN_PROGRESS','DONE'),
  updated_by UUID,
  created_at TIMESTAMP
)
```

### **KnowledgeBaseModule**

- `notes`

```sql
notes (
  id UUID PK,
  owner_id UUID,
  circle_id UUID,
  content TEXT,
  created_at TIMESTAMP
)
```

- `note_reminders`

```sql
note_reminders (
  id UUID PK,
  note_id UUID,
  remind_at TIMESTAMP
)
```

- `note_logs` (Optional module log)

```sql
note_logs (
  id UUID PK,
  note_id UUID FK(notes.id),
  old_content TEXT,
  new_content TEXT,
  updated_by UUID,
  created_at TIMESTAMP
)
```

### **ContactModule**

- `contacts`

```sql
contacts (
  id UUID PK,
  owner_id UUID,
  name TEXT,
  metadata JSONB,
  created_at TIMESTAMP
)
```

- `contact_logs` (Optional module log)

```sql
contact_logs (
  id UUID PK,
  contact_id UUID FK(contacts.id),
  old_value JSONB,
  new_value JSONB,
  updated_by UUID,
  created_at TIMESTAMP
)
```

### **TravelModule**

- `trips`

```sql
trips (
  id UUID PK,
  circle_id UUID,
  owner_id UUID,
  title TEXT,
  start_date DATE,
  end_date DATE
)
```

- `trip_budgets`

```sql
trip_budgets (
  id UUID PK,
  trip_id UUID,
  amount NUMERIC
)
```

- `trip_logs` (Optional module log)

```sql
trip_logs (
  id UUID PK,
  trip_id UUID FK(trips.id),
  old_value JSONB,
  new_value JSONB,
  updated_by UUID,
  created_at TIMESTAMP
)
```

---

## 🔍 **Cross-Cutting Infrastructure**

### **AuditModule**

- `audit_logs` (Global critical actions)

```sql
audit_logs (
  id UUID PK,
  actor_id UUID,
  entity_type TEXT,
  entity_id UUID,
  action TEXT,
  created_at TIMESTAMP
)
```

### **SearchModule**

- `search_index`

```sql
search_index (
  entity_type TEXT,
  entity_id UUID,
  searchable_text TSVECTOR
)
```

---

✅ **Notes on Structure:**

1. **Module-first logs:** Each module has its own log table for detailed tracking and undo/history support.
2. **Global audit logs:** Centralized cross-cutting logging for critical actions (login, circle creation, account updates).
3. **Search index:** References entities for global search without storing actual data.
4. **Development alignment:** Matches your backend module sequence—core first, functional next, infrastructure cross-cutting.
