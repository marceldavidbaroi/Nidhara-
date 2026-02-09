# **Frontend Development Plan (Full + Layout First)**

---

## **Phase 0: Project Setup**

**Goal:** Initialize project, core dependencies, folder structure.

### Steps

1. **Project Initialization**

   - Next.js 14+ (app router), TypeScript, ESLint, Prettier
   - Dependencies:

     ```
     npm install @tanstack/react-query shadcn/ui tailwindcss clsx
     ```

     > No Axios, fetch only

2. **Folder Structure**

   ```
   src/
   ├─ app/                 # Routing & layouts
   ├─ features/            # Business logic
   ├─ lib/                 # fetcher, queryClient, utils
   ├─ components/          # Reusable UI (shadcn)
   ├─ hooks/               # Global hooks
   ├─ store/               # UI state only
   ├─ constants/           # Endpoints, routes
   ├─ styles/
   └─ types/
   ```

3. **Core Setup Files**

   - `lib/fetcher.ts` → SSR + SPA, auto refresh token
   - `lib/queryClient.ts` → TanStack Query client
   - `app/layout.tsx` → global providers + main layout
   - `constants/api.ts` → API endpoint strings

4. **Tailwind + Shadcn**

   - Initialize Tailwind
   - Run `npx shadcn-ui init`
   - Configure shadcn components: buttons, inputs, modals, tables

---

## **Phase 1: Global Layout & Core Pages**

**Goal:** Build the skeleton first — menu, dashboard layout, error handling, loading, 404.

| Aspect       | Description                                                         | Notes                                                        |
| ------------ | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| Layout       | `app/layout.tsx`                                                    | Wraps QueryClientProvider, ThemeProvider, Shadcn UI Provider |
| Sidebar/Menu | `components/layout/Sidebar.tsx`                                     | Dynamic menu items for modules                               |
| Header       | `components/layout/Header.tsx`                                      | User info, notifications                                     |
| Pages        | `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx`             | Global loading, error, 404                                   |
| Notes        | Start with static UI placeholders; will be connected to hooks later |                                                              |

> ✅ **Rationale:** All other modules (Auth, Users, Finance, Life) rely on this layout. Developing it first avoids repeated refactoring.

---

## **Phase 2: Core Identity & Security**

**Goal:** Authentication, session, recovery, audit-ready.

| Feature         | API                                          | Hooks                              | Components                  | Pages                                               | Notes                                                               |
| --------------- | -------------------------------------------- | ---------------------------------- | --------------------------- | --------------------------------------------------- | ------------------------------------------------------------------- |
| Auth            | `login`, `register`, `getMe`, `refreshToken` | `useLogin`, `useRegister`, `useMe` | `LoginForm`, `RegisterForm` | `(auth)/login/page.tsx`, `(auth)/register/page.tsx` | SPA + SSR, auto refresh token, token storage in localStorage/cookie |
| Recovery        | `requestRecoveryKey`, `useRecoveryKey`       | `RecoveryForm`                     | `(auth)/recovery/page.tsx`  | Add later                                           |                                                                     |
| Security Events | Optional logs UI                             | `useSecurityEvents`                | Security table/list         | `/dashboard/security`                               | Admin only                                                          |

---

## **Phase 3: User & Ownership Modules**

**Goal:** Users, circles, roles, permissions, audit-ready.

| Feature     | API                                       | Hooks                            | Components                        | Pages                    | Notes                            |
| ----------- | ----------------------------------------- | -------------------------------- | --------------------------------- | ------------------------ | -------------------------------- |
| Users       | `getUsers`, `getUserById`                 | `useUsers`, `useUser`            | `UserList`, `UserCard`            | `/dashboard/users`       | CRUD modals optional             |
| Circles     | `getCircles`, `getMembers`, `updateRoles` | `useCircles`, `useCircleMembers` | `CircleList`, `CircleMemberTable` | `/dashboard/circles`     | Owner/admin roles, domain events |
| Permissions | `getPolicies`, `updatePolicy`             | `usePolicies`                    | Policy table                      | `/dashboard/permissions` | Optional admin-only UI           |

---

## **Phase 4: Finance System**

