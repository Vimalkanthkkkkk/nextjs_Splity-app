# Splity

Splity is a full-stack expense-splitting app for groups: trips, flats, dinners. Create an event, invite friends with a link, add expenses, and see the fewest payments needed to settle up. Friends don't need to sign up. They open the link and pick their name.

> Built with Next.js (App Router), TypeScript, PostgreSQL and Drizzle ORM.

---

## Features

**Events and people**
- Create an event with a currency and a list of participants. The creator becomes the organiser automatically.
- Invite friends with a private link, by copy and paste or by email. No accounts or passwords.
- Friends open the link and claim their name. Taken names are hidden from the list.
- If someone loses access (cleared cookies, new phone), they get back in with an emailed sign-in link, or the organiser releases their name.
- The organiser can create a new link, revoke the link, and reset a name.

**Expenses**
- Three entry types: **expense**, **transfer** (for example cash withdrawn for someone) and **income** (for example a returned deposit).
- Four ways to split: **equally**, **exact amounts**, **shares** and **percentages**, with checkboxes to choose who is included.
- All maths runs in whole cents, so splits always add up exactly to the total (no lost pennies).
- Category, notes, date and a receipt attachment (up to 5 MB) on every entry.
- Edit an existing expense. The split box reopens with the saved method and values.

**Receipt OCR**
- Upload a receipt photo and the app reads the **total** with Tesseract.js, running in the browser.
- If the first pass fails, it retries on a cleaned image (upscaled and thresholded).
- The detected total sits in an editable field, so you can correct it when OCR gets it wrong.

**Balances and settlements**
- Live overview: what the event cost the group, what it cost you, what you paid, and what you owe or are owed.
- A "How to settle all debts" list gives a small set of payments that clears everyone's balance.
- **Mark this settlement** records a payment. It appears in the entries list as "Settlement added", and the debt leaves the calculation.
- Open a settlement and press **Undo** to remove it. The debt returns with its Mark button.
- Balances are never stored. They're recalculated from the entries every time, so edits and undo always stay consistent.

**History, insights and comments**
- A history log of created, edited and deleted entries, plus settlement marked and settlement deleted, each showing who did it.
- Insights page: spending by person, by category and over time (Recharts).
- Comments on each event, showing the author and the time.

---

## Tech stack

| Area | Tools |
|---|---|
| Framework | Next.js (App Router), React, Server Actions, `useActionState` |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL, Drizzle ORM (`drizzle-kit` for migrations) |
| Email | Resend |
| OCR | Tesseract.js (client-side) |
| Charts | Recharts |
| Local dev | Docker (PostgreSQL container) |

---

## How access works (no login)

Splity identifies people with **cookies**, not accounts.

1. The creator makes an event. The server gives their browser an **owner cookie** and marks their name as claimed.
2. The creator shares an invite link: `/join/<random-token>`.
3. A friend opens the link, sees the unclaimed names, and picks theirs. The server gives them a **member cookie**.
4. On every request, the server reads the cookie and checks it against the database. It never trusts form fields such as `event_id`.
5. Lost your cookie? Request a one-time sign-in link by email (see Email setup), or ask the organiser to reset your name.

| Cookie | Purpose |
|---|---|
| `owner_<eventId>` | Proves "I created this event" |
| `member_<eventId>` | Proves "I'm the participant named X in this event" |

One cookie per event means being in one event never gives access to another. Both are `httpOnly`, `sameSite=lax`, last one year, and are `secure` in production. The database stores only a **hash** of each token.

---

## Getting started

### Prerequisites
- Node.js 20 or newer
- npm
- Docker (for the local PostgreSQL database)
- Git

### 1. Clone and install

```bash
git clone https://github.com/Vimalkanthkkkkk/nextjs_Splity-app.git
cd nextjs_Splity-app
npm install
```

If your app lives in a subfolder (for example `split-app`), `cd` into it before running the commands below.

### 2. Start PostgreSQL with Docker

**Option A: `docker run`** (quickest)

```bash
docker run --name splity-db \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=resume_app \
  -p 5432:5432 \
  -v splity-pgdata:/var/lib/postgresql/data \
  -d postgres:16
```

**Option B: `docker-compose.yml`**

