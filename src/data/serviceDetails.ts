import type { Localized, Service } from './marketplace'
import { catalogServices } from './marketplace'

export type PackageTier='basic'|'standard'|'premium'
export interface ServicePackage { id:PackageTier; price:number; deliveryDays:number; revisions:number; description:Localized; features:Localized[] }
export interface GalleryItem { id:string; label:Localized; tone:string; video?:boolean }
export interface Review { id:string; author:string; rating:number; date:string; text:Localized; package:PackageTier }
export interface Faq { id:string; question:Localized; answer:Localized }
export interface ServiceDetail { serviceId:string; providerSlug:string; longDescription:Localized; gallery:GalleryItem[]; packages:ServicePackage[]; included:Localized[]; process:Localized[]; reviews:Review[]; faq:Faq[]; relatedIds:string[] }
export interface PortfolioItem { id:string; title:Localized; category:Localized; description:Localized; tone:string }
export interface Provider { id:string; slug:string; name:string; type:Localized; tagline:Localized; description:Localized; location:Localized; responseTime:Localized; completedProjects:number; specializations:Localized[]; languages:string[]; portfolio:PortfolioItem[]; reviews:Review[] }
const l=(ka:string,en:string):Localized=>({ka,en})
const features=[l('კონტენტის გეგმა','Content plan'),l('მორგებული დიზაინი','Custom design'),l('ტექსტების მომზადება','Copywriting'),l('ანგარიშგება','Reporting')]
const process=[l('მოთხოვნების მიღება','Requirements'),l('დაგეგმვა','Planning'),l('შესრულება','Production'),l('შემოწმება','Review'),l('მიწოდება','Delivery')]
const gallery=(tone:string):GalleryItem[]=>[
 {id:'overview',label:l('მომსახურების მთავარი პრევიუ','Service overview preview'),tone},
 {id:'planning',label:l('დაგეგმვის დაფა','Planning board'),tone:`${tone} alt`},
 {id:'results',label:l('შედეგების ანგარიში','Results report'),tone:`${tone} bright`},
 {id:'walkthrough',label:l('პროცესის ვიდეო პრევიუ','Process video preview'),tone:`${tone} video`,video:true},
]
const packages=(base:number):ServicePackage[]=>[
 {id:'basic',price:base,deliveryDays:7,revisions:1,description:l('საწყისი პაკეტი მკაფიო ამოცანისთვის.','A focused starter package for one clear goal.'),features:features.slice(0,2)},
 {id:'standard',price:Math.round(base*1.7),deliveryDays:7,revisions:2,description:l('გაფართოებული პაკეტი სტაბილური შედეგისთვის.','An expanded package for a consistent outcome.'),features:features.slice(0,3)},
 {id:'premium',price:Math.round(base*2.8),deliveryDays:10,revisions:3,description:l('სრული სტრატეგიული მხარდაჭერა და ანგარიში.','Complete strategic support with reporting.'),features},
]
const reviews=(key:string):Review[]=>[
 {id:`${key}-r1`,author:'Nino K.',rating:5,date:'2026-07-18',package:'standard',text:l('პროცესი გასაგები იყო და შედეგი ზუსტად შეესაბამებოდა მოთხოვნას.','The process was clear and the result matched the brief exactly.')},
 {id:`${key}-r2`,author:'Giorgi M.',rating:5,date:'2026-06-29',package:'premium',text:l('კომუნიკაცია და მიწოდებული მასალები ძალიან მოწესრიგებული იყო.','Communication and delivered materials were exceptionally organized.')},
 {id:`${key}-r3`,author:'Anna B.',rating:4,date:'2026-05-11',package:'basic',text:l('კარგი ხარისხი, პრაქტიკული რეკომენდაციები და დროული მიწოდება.','Good quality, practical recommendations, and on-time delivery.')},
]
const faqs=(key:string):Faq[]=>[
 {id:`${key}-f1`,question:l('დასაწყებად რა ინფორმაციაა საჭირო?','What information is needed to start?'),answer:l('შეგროვდება მიზანი, ბრენდის მასალები, აუდიტორია და სასურველი შედეგი.','We will collect your goal, brand assets, audience, and desired outcome.')},
 {id:`${key}-f2`,question:l('რამდენ ხანს გრძელდება მიწოდება?','How long does delivery take?'),answer:l('ვადა არჩეულ პაკეტზეა დამოკიდებული და შეკვეთამდე მკაფიოდ ჩანს.','Timing depends on the selected package and is shown before ordering.')},
 {id:`${key}-f3`,question:l('შესწორებები შედის პაკეტში?','Are revisions included?'),answer:l('დიახ, თითოეულ პაკეტში მითითებულია შესწორებების რაოდენობა.','Yes. Each package clearly states its included revision count.')},
 {id:`${key}-f4`,question:l('შეიძლება ინდივიდუალური პაკეტის მოთხოვნა?','Can I request a custom package?'),answer:l('კონსულტაციის ფუნქციის დამატების შემდეგ შესაძლებელი იქნება საჭიროების განხილვა.','Once consultation is available, you will be able to discuss a tailored scope.')},
]
const slugify=(value:string)=>value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
export const serviceDetails:ServiceDetail[]=catalogServices.map(service=>({
 serviceId:service.id,
 providerSlug:slugify(service.provider),
 longDescription:l('ეს მომსახურება აერთიანებს სტრატეგიულ დაგეგმვასა და პრაქტიკულ შესრულებას. სამუშაო იწყება მკაფიო მოთხოვნებით და სრულდება გამოსაყენებლად მზად მასალებით.','This service combines strategic planning with practical execution. Work begins with a clear brief and ends with ready-to-use deliverables.'),
 gallery:gallery(service.preview),
 packages:packages(service.price),
 included:features,
 process,
 reviews:reviews(service.id),
 faq:faqs(service.id),
 relatedIds:catalogServices.filter(candidate=>candidate.id!==service.id&&candidate.category===service.category).concat(catalogServices.filter(candidate=>candidate.id!==service.id&&candidate.category!==service.category)).slice(0,4).map(candidate=>candidate.id),
}))
const portfolio=(tone:string):PortfolioItem[]=>[
 {id:`${tone}-1`,title:l('ზრდის კამპანია','Growth Campaign'),category:l('სტრატეგია','Strategy'),description:l('ერთიანი ვიზუალური და საკომუნიკაციო სისტემა.','A cohesive visual and communication system.'),tone},
 {id:`${tone}-2`,title:l('ციფრული განახლება','Digital Refresh'),category:l('დიზაინი','Design'),description:l('მობილურზე მორგებული ციფრული გამოცდილება.','A mobile-ready digital experience.'),tone:`${tone} alt`},
 {id:`${tone}-3`,title:l('შედეგების დაფა','Results Dashboard'),category:l('ანალიტიკა','Analytics'),description:l('მთავარი მაჩვენებლების მარტივი ხედვა.','A clear view of the most important metrics.'),tone:`${tone} bright`},
]
const providerServices=[...new Map(catalogServices.map(service=>[service.provider,service])).values()]
export const providers:Provider[]=providerServices.map(service=>{
 const slug=slugify(service.provider)
 return {id:slug,slug,name:service.provider,type:l('ციფრული სააგენტო','Digital agency'),tagline:l('მკაფიო სტრატეგია, ხარისხიანი შესრულება.','Clear strategy, thoughtful execution.'),description:l('ვქმნით პრაქტიკულ ციფრულ გადაწყვეტილებებს ბიზნესის გაზომვადი მიზნებისთვის. ყველა მონაცემი ამ პროფილზე სადემონსტრაციოა.','We create practical digital solutions for measurable business goals. All profile data shown here is demonstrative.'),location:l('თბილისი, საქართველო','Tbilisi, Georgia'),responseTime:l('დაახლოებით 2 საათი','About 2 hours'),completedProjects:128,specializations:[l('სტრატეგია','Strategy'),l('დიზაინი','Design'),l('ზრდა','Growth')],languages:['ქართული','English'],portfolio:portfolio(service.preview),reviews:reviews(slug)}
})
export const getServiceBySlug=(slug:string)=>catalogServices.find(service=>service.slug===slug)
export const getServiceDetail=(serviceId:string)=>serviceDetails.find(detail=>detail.serviceId===serviceId)
export const getProviderBySlug=(slug:string)=>providers.find(provider=>provider.slug===slug)
export const getServicesByProvider=(provider:Provider):Service[]=>catalogServices.filter(service=>service.provider===provider.name)
export const getRelatedServices=(detail:ServiceDetail):Service[]=>detail.relatedIds.map(id=>catalogServices.find(service=>service.id===id)).filter((service):service is Service=>Boolean(service))
