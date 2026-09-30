# Design System — NEXIUM Storage Web

UI reference for `apps/web`. All components live in `components/ui/`, tokens in `globals.css` and `tailwind.config.ts`.

---

## Design tokens

Tokens are CSS custom properties defined in `globals.css` under `:root` (dark, default) and `html[data-theme="light"]`. They are exposed as Tailwind utilities under the `ds-*` namespace via `tailwind.config.ts`.

### Colors

| Token | Tailwind class | Dark value | Light value |
|---|---|---|---|
| `--ds-bg-base` | `bg-ds-bg-base` | `#08080f` | `#edf0f5` |
| `--ds-bg-card` | `bg-ds-bg-card` | `#0c0c14` | `#ffffff` |
| `--ds-bg-subtle` | `bg-ds-bg-subtle` | `rgba(255,255,255,0.03)` | `rgba(0,0,0,0.03)` |
| `--ds-bg-hover` | `bg-ds-bg-hover` | `rgba(255,255,255,0.055)` | `rgba(0,0,0,0.045)` |
| `--ds-border` | `border-ds-border` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` |
| `--ds-border-strong` | `border-ds-border-strong` | `rgba(255,255,255,0.18)` | `rgba(0,0,0,0.15)` |
| `--ds-border-brand` | `border-ds-border-brand` | `rgba(155,61,255,0.4)` | same |
| `--ds-text-primary` | `text-ds-text-primary` | `#f9fafb` | `#0f0f14` |
| `--ds-text-secondary` | `text-ds-text-secondary` | `#9ca3af` | `#5a5a6e` |
| `--ds-text-tertiary` | `text-ds-text-tertiary` | `#6b7280` | `#7a7a8c` |
| `--ds-text-muted` | `text-ds-text-muted` | `#4b5563` | `#9898aa` |
| `--ds-brand` | `text-ds-brand` / `bg-ds-brand` | `#9b3dff` | same |
| `--ds-brand-hover` | `bg-ds-brand-hover` | `#aa55ff` | same |
| `--ds-brand-muted` | `bg-ds-brand-muted` | `rgba(155,61,255,0.1)` | same |
| `--ds-success` | `text-ds-success` | `#10b981` | `#059669` |
| `--ds-error` | `text-ds-error` | `#ef4444` | `#dc2626` |
| `--ds-warning` | `text-ds-warning` | `#f59e0b` | `#d97706` |
| `--ds-info` | `text-ds-info` | `#3b82f6` | `#2563eb` |

### Typography

| Token | Description |
|---|---|
| `font-sans` | Primary — Pangram → Roobert → system-ui |
| `font-heading` | Headings — Roobert → Pangram |
| `font-mono` | Code — Roobert Mono → monospace |

### Border radius

| Tailwind class | Value |
|---|---|
| `rounded-xs` | 6px |
| `rounded-sm` | 8px |
| `rounded-md` | 10px |
| `rounded-lg` | 12px |
| `rounded-xl` | 16px |
| `rounded-2xl` | 20px |
| `rounded-3xl` | 24px |

### Shadows

| Tailwind class | Use |
|---|---|
| `shadow-ds-sm` | Buttons, small cards |
| `shadow-ds-md` | Modals, dropdowns |
| `shadow-ds-lg` | Overlays |
| `shadow-ds-brand` | Brand glow (purple) |

---

## Utility

### `cn()` — `lib/utils.ts`

Merges Tailwind classes safely (clsx + tailwind-merge).

```ts
import { cn } from "@/lib/utils";

cn("px-4 py-2", condition && "bg-ds-brand", className)
```

---

## Components

All components are exported from `components/ui/index.ts`:

```ts
import { Button, Input, PasswordInput, Badge, Card, Spinner, ... } from "@/components/ui";
```

---

### Button — `components/ui/button.tsx`

Built with CVA. Applies `ds-*` tokens automatically.