```yaml
services:
  db:
    image: postgres:16
    container_name: splity-db
    environment:
      POSTGRES_PASSWORD: mysecretpassword
      POSTGRES_DB: resume_app
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Then run `docker compose up -d`.

The `-v` / `volumes` line keeps your data when the container is removed. Without it, removing the container deletes the database.

**Useful Docker commands**

```bash
docker ps                      # is the database running?
docker stop splity-db          # stop it
docker start splity-db         # start it again
docker logs splity-db          # see database logs
docker exec -it splity-db psql -U postgres -d resume_app   # open a SQL shell
docker rm -f splity-db         # delete the container (data stays in the volume)
docker volume rm splity-pgdata # delete the data too (full reset)
```

If port `5432` is already in use, use `-p 5433:5432` and change the port in `DATABASE_URL`.

### 3. Environment variables

Copy the example file and fill it in:

```bash
cp .env.example .env.local
```

```dotenv
# Matches the Docker command above
DATABASE_URL="postgres://postgres:mysecretpassword@localhost:5432/resume_app"

# Leave empty to print emails to the app instead of sending them (see Email setup)
RESEND_API_KEY=
EMAIL_FROM="Splity <onboarding@resend.dev>"

# The URL people actually open. Used to build the links inside emails.
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | Postgres connection string |
| `RESEND_API_KEY` | No | Empty means console mode (no email is sent) |
| `EMAIL_FROM` | No | Defaults to `onboarding@resend.dev` |
| `NEXT_PUBLIC_APP_URL` | Yes | Must match the address in your browser |

Never commit `.env` or `.env.local`. They are in `.gitignore`.

Restart the dev server after changing any environment variable.

### 4. Create the database tables

```bash
npx drizzle-kit generate   # create migration files from the schema
npx drizzle-kit migrate    # apply them
```

During development you can use `npx drizzle-kit push` to sync the schema directly, without migration files.

### 5. Run the app

```bash
npm run dev
```

Open <http://localhost:3000>.

---

## Email setup (Resend)

Email is used for two things: **sending invite links** and **sign-in links for people who lost their cookie**. Pick the mode that fits.

### Mode 1: Console (no account needed, best for development)

Leave `RESEND_API_KEY` empty. Nothing is sent. The email, including its link, appears at:

**<http://localhost:3000/dev/emails>** (reload the page after triggering an email)

You can use any fake address, such as `meena@test.com`, and as many fake people as you like.

### Mode 2: Resend sandbox (real email, only to yourself)

