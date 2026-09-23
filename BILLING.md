# Subscription billing foundation

Digital Step currently has **no configured payment provider**. Checkout therefore fails closed with
`BILLING_UNAVAILABLE`; neither a checkout return page nor browser state can activate a plan.

## Effective plan precedence

1. A non-expired administrator override.
2. An `ACTIVE`, non-expired paid `Subscription` populated by a future trusted provider integration.
3. `FREE` (no fake subscription row is required).

The legacy `User.subscriptionPlan` column remains for deployment compatibility, but entitlement
decisions use the centralized resolver. The migration preserves existing paid assignments as explicit
manual overrides.

## Provider integration contract

Implement `BillingProvider` in `server/billing/provider.ts`, set `configured` only after its backend
credentials are validated, and provide hosted checkout creation. A provider integration must also add
a signature-verifying webhook, idempotent event persistence, and trusted subscription updates before
enabling checkout. Provider prices/product identifiers remain an unresolved product decision: paid
catalog prices are intentionally `null` rather than invented.

No payment environment variables are required today. Future provider secrets must be Railway backend
variables and must never use a `VITE_` prefix. Subscription billing is separate from marketplace order
payments, and the application stores no card credentials.

Production schema deployment remains `npx prisma migrate deploy`.
