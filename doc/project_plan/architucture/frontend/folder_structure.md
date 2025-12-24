<pre>
my-app/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router (Routes & Layouts)
│   │   ├── api/            # Route handlers (if using local API)
│   │   ├── layout.tsx      # Root layout (Wraps app in Providers)
│   │   ├── page.tsx        # Homepage
│   │   └── providers.tsx   # Client-side Provider wrapper (CRITICAL)
│   ├── components/
│   │   ├── ui/             # Reusable base UI (Buttons, Inputs - e.g., Shadcn)
│   │   └── features/       # Feature-specific components (e.g., UserProfile)
│   ├── hooks/              # Custom TanStack Query hooks (e.g., useUser.ts)
│   ├── services/           # Pure fetcher functions / API calls
│   ├── lib/                # Shared utilities (queryClient setup, axios, etc.)
│   ├── types/              # TypeScript interfaces/types
│   └── constants/          # Query keys and API endpoints
├── .env.local
├── next.config.ts
└── tsconfig.json
</pre>
