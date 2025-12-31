<pre>
src/
│
├── app/                             # 🚦 ROUTING ONLY (NO DATA LOGIC)
│   ├── layout.tsx                   # Providers, theme, fonts
│   ├── page.tsx                     # Page UI only
│   ├── loading.tsx                  # Loading UI
│   ├── error.tsx                    # Error boundary
│   ├── not-found.tsx                # 404
│   │
│   ├── (auth)/                      # Route groups (URL unaffected)
│   │   ├── login/page.tsx           # Uses auth hooks
│   │   └── register/page.tsx
│   │
│   ├── dashboard/
│   │   ├── layout.tsx               # Dashboard shell
│   │   ├── page.tsx
│   │   └── users/page.tsx
│   │
│   └── api/                         # 🧩 BACKEND (OPTIONAL)
│       └── users/route.ts           # Server-only endpoints (BFF)
│
├── constants/                       # 📌 API ENDPOINTS & CONSTANTS
│   ├── api.ts                       # ALL API URLs live here
│   ├── queryKeys.ts                 # TanStack query keys
│   └── routes.ts                    # App route constants
│
├── features/                        # 🧠 BUSINESS LOGIC (MOST IMPORTANT)
│   ├── auth/
│   │   ├── api.ts                   # Fetch calls using fetcher
│   │   ├── hooks.ts                 # useLogin, useMe (TanStack)
│   │   ├── types.ts                 # Auth types
│   │   └── components/              # Auth-only UI
│   │
│   ├── users/
│   │   ├── api.ts                   # getUsers, getUserById
│   │   ├── hooks.ts                 # useUsers, useUser
│   │   ├── types.ts                 # User types
│   │   └── components/
│   │
│   └── posts/
│       ├── api.ts
│       ├── hooks.ts
│       ├── types.ts
│       └── components/
│
├── lib/                             # 🛠 CORE SETUP
│   ├── fetcher.ts                   # Custom fetch wrapper (REQUIRED)
│   ├── queryClient.ts               # TanStack Query config
│   ├── env.ts                       # Env validation
│   └── utils.ts                     # Generic helpers
│
├── components/                      # 🎨 REUSABLE UI
│   ├── ui/                          # Button, Input, Modal
│   ├── layout/                      # Header, Sidebar
│   └── common/                      # Shared components
│
├── hooks/                           # 🔁 GLOBAL HOOKS
│   ├── useDebounce.ts
│   └── useMounted.ts
│
├── store/                           # 🧩 CLIENT UI STATE ONLY
│   └── ui.store.ts                  # Theme, sidebar, modals
│
├── styles/                          # 🎨 STYLES
│   ├── globals.css
│   └── theme.css
│
├── types/                           # 🌐 GLOBAL TYPES
│   └── index.ts
│
├── middleware.ts                    # 🔐 AUTH / REDIRECT LOGIC
│
└── config/                          # ⚙️ APP CONFIG
    └── site.ts
</pre>

---

# 🧭 EXACT RULES: Where to Put What

## 🔴 NEVER PUT THESE HERE

| Location      | ❌ Not allowed        |
| ------------- | --------------------- |
| `app/`        | fetch calls, API URLs |
| `components/` | data fetching         |
| `constants/`  | fetch logic           |
| `features/`   | route definitions     |

---

## 🟢 WHAT GOES WHERE (Golden Rules)

---

## 1️⃣ API ENDPOINTS (URLs only)

📍 **`constants/api.ts`**

```ts
export const API_ENDPOINTS = {
  USERS: {
    LIST: "/api/users",
    DETAIL: (id: string) => `/api/users/${id}`,
  },
};
```

✔ No fetch
✔ No logic
✔ Strings & path builders only

---

## 2️⃣ API CALL FUNCTIONS

📍 **`features/*/api.ts`**

```ts
import { fetcher } from "@/lib/fetcher";
import { API_ENDPOINTS } from "@/constants/api";

export const getUsers = () => fetcher(API_ENDPOINTS.USERS.LIST);
```

✔ Uses fetcher
✔ Uses constants
✔ Returns data

---

## 3️⃣ DATA FETCHING HOOKS (TanStack)

📍 **`features/*/hooks.ts`**

```ts
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "./api";

export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
```

✔ Hooks only
✔ No UI
✔ No URLs

---

## 4️⃣ CUSTOM FETCH LOGIC

📍 **`lib/fetcher.ts`**

```ts
export async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) throw new Error("Request failed");
  return res.json();
}
```

✔ Centralized error handling
✔ Token handling later

---

## 5️⃣ SERVER API (OPTIONAL)

📍 **`app/api/*/route.ts`**

Used when:

- Hiding backend URLs
- Using secrets
- Transforming responses

Frontend calls:

```ts
fetcher("/api/users");
```

---

## 6️⃣ UI COMPONENTS

📍 **`components/` & `features/*/components`**

✔ Presentation only
✔ Receives data via props
❌ No fetch

---

## 7️⃣ PAGES & ROUTES

📍 **`app/*/page.tsx`**

```tsx
import { useUsers } from "@/features/users/hooks";

export default function UsersPage() {
  const { data } = useUsers();
  return <UserList users={data} />;
}
```

✔ Uses hooks
❌ No logic

---

# 🧠 ONE-LINE MENTAL MODEL

> - **constants → endpoints**
> - **fetcher → HTTP**
> - **features → business logic**
> - **hooks → data fetching**
> - **app → routing**
> - **components → UI**

---