| Feature         | API                                                       | Hooks                      | Components                          | Pages                             | Notes                                      |
| --------------- | --------------------------------------------------------- | -------------------------- | ----------------------------------- | --------------------------------- | ------------------------------------------ |
| Accounts        | `getAccounts`, `createAccount`, `archiveAccount`          | `useAccounts`              | `AccountCard`                       | `/dashboard/accounts`             | Display balances, audit logs               |
| Transactions    | `getTransactions`, `createTransaction`, `voidTransaction` | `useTransactions`          | `TransactionTable`, `ReceiptUpload` | `/dashboard/transactions`         | Immutable ledger, optional receipts upload |
| Categories/Tags | `getCategories`, `getTags`                                | `useCategories`, `useTags` | Tag filter UI                       | Reusable in Accounts/Transactions | Shared taxonomy                            |

---

## **Phase 5: Life & Productivity**

| Feature  | API  | Hooks         | Components                   | Pages                 | Notes                       |
| -------- | ---- | ------------- | ---------------------------- | --------------------- | --------------------------- |
| LifeLogs | CRUD | `useLifelogs` | `LifelogCard`, `CapsuleCard` | `/dashboard/lifelogs` | Capsules, logs              |
| Tasks    | CRUD | `useTasks`    | `TaskCard`, `TaskList`       | `/dashboard/tasks`    | Assignments, status updates |
| Notes    | CRUD | `useNotes`    | `NoteCard`, `ReminderCard`   | `/dashboard/notes`    | Knowledge base, reminders   |
| Contacts | CRUD | `useContacts` | `ContactCard`                | `/dashboard/contacts` | Personal/org contacts       |
| Trips    | CRUD | `useTrips`    | `TripCard`, `BudgetCard`     | `/dashboard/trips`    | Budgets, logs               |

---

## **Phase 6: Cross-Cutting Enhancements**

| Feature       | API                    | Hooks              | Components                   | Pages               | Notes                       |
| ------------- | ---------------------- | ------------------ | ---------------------------- | ------------------- | --------------------------- |
| Search        | Global search endpoint | `useSearch`        | `SearchBar`, `SearchResults` | `/dashboard/search` | Index all modules           |
| Notifications | Optional toast system  | `useNotifications` | Toast UI                     | Reusable            | Use shadcn `Toast`          |
| Audit Logs    | Admin logs UI          | `useAuditLogs`     | Table/List                   | `/dashboard/audit`  | Read-only, append-only logs |

---

## **Phase 7: Utilities & Core Enhancements**

| Feature        | Description                                    | Notes                                 |
| -------------- | ---------------------------------------------- | ------------------------------------- |
| Global Hooks   | `useDebounce`, `useMounted`, `useLocalStorage` | Reusable across modules               |
| Store          | `store/ui.store.ts`                            | UI state only: sidebar, modals, theme |
| Theme & Layout | Light/dark toggle, responsive layout           | Integrated with shadcn                |
| Error Handling | Global Error Boundary (`app/error.tsx`)        | SSR + SPA compatible                  |

---

## **Mental Model Recap**

| Layer      | Responsibility                                      |
| ---------- | --------------------------------------------------- |
| constants  | API endpoints, route paths                          |
| lib        | Fetcher (SSR/SPA, auto refresh), QueryClient, utils |
| features   | Module API + hooks + optional components            |
| hooks      | TanStack Query hooks                                |
| components | Pure UI, props-based, shadcn                        |
| store      | UI state (theme, sidebar, modals)                   |
| app        | Routing, layout, global providers, skeleton pages   |

---

### ✅ Key Recommendations

1. **Start with layout & core pages first**: menu, dashboard shell, loading, error, 404.
2. **Then implement Auth + Recovery**: ensures secure flow before other modules.
3. **Next, build Users/Circles/Permissions**: core ownership features with audit-ready UI.
4. **Finance & Life modules** follow after core identity & ownership is ready.
5. **Cross-cutting utilities** (search, notifications, audit) last, after modules provide data.
6. **Always use fetcher** for SSR + SPA + auto refresh token.
7. **UI via shadcn**; state limited to UI only (no global data state).
