export const postPlatforms=['FACEBOOK','INSTAGRAM','TIKTOK','LINKEDIN'] as const
export const postObjectives=['SALES','AWARENESS','ENGAGEMENT','PROMOTION','ANNOUNCEMENT','EDUCATION'] as const
export const postLanguages=['KA','EN','KA_EN'] as const
export const postTones=['BUSINESS_PROFILE_DEFAULT','PROFESSIONAL','FRIENDLY','PREMIUM','PLAYFUL','DIRECT','EDUCATIONAL'] as const
export type PostPlatform=typeof postPlatforms[number]
export type PostObjective=typeof postObjectives[number]
export type PostLanguage=typeof postLanguages[number]
export type PostTone=typeof postTones[number]
export interface PostGenerationInput {platform:PostPlatform;objective:PostObjective;language:PostLanguage;tone:PostTone;topic:string;keyMessage?:string;offer?:string;callToAction?:string;customInstructions?:string;variationCount:1|2|3}
export interface PostVariation {headline:string;hook?:string;caption:string;cta:string;hashtags:string[]}
export interface PostGenerationOutput {variations:PostVariation[]}
export interface PostGeneration {id:string;input:PostGenerationInput;output:PostGenerationOutput;createdAt:string}
