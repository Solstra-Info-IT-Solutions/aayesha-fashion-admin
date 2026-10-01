# Aayesha Fashion — admin panel keys and configuration

Repository: `aayesha-fashion-admin` (Next.js, deployed on Vercel).
Storefront counterpart: `aayesha-fashion-new/docs/ENVIRONMENT_KEYS.md`.
The backend (`aayesha-fashion-backend`, Render) holds every secret; this document lists those too,
because the admin panel only works when they are set.

> Never put a secret in a `NEXT_PUBLIC_*` variable — those are bundled into the browser.
> Secrets entered through the admin panel (the WhatsApp access token) are stored on the backend
> AES-256-GCM encrypted and are never sent back to the browser.

## 1. Keys this repository reads

| Key | Required | Where | If missing | Status |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | **Yes** | `src/lib/api.ts` — base URL of every API call (set it to `https://aayesha-fashion-backend.onrender.com/api`) | All requests fail; sign-in shows "The admin site is missing NEXT_PUBLIC_API_BASE_URL." | Implemented |

That is the only environment variable the admin uses.

## 2. Backend keys the admin panel depends on (set on Render)

### Required for the backend to start
| Key | Purpose | Notes |
| --- | --- | --- |
| `MONGODB_URI` | Database | Required |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Sign admin/customer tokens | Required; use long random strings. Also the fallback encryption key for the saved WhatsApp token |
| `FRONTEND_URL` | Storefront origin (CORS) | Required |
| `ADMIN_FRONTEND_URL` | **This admin site's origin (CORS)** | Required. If it is missing/wrong, sign-in fails in the browser with a network/CORS error |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Product, banner and review image uploads | Required |
| `NODE_ENV=production` | Production behaviour | Recommended |

### Optional / feature keys
| Feature (admin page) | Keys | Status |
| --- | --- | --- |
| Extra allowed origins | `CORS_ALLOWED_ORIGINS` (comma separated) | Implemented |
| Token lifetimes | `JWT_ACCESS_EXPIRES_IN` (15m), `JWT_REFRESH_EXPIRES_IN` (30d), `JWT_ISSUER`, `JWT_AUDIENCE` | Implemented, defaults fine |
| Payments & WhatsApp → UPI / bank | `STORE_UPI_ID`, `STORE_BANK_DETAILS` — or enter them in **Admin → Payments & WhatsApp** (admin values win) | Implemented; **values not confirmed** |
| Payments & WhatsApp → invoice details | `STORE_NAME`, `STORE_PHONE`, `STORE_EMAIL`, `STORE_ADDRESS`, `STORE_GSTIN`, or the admin form | Implemented |
| Payment timing | `PAYMENT_CLAIM_HOLD_MINUTES` (30–1440, default 180), `INVOICE_RESEND_COOLDOWN_SECONDS` (default 120) | Implemented |
| WhatsApp bills & invoices | `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_API_VERSION` (v23.0), `WHATSAPP_TEMPLATE_LANGUAGE` (en), `WHATSAPP_INVOICE_TEMPLATE_NAME`, `WHATSAPP_BILL_TEMPLATE_NAME` — or the admin form | Implemented; **never tested with real credentials** |
| Online payments (Razorpay) | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Implemented; **no live keys, untested** (storefront also needs `NEXT_PUBLIC_ENABLE_ONLINE_PAYMENT=true`) |
| Cash on Delivery | `COD_ENABLED=true` | Implemented, off by default |
| Abandoned-cart reminders | `CART_REMINDERS_ENABLED` (default true) | Implemented |
| Customer OTP login | `SMS_PROVIDER` = `console` (default, prints OTP to logs — dev only) / `msg91` / `twilio`; `MSG91_AUTH_KEY`, `MSG91_OTP_TEMPLATE_ID`; `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` | `console` works; providers **untested** |
| E-mail (OTP, reminders) | `SMTP_HOST`, `SMTP_PORT` (587), `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Implemented; **untested** |
| Encryption of saved secrets | `SETTINGS_ENCRYPTION_KEY` (defaults to `JWT_REFRESH_SECRET`) | Optional |

## 3. Things that must be true for the live admin to work
1. Vercel (admin project): `NEXT_PUBLIC_API_BASE_URL` set, then redeploy (it is baked in at build time).
2. Render: `ADMIN_FRONTEND_URL` equals the admin site's exact origin (no trailing slash).
3. A user with the admin role exists in the database. The backend `npm run seed` script seeds categories, collections and homepage content only — no admin-creation script was found in the backend repository, so an admin has to be created/promoted directly in MongoDB (`role: "admin"`). The admin panel has no sign-up page.

## 4. What is left / not done
* **Live verification.** All admin pages were tested against a mock API in a browser. Saving, publishing, deleting, status changes, CSV import/export and WhatsApp/payment settings have **not** been run against the live backend.
* **WhatsApp delivery** — requires a Meta Business account, approved templates and a permanent token. "Verify connection" is untested.
* **Razorpay, SMS and SMTP providers** — not configured; choose and test before relying on them.
* **Vercel deploy status** could not be checked from the development environment.
* **Unused code** — `components/admin/catalog/categories/CategoriesPage.tsx` is not routed anywhere.
* **Pre-existing lint errors** — roughly 38 `react-hooks/set-state-in-effect` errors in older files; they do not affect behaviour.

## 5. Navigation fix
List → detail → "Back to …" used to push a new history entry each time, so repeated round-trips stacked pages and the
browser Back button bounced between list and detail. Back links now go back in history when the visitor came from that list
and otherwise replace the current entry (`src/lib/nav-history.ts`, `components/navigation/*`). After saving, creating or
deleting, the admin now **replaces** the form with the list instead of pushing, so Back no longer returns to a stale form.
Verified: four list→detail→back loops add one history entry on Customers, Discounts, Reviews and Marketing.
Create/save/delete redirects are changed but were not exercised against a server.

## 6. Other polish in this change
* Per-section browser tab titles ("Orders · Aayesha Admin"); previously every page was "Aayesha Fashion Admin".
* One `<main>` landmark per page (Homepage, Marketing, Settings had two).
* Form controls without a programmatic label now get an accessible name from the nearby label/placeholder.