1. Create a free account at [resend.com](https://resend.com) and make an API key.
2. Set it in `.env.local`:

   ```dotenv
   RESEND_API_KEY=re_xxxxxxxxxxxx
   EMAIL_FROM="Splity <onboarding@resend.dev>"
   ```

3. Restart the dev server.

Without a verified domain, Resend only delivers to **the email address you signed up to Resend with**. Any other recipient fails with a `403` error. So when testing, use that exact address as the participant's email, and test with one participant.

### Mode 3: Your own domain (real email to anyone)

1. In the Resend dashboard, open **Domains** and add a domain or subdomain you own, for example `mail.yourdomain.com`.
2. Add the DNS records Resend shows (SPF and DKIM) at your DNS provider, then click **Verify**.
3. Set the sender and the public URL:

   ```dotenv
   RESEND_API_KEY=re_xxxxxxxxxxxx
   EMAIL_FROM="Splity <noreply@mail.yourdomain.com>"
   NEXT_PUBLIC_APP_URL=https://your-real-url
   ```

The free plan allows 3,000 emails per month and 100 per day, with one verified domain. Check Resend's pricing page for current limits. Splity only sends email for invites and sign-in links to stay under them.

---

## Testing guide

### Test two people on one computer

Each browser profile has its own cookies, so a normal window and an incognito window act as two different people.

- **Window A** (normal browser): the organiser.
- **Window B** (incognito): a friend.

Use `http://localhost:3000` in both. `127.0.0.1` is a different cookie jar. Close all other incognito windows first, because incognito windows share cookies with each other. For a third person, use a different browser (Firefox or Edge).

**Part 1: joining (no email needed)**

1. **Window A:** create an event with participants such as `Ravi` (you), `Meena` and `Kavi`.
2. **Window A:** open `/<event id>/invite` and click **Create invite link**. Copy the link from the text box.
3. **Window B:** paste the link. You see `Meena` and `Kavi`. `Ravi` is hidden because he's the organiser.
4. **Window B:** pick `Meena` and click **Join event**. The email is optional.
5. **Window B:** add an expense and check it saves.
6. **Window A:** open the event and check that Meena's expense appears.

**Part 2: lost cookie and email recovery**

1. **Window B:** join with an email (console mode: `meena@test.com`; sandbox mode: your Resend account email).
2. **Window B:** open DevTools, then **Application** (Chrome) or **Storage** (Firefox), then **Cookies**, then `localhost`. Delete `member_<event id>`.
3. **Window B:** reload the event page. You're sent to `/no-access`.
4. **Window B:** open the invite link again. `Meena` is no longer listed, because the name is claimed.
5. **Window B:** under **Already joined before?**, enter the same email and click **Send link**.
6. Get the email:
   - Console mode: open `/dev/emails` in Window A.
   - Real email: open your inbox and check spam.
7. **Right-click the link, choose Copy link address, and paste it into Window B.** Don't click it. Clicking opens your normal browser and would sign Window A in as Meena.
8. **Window B:** click **Continue as Meena**. You're back in.

**Part 3: checks that matter**

| Check | Expected result |
|---|---|
| Open the same recovery link twice | Second time says it has expired |
| Organiser clicks **Reset** next to Meena | Meena's window is sent to `/no-access`, and her name is free to claim again |
| Organiser clicks **Revoke link** | The old invite link says it isn't valid |
| In DevTools, change the hidden `event_id` to another event and submit | "You don't have access to this event" |
| Use the old `member_` cookie value after recovery | Treated as not joined (recovery replaces the session) |
| Mark a settlement, then open it and press **Undo** | The debt reappears with its Mark button, and history shows both actions |

### Test receipt OCR

1. Open the OCR page and upload a clear, well-lit receipt photo (PNG or JPEG).
2. Click **Analyze**. The detected total appears in an editable field.
3. If it's wrong, edit it by hand. Blurry photos, faint thermal paper and curved receipts are the usual causes.

---

## Dev-only routes

These work only when `NODE_ENV` isn't `production`. Delete the claim route before deploying.

| Route | What it does |
|---|---|
| `/dev/emails` | Shows emails that console mode would have sent |
| `/dev/claim-owner/<event id>` | Makes this browser the owner of an old event created before the owner setup |

---

## Project structure

```
app/
  (app)/
    [slug]/(group)/      event pages: entries, new, edit, delete, history,
                         insight, invite, manage
    join/[token]/        invite page: pick your name
    recover/[token]/     sign-in link landing page
    no-access/           shown to people without access
    dev/                 dev-only helpers
  _components/           shared UI (ActionForm, NotificationProvider, SplitBox, ...)
  _orm/                  database schema and queries
  _types/                shared types
lib/
  members.ts             cookies, tokens, access checks
  email.ts               Resend wrapper and console mode
  split.ts               cent-exact split calculation
  balances.ts            balances and minimum settlements
  entries.ts             payments and settlements in one list
```

Your actual folder names may differ slightly. Adjust this section to match the repo.

---

## Security notes

- Invite, owner, member and recovery tokens are random 32-byte values. Only their **hashes** are stored.
- Cookies are `httpOnly`, so page scripts can't read them.
- A name is claimed with a single atomic database update, so two people can't take the same name.
- Server actions read identity from the cookie, never from form fields, and check that the person belongs to that event.
- Recovery links work once, expire after 30 minutes, and are limited to one request per minute per person. The form gives the same answer whether or not an email matches.
- The recovery page asks for a click before using up the token, so email scanners that pre-open links can't burn it.
- Writes use database transactions and **idempotency keys**, so a double click can't create the same expense twice.

---

## Troubleshooting

| Problem | Likely cause |
|---|---|
| `/join/<token>` gives 404 | The page must be at `app/(app)/join/[token]/page.tsx`, not inside `[slug]`. Restart the dev server after moving folders. |
| Links in emails point to the wrong address | `NEXT_PUBLIC_APP_URL` is wrong. Fix it and restart. |
| `403 ... testing emails to your own email address` | Sandbox mode with a recipient that isn't your Resend account email. |
| `/dev/emails` is empty | `RESEND_API_KEY` is set (so mail is really sent), or the email didn't match a joined member, or you asked twice in one minute. |
| Window B goes straight into the event | An old incognito window still has cookies. Close all incognito windows. |
| `ECONNREFUSED` on port 5432 | The database container isn't running. Run `docker start splity-db`. |
| `password authentication failed` | `DATABASE_URL` doesn't match the container's password. |
| `relation ... does not exist` | Migrations haven't been applied. Run `npx drizzle-kit migrate` or `push`. |
| Port 5432 already in use | Another Postgres is running. Use `-p 5433:5432` and update `DATABASE_URL`. |

---

## Limitations and ideas

- Identity is cookie-based. If the **organiser** clears their cookies, there is no recovery path yet (an email-based owner recovery would fix this).
- The minimum-settlement method is greedy. It gives at most (people - 1) payments and is optimal for almost every real group.
- OCR reads only the total, and accuracy depends on photo quality.
- Possible next steps: editing settlements, push notifications, multi-currency, export to Excel.

---

## License

Add a license of your choice (MIT is common for portfolio projects).