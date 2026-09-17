# NEXIUM Storage — Web

Next.js frontend for NEXIUM Storage. Includes the user dashboard, admin panel, billing, and developer documentation.

**Stack:** Next.js 14 · Tailwind CSS · shadcn/ui · TanStack Query

---

## Requirements

- Node.js 20+
- A running instance of the API (`nexium-storage-api`)

---

## Environment variables

Create a `.env.local` file at the root of this directory.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✓ | API base URL (e.g. `http://localhost:8080` or `https://api.nexium.ai`) |

---

## Run locally

```bash
npm install
npm run dev
```

App available at `http://localhost:3000`.

The API must be running on `NEXT_PUBLIC_API_URL` before starting the frontend.

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/login` | Login |
| `/register` | Registration |
| `/verify-email` | Email verification |
| `/forgot-password` | Password reset request |
| `/reset-password` | Password reset (with code) |
| `/dashboard` | Main dashboard |
| `/dashboard/projects` | Projects list |
| `/dashboard/projects/[id]` | Project detail (buckets & API keys) |
| `/dashboard/projects/[id]/buckets/[bucketId]` | Files in a bucket |
| `/dashboard/projects/[id]/webhooks` | Webhook configuration |
| `/dashboard/api-keys` | API keys management |
| `/dashboard/usage` | Storage usage |
| `/dashboard/billing` | Plans, payments, add-ons |
| `/dashboard/settings` | Account settings |
| `/docs` | Developer integration guide |
| `/admin` | Admin panel (admin only) |
| `/admin/users` | User management |
| `/admin/billing` | Plans & payment channels management |
| `/admin/logs` | Activity logs |

---

## Build for production

```bash
npm run build
npm start
```
