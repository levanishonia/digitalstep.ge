# Provider order assignment and deployment

Provider identity uses the existing authenticated `User` and `UserRole.PROVIDER`. A provider has an optional, unique `providerSlug`, which is an internal link to the trusted catalog's stable `providerSlug`. Operations assigns this value once when onboarding a catalog provider; clients never submit it when creating or updating an order.

Order creation resolves the catalog service and package on the server, then looks up a `PROVIDER` user by the trusted catalog slug. The resulting user ID is stored in nullable `Order.providerUserId`; price and provider identity are never accepted from the request. Provider APIs always query by both order ID and the authenticated provider user ID.

Legacy orders and providers remain valid because both new columns are nullable. An order without `providerUserId` remains visible to its customer but is intentionally absent from provider dashboards. Snapshot fields (`providerName` and `providerSlug`) remain unchanged for history. Deleting a provider sets the relation to null rather than deleting an order.

Deploy the backward-compatible migration before starting the new application version:

```sh
npx prisma migrate deploy
```

Then start the existing compiled Express production server. Railway's `PORT`, API routing, static Vite assets, and SPA fallback are unchanged.
