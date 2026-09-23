import type { SubscriptionPlan } from '../../shared/subscriptions.js'

export type BillingErrorCode = 'BILLING_UNAVAILABLE'|'INVALID_PLAN'|'CHECKOUT_CREATION_FAILED'|'PAYMENT_FAILED'|'SUBSCRIPTION_NOT_FOUND'|'SUBSCRIPTION_ALREADY_ACTIVE'|'INVALID_SUBSCRIPTION_STATE'|'FORBIDDEN'|'UNAUTHENTICATED'
export interface CheckoutRequest { userId:string; plan:Exclude<SubscriptionPlan,'FREE'>; amountMinor:number; currency:string; successUrl:string; cancelUrl:string }
export interface CheckoutResult { checkoutId:string; redirectUrl:string }
export interface BillingProvider {
  readonly name:string
  readonly configured:boolean
  createCheckout(input:CheckoutRequest):Promise<CheckoutResult>
}

/** No payment provider exists in the repository yet. This adapter fails closed. */
class UnavailableBillingProvider implements BillingProvider {
  readonly name='UNCONFIGURED'
  readonly configured=false
  async createCheckout(input:CheckoutRequest):Promise<CheckoutResult>{ void input; throw new BillingProviderError('BILLING_UNAVAILABLE') }
}
export class BillingProviderError extends Error { constructor(readonly code:BillingErrorCode){super(code)} }
export const billingProvider:BillingProvider=new UnavailableBillingProvider()
