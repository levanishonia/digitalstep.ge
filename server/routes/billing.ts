import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { billingProvider, BillingProviderError } from '../billing/provider.js'
import { getSubscriptionState } from '../billing/subscriptionService.js'
import { planDefinitions } from '../../shared/subscriptions.js'

export const billingRouter=Router()
billingRouter.use(requireAuth)
const checkoutSchema=z.object({plan:z.enum(['PRO','BUSINESS'])}).strict()
billingRouter.post('/checkout',async(req,res,next)=>{
  const parsed=checkoutSchema.safeParse(req.body)
  if(!parsed.success)return res.status(400).json({error:{code:'INVALID_PLAN'}})
  try{
    const state=await getSubscriptionState(req.auth!.userId)
    if(!state)return res.status(401).json({error:{code:'UNAUTHENTICATED'}})
    if(state.effective.plan===parsed.data.plan)return res.status(409).json({error:{code:'SUBSCRIPTION_ALREADY_ACTIVE'}})
    const product=planDefinitions[parsed.data.plan]
    if(!billingProvider.configured||!product.purchasable||product.priceMinor===null)return res.status(503).json({error:{code:'BILLING_UNAVAILABLE'}})
    const origin=`${req.protocol}://${req.get('host')}`
    const checkout=await billingProvider.createCheckout({userId:req.auth!.userId,plan:parsed.data.plan,amountMinor:product.priceMinor,currency:product.currency,successUrl:`${origin}/billing/success`,cancelUrl:`${origin}/billing/cancel`})
    return res.status(201).json({data:{redirectUrl:checkout.redirectUrl}})
  }catch(error){if(error instanceof BillingProviderError)return res.status(error.code==='BILLING_UNAVAILABLE'?503:502).json({error:{code:error.code}});next(error)}
})
