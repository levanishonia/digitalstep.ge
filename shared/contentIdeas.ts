export const ideaPlatforms=['FACEBOOK','INSTAGRAM','TIKTOK','LINKEDIN','YOUTUBE','GOOGLE','OTHER'] as const
export const ideaObjectives=['SALES','AWARENESS','ENGAGEMENT','EDUCATION','TRUST','PRODUCT_PROMOTION','COMMUNITY','LEAD_GENERATION'] as const
export const ideaTimeframes=['THIS_WEEK','NEXT_WEEK','THIS_MONTH','CUSTOM'] as const
export const contentTypes=['POST','STORY','REEL','CAROUSEL','VIDEO','ARTICLE'] as const
export const contentPillars=['EDUCATIONAL','PROMOTIONAL','BEHIND_THE_SCENES','PRODUCT_FOCUS','CUSTOMER_PROBLEMS','BRAND_STORY','ENGAGEMENT','TRUST','TIPS','OFFERS'] as const
export type ContentIdeaInput={platforms:(typeof ideaPlatforms)[number][];objective:(typeof ideaObjectives)[number];contentPillars:(typeof contentPillars)[number][];timeframe:(typeof ideaTimeframes)[number];ideaCount:3|5|10;customInstructions?:string;language?:'KA'|'EN'}
export type ContentIdea={title:string;concept:string;platforms:(typeof ideaPlatforms)[number][];contentType:(typeof contentTypes)[number];objective:(typeof ideaObjectives)[number];hook:string;keyMessage:string;suggestedCta:string;recommendedDate:string|null}
export type ContentIdeaGeneration={id:string;input:ContentIdeaInput;output:{ideas:ContentIdea[]};createdAt:string}
