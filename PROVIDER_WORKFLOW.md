# Provider order assignment and deployment

Provider identity uses the existing authenticated `User` and `UserRole.PROVIDER`. A provider has an optional, unique `providerSlug`, which is an internal link to the trusted catalog's stable `providerSlug`. Operations assigns this value once when onboarding a catalog provider; clients never submit it when creating or updating an order.

Order creation resolves the catalog service and package on the server, then looks up a `PROVIDER` user by the trusted catalog slug. The resulting user ID is stored in nullable `Order.providerUserId`; price and provider identity are never accepted from the request. Provider APIs always query by both order ID and the authenticated provider user ID.

Digital Step's official catalog entries use the reserved `digital-step-team` provider slug. Operations must provision and verify an internal `PROVIDER` account with that slug before accepting official-service orders. Official order creation fails safely with `INTERNAL_PROVIDER_UNAVAILABLE` when that processor is missing, rather than creating an order that no provider workflow can see. Once provisioned, official orders appear in that internal account's existing provider order list and use the same ownership and status-transition protections as other assigned orders.

Legacy orders and providers remain valid because both new columns are nullable. An order without `providerUserId` remains visible to its customer but is intentionally absent from provider dashboards. Snapshot fields (`providerName` and `providerSlug`) remain unchanged for history. Deleting a provider sets the relation to null rather than deleting an order.

Deploy the backward-compatible migration before starting the new application version:

```sh
npx prisma migrate deploy
```

Then start the existing compiled Express production server. Railway's `PORT`, API routing, static Vite assets, and SPA fallback are unchanged.
