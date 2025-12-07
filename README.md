# Pokedex Lite
- Live Link : https://pokedex37.netlify.app
- Working video: https://drive.google.com/file/d/1CVAzoo3fu_BNJ_Rmat5VfouyXxc5iYPP/view?usp=sharing

Production-ready Pokédex built with React + Vite + TypeScript, using Tailwind for styling, React Query for data orchestration, Supabase Auth for OAuth, and Zustand for local favorites.
Run prettier it would easier to read code then.

## Setup

- Install dependencies: `npm install`
- Create `.env` with:
  - `VITE_SUPABASE_URL=your_supabase_project_url`
  - `VITE_SUPABASE_ANON_KEY=your_supabase_anon_key` (Supabase Dashboard → Settings → API)
- Run dev server: `npm run dev`
- Build for production: `npm run build`
- Lint: `npm run lint`
- Format: `npm run format` (Prettier)

## GitHub OAuth Setup (Supabase)

1. In GitHub: Settings → Developer settings → OAuth Apps → New OAuth App.
   - Homepage URL: your app origin (e.g., `http://localhost:5173`).
   - Authorization callback URL: `https://<your-project-ref>.supabase.co/auth/v1/callback`.
   - Note the Client ID; generate a Client Secret.
2. In Supabase: Authentication → Providers → GitHub.
   - Enable GitHub; paste Client ID and Client Secret; save.
   - Ensure the same callback URL is whitelisted.
3. Redeploy/restart with the correct `.env` values; the in-app “Continue with GitHub” will now work.

## Tech Stack

- React 19 + Vite + TypeScript (strict)
- Tailwind CSS (mobile-first responsive design)
- TanStack Query v5 for cached API access (5-minute stale time)
- Supabase Auth (Google/GitHub OAuth) for secure sign-in
- Zustand with localStorage persistence for favorites
- Framer Motion for card/grid/modal animations
- Lucide React for icons

## Features

- Paginated Pokémon grid (20 per page) with responsive layout (1/2/3/4 columns).
- Search-as-you-type backed by a cached full name list (`/pokemon?limit=10000&offset=0`); pagination hides while searching for fast local filtering.
- Type filter powered by `/type/{type}` with local pagination for long lists.
- Auth-gated experience with Supabase OAuth (Google/GitHub) and a secure session; header shows user name and sign-out.
- Favorites toggle on every card with persistence; quick switch to “My Favorites” view.
- Detail modal loads `/pokemon/{id}` on demand with artwork, types, stats, and abilities.
- Optimized images via ID-derived official artwork URLs (no extra detail fetch for list) with a readable fallback placeholder.
- Loading skeletons, graceful error states, and background syncing indicator.
- Pagination inputs to jump directly to any page (main list and type-filtered list).

## Architecture

- Feature-first folders under `src/features/pokemon` for API, queries, and UI pieces.
- Shared helpers in `src/lib` and global client state in `src/stores`.
- QueryClient configured in `src/main.tsx` with sane defaults and disabled window refetch noise.

## Notes & Trade-offs

- Image URLs are constructed from IDs to avoid unnecessary detail calls on list views.
- Search prefetches the lightweight full name list once and filters locally for instant results; the PokéAPI has no partial search endpoint.
- Type filtering reuses the `/type` endpoint and paginates locally to avoid repeated network calls.
- Favorites keep only `id` and `name` in storage; modal fetches full details on demand to stay lightweight.
- Supabase Auth keeps tokens in browser storage and redirects back to `window.location.origin`; ensure your origins and callbacks are whitelisted in Supabase and provider consoles.\*\*\*
