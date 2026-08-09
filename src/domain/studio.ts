export type AIStudioTask='CHAT'|'STRUCTURED_TEXT'|'CONTENT_GENERATION'|'BUSINESS_ANALYSIS'|'MARKETING_PLANNING'
export type BusinessGoal='INCREASE_SALES'|'ACQUIRE_CUSTOMERS'|'BRAND_AWARENESS'|'SOCIAL_GROWTH'|'ONLINE_SALES'|'LAUNCH_PRODUCT'|'AUTOMATE_PROCESSES'
export interface BusinessContext { name:string;industry:string;description:string;audience:string;goals:BusinessGoal[];language:'ka'|'en' }
export interface GenerationRequest { task:AIStudioTask;businessContext?:BusinessContext;inputs:Record<string,string|string[]> }
export interface GenerationResult { status:'EMPTY'|'PENDING'|'COMPLETE'|'ERROR';sections:Record<string,string> }
