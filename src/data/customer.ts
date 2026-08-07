import type { Locale, LocalizedText } from '../i18n'

export type OrderStatus = 'new' | 'inProgress' | 'inReview' | 'completed' | 'cancelled'
export type ActivityType = 'created' | 'updated' | 'favorite' | 'message'
export interface Customer { id:string; firstName:LocalizedText; lastName:LocalizedText; email:string; phone:string; preferredLocale:Locale; avatar?:string }
export interface Attachment { id:string; filename:string; type:string; size:string }
export interface Order { id:string; orderNumber:string; serviceId:string; serviceSlug:string; serviceTitle:LocalizedText; providerId:string; providerName:string; packageName:LocalizedText; price:number; createdAt:string; deliveryDate:string; status:OrderStatus; progress:number; preview:string; requirements:LocalizedText; referenceLinks:string[]; attachments:Attachment[] }
export interface Activity { id:string; type:ActivityType; createdAt:string; detail:LocalizedText }

const l=(ka:string,en:string):LocalizedText=>({ka,en})
export const mockCustomer:Customer={id:'customer-demo-1',firstName:l('ლევან','Levan'),lastName:l('შონია','Shonia'),email:'demo@digitalstep.ge',phone:'+995 5XX XX XX XX',preferredLocale:'ka'}
export const mockOrders:Order[]=[
 {id:'order-demo-1',orderNumber:'DS-2026-1042',serviceId:'business-website',serviceSlug:'business-website-development',serviceTitle:l('ბიზნეს ვებსაიტის შექმნა','Business Website Development'),providerId:'webcraft',providerName:'WebCraft',packageName:l('სტანდარტი','Standard'),price:799,createdAt:'2026-07-28T10:00:00Z',deliveryDate:'2026-08-12T10:00:00Z',status:'inProgress',progress:55,preview:'web',requirements:l('თანამედროვე, მობილურზე მორგებული საიტი მცირე ბიზნესისთვის.','A modern, mobile-ready website for a small business.'),referenceLinks:['digitalstep.ge/reference'],attachments:[{id:'a1',filename:'brand-guide.pdf',type:'PDF',size:'2.4 MB'}]},
 {id:'order-demo-2',orderNumber:'DS-2026-1051',serviceId:'social-management',serviceSlug:'social-media-management',serviceTitle:l('სოციალური მედიის მართვა','Social Media Management'),providerId:'growth-studio',providerName:'Growth Studio',packageName:l('პრემიუმი','Premium'),price:349,createdAt:'2026-08-01T12:00:00Z',deliveryDate:'2026-08-09T12:00:00Z',status:'inReview',progress:80,preview:'social',requirements:l('აგვისტოს კონტენტ-გეგმა და 12 პოსტი.','August content plan and 12 posts.'),referenceLinks:[],attachments:[{id:'a2',filename:'content-brief.docx',type:'DOCX',size:'840 KB'}]},
 {id:'order-demo-3',orderNumber:'DS-2026-0998',serviceId:'seo-audit',serviceSlug:'seo-audit-optimization',serviceTitle:l('SEO აუდიტი და ოპტიმიზაცია','SEO Audit & Optimization'),providerId:'digital-step',providerName:'Digital Step Team',packageName:l('საბაზისო','Basic'),price:249,createdAt:'2026-06-18T09:00:00Z',deliveryDate:'2026-06-24T09:00:00Z',status:'completed',progress:100,preview:'seo',requirements:l('ტექნიკური SEO აუდიტი და რეკომენდაციები.','Technical SEO audit and recommendations.'),referenceLinks:[],attachments:[]},
 {id:'order-demo-4',orderNumber:'DS-2026-1060',serviceId:'brand-identity',serviceSlug:'brand-identity-design',serviceTitle:l('ბრენდის იდენტობის დიზაინი','Brand Identity Design'),providerId:'brand-works',providerName:'Brand Works',packageName:l('საბაზისო','Basic'),price:449,createdAt:'2026-08-04T08:30:00Z',deliveryDate:'2026-08-18T08:30:00Z',status:'new',progress:10,preview:'brand',requirements:l('ლოგო და ძირითადი ვიზუალური სისტემა.','Logo and core visual identity system.'),referenceLinks:[],attachments:[]},
]
export const mockActivities:Activity[]=[
 {id:'act-1',type:'updated',createdAt:'2026-08-05T13:30:00Z',detail:l('DS-2026-1051 შემოწმებაზე გადავიდა','DS-2026-1051 moved to review')},
 {id:'act-2',type:'created',createdAt:'2026-08-04T08:30:00Z',detail:l('შეიქმნა DS-2026-1060','DS-2026-1060 was created')},
 {id:'act-3',type:'favorite',createdAt:'2026-08-02T16:00:00Z',detail:l('AI კონტენტის ასისტენტი','AI Content Assistant')},
 {id:'act-4',type:'message',createdAt:'2026-08-01T14:15:00Z',detail:l('ახალი შეტყობინება WebCraft-ისგან','New message from WebCraft')},
]