```tsx
<Button>Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Link</Button>

<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><TrashIcon size={15} /></Button>

<Button loading>Saving…</Button>
<Button fullWidth>Full width</Button>
<Button disabled>Disabled</Button>
```

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `primary \| outline \| ghost \| destructive \| link` | `primary` | Visual style |
| `size` | `sm \| md \| lg \| xl \| icon` | `md` | Height + padding |
| `loading` | `boolean` | — | Shows spinner, disables button |
| `fullWidth` | `boolean` | — | `w-full` |

---

### Input — `components/ui/input.tsx`

Standard text input with full DS token styling.

```tsx
<Input placeholder="Email" />
<Input error placeholder="Invalid value" />
```

**Props:** all native `<input>` props + `error?: boolean`

---

### PasswordInput — `components/ui/input.tsx`

**Transparent wrapper** — does not impose design system styles. Adds only the eye toggle on top of whatever `className` you pass. Use this to retrofit existing password fields without changing their look.

```tsx
<PasswordInput
  placeholder="••••••••"
  className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 ..."
/>

// With react-hook-form:
<PasswordInput {...register("password")} className="..." />
```

**Rule:** pass the full styling via `className`. `PasswordInput` adds `pr-10` automatically to prevent text hiding behind the toggle.

---

### Textarea — `components/ui/textarea.tsx`

```tsx
<Textarea placeholder="Description…" />
<Textarea error rows={5} />
```

**Props:** all native `<textarea>` props + `error?: boolean`

---

### Label — `components/ui/label.tsx`

```tsx
<Label htmlFor="name">Full name</Label>
```

---

### Badge — `components/ui/badge.tsx`

```tsx
<Badge>Default</Badge>
<Badge variant="brand">Pro</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="warning">Expiring</Badge>
<Badge variant="info">Beta</Badge>

<Badge size="md">Larger</Badge>
```

**Variants:** `default`, `brand`, `success`, `error`, `warning`, `info`  
**Sizes:** `sm` (default), `md`

---

### Card — `components/ui/card.tsx`

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Subtitle</CardDescription>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
  <CardFooter>
    <Button size="sm">Action</Button>
  </CardFooter>
</Card>
```

---

### Spinner — `components/ui/spinner.tsx`

```tsx
<Spinner />
<Spinner size="sm" />
<Spinner size="lg" />
```

**Sizes:** `sm` (13px), `md` (18px, default), `lg` (24px)

---

### Separator — `components/ui/separator.tsx`

```tsx
<Separator />
<Separator orientation="vertical" className="h-4" />
```

---

## Theme system

Theme is driven by the `data-theme` attribute on `<html>` (`"dark"` or `"light"`), set by `ThemeContext` (`contexts/theme-context.tsx`).

- Dashboard pages use `.dash-page` as scoping class.
- Landing/auth pages use `.themed-page`.
- Light mode overrides live in `globals.css` under `[data-theme="light"] .dash-page` and `html[data-theme="light"]`.

The `ds-*` tokens flip automatically — no component-level dark/light logic needed.

---

## Semantic billing classes

A few semantic CSS classes handle the billing page's dark/light theming since those components use hardcoded Tailwind colors that predate the DS tokens:

| Class | Applied to | Purpose |
|---|---|---|
| `bill-choose-btn` | Starter / Business CTA buttons | Keeps `#9b3dff` text and border in light mode |
| `bill-plan-card` | Plan cards | Background and border theming |
| `bill-channel-btn` | Operator channel buttons | Neutral by default, purple on `.active` |
| `bill-channel-section p` | Operator section subtitle | Readable text color in light mode |

---

## Conventions

- **Never style `PasswordInput` internally** — it is a transparent wrapper. The caller owns the visual style.
- **Prefer `ds-*` tokens** over hardcoded hex values for any new component.
- **CVA for variants** — use `class-variance-authority` when a component has more than two visual modes.
- **`cn()` for merging** — always use `cn()` to merge `className` props so consumers can override.
- **`React.forwardRef`** — required on any input-like component to support react-hook-form's `register()`.
