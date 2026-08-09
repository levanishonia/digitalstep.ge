import { Router } from 'express'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'
import { createBusinessProfileSchema,updateBusinessProfileSchema } from '../validation/businessProfile.js'
export const businessProfileRouter=Router()
businessProfileRouter.use(requireAuth)
const select={id:true,name:true,industry:true,description:true,website:true,locationMarket:true,productsServices:true,primaryOffer:true,targetAudience:true,audienceLocation:true,customerProblem:true,goals:true,brandTone:true,brandToneNotes:true,preferredContentLanguage:true,brandValues:true,socialPlatforms:true,competitors:true,createdAt:true,updatedAt:true} as const
const safe=(profile:Record<string,unknown>)=>({...profile,competitors:Array.isArray(profile.competitors)?profile.competitors:[]})
businessProfileRouter.get('/',async(req,res)=>{const profile=await prisma.businessProfile.findUnique({where:{userId:req.auth!.userId},select});return res.json({data:{businessProfile:profile?safe(profile):null}})})
businessProfileRouter.post('/',async(req,res)=>{const parsed=createBusinessProfileSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:{code:'INVALID_BUSINESS_PROFILE'}});try{const profile=await prisma.businessProfile.create({data:{...parsed.data,competitors:parsed.data.competitors as Prisma.InputJsonValue,userId:req.auth!.userId},select});return res.status(201).json({data:{businessProfile:safe(profile)}})}catch(error){if(error instanceof Prisma.PrismaClientKnownRequestError&&error.code==='P2002')return res.status(409).json({error:{code:'BUSINESS_PROFILE_ALREADY_EXISTS'}});throw error}})
businessProfileRouter.patch('/',async(req,res)=>{const parsed=updateBusinessProfileSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:{code:'INVALID_BUSINESS_PROFILE'}});const existing=await prisma.businessProfile.findUnique({where:{userId:req.auth!.userId},select:{id:true}});if(!existing)return res.status(404).json({error:{code:'BUSINESS_PROFILE_NOT_FOUND'}});const data={...parsed.data,...('competitors'in parsed.data?{competitors:parsed.data.competitors as Prisma.InputJsonValue}:{})};const profile=await prisma.businessProfile.update({where:{userId:req.auth!.userId},data,select});return res.json({data:{businessProfile:safe(profile)}})})
