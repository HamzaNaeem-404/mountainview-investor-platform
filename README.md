# Mountain View — Investor Operations Demo

Staff-facing, frontend-only CRM prototype for **Mountain View Investment Services** (Georgia). It illustrates how advisers can manage an existing GCC investor mandate, compare linked properties, select one for due diligence, track opportunity-scoped checklists, log document sharing separately from receipt, and manage follow-ups.

**Illustrative Demo — Fictional Data.** Not a production system and not a public investor portal.

## What this demo illustrates

- One investor linked to multiple properties through distinct `InvestorOpportunity` records
- Mandate fit comparison across P-101, P-102, and P-103
- Selecting P-102 for due diligence without corrupting other opportunities
- Checklist progress scoped per opportunity (`Received` ≠ shared)
- Explicit **Log as Shared** workflow with channel + version
- Follow-up completion / reschedule with recalculated next action
- `localStorage` persistence and **Reset Demo Data**

## How to run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production check:

```bash
npm run build
npm start
```

## Functional walkthrough

1. Open **Investors** → Leila Al Mansouri
2. Review her mandate and compare P-101 / P-102 / P-103
3. On P-102 click **Select for Due Diligence**
4. Open the P-102 checklist (starts at **3 of 6** received or reviewed)
5. Change **Encumbrance check** to **Received** → progress becomes **4 of 6**
6. Confirm sharing history did **not** gain a new row from that status change
7. Click **Log as Shared** → Rental forecast · WhatsApp · v1
8. See the new share event and activity timeline entry
9. Complete a P-102 follow-up and observe the updated next action
10. Open P-101 and confirm its checklist / sharing history are independent
11. Refresh the browser — changes persist
12. Click **Reset Demo Data** to restore the seed state

## Mocked / illustrative features

- All investors, properties, prices, and documents are fictional
- No authentication, uploads, email, WhatsApp, payments, or external APIs
- “Log as Shared” records a local event only — delivery is never verified
- Checklist completion never implies legal clearance or investment suitability

## Technical assumptions

- Next.js App Router + TypeScript + Tailwind CSS + shadcn-style Radix UI
- Domain fixtures in `src/data/fixtures.ts`
- Client state + persistence in `src/lib/store.tsx` (`mv-investor-ops-demo-v1`)
- SEO `noindex, nofollow` metadata for client-demo safety

## Reset the demo

Use the **Reset Demo Data** button in the header, or clear `localStorage` key `mv-investor-ops-demo-v1`.

## Deploy the frontend

Any static/Node host that supports Next.js works (Vercel, Netlify, etc.):

```bash
npm run build
```

Deploy the build output / connect the Git repo. No database or secrets required.

## Assumptions to validate before a real CRM

1. Source of truth for investor/mandate data and access control
2. Document storage, versioning, and retention policy
3. Whether sharing should integrate with WhatsApp/email — and audit requirements
4. Legal language around diligence status (never auto-approve investments)
5. Multi-user ownership, notifications, and role permissions
6. Localization / multi-currency rules for GCC → Georgia advisory workflows
