import type { Locale } from '../i18n'
export type Localized = Record<Locale, string>
export type IconName = 'megaphone'|'code'|'palette'|'share'|'search'|'ads'|'video'|'workflow'|'sparkles'|'briefcase'|'target'|'users'|'globe'|'rocket'
export type Badge = 'popular'|'bestseller'|'new'|'fastDelivery'|'aiService'
export interface Category { id: string; icon: IconName; name: Localized; description: Localized; count: number }
export type ProviderType = 'agency'|'specialist'|'digitalStep'
export type ServiceType = 'oneTime'|'monthly'|'consultation'
export type ServiceSource = 'DIGITAL_STEP'|'VERIFIED_PROVIDER'
export interface Service { id: string; slug: string; title: Localized; description: Localized; provider: string; category: string; rating: number; reviews: number; price: number; deliveryDays: number; providerType: ProviderType; serviceSource:ServiceSource; providerStatus?:'PENDING'|'VERIFIED'|'SUSPENDED'; serviceType: ServiceType; badges: Badge[]; preview: string; createdOrder: number }
export interface Goal { id: string; icon: IconName; title: Localized; description: Localized }
export interface Step { id: string; icon: IconName; title: Localized; description: Localized }
const l = (ka:string,en:string):Localized => ({ka,en})
export const categories: Category[] = [
 ['marketing','megaphone','მარკეტინგი','Marketing',24],['web','code','ვებსაიტების შექმნა','Website Development',18],['design','palette','დიზაინი','Design',31],['social','share','სოციალური მედია','Social Media',22],['seo','search','SEO','SEO',14],['advertising','ads','რეკლამა','Advertising',16],['video','video','ვიდეო და ანიმაცია','Video & Animation',12],['automation','workflow','ავტომატიზაცია','Automation',9],['ai','sparkles','AI მომსახურებები','AI Services',11],['consulting','briefcase','ბიზნეს კონსულტაცია','Business Consulting',8],
].map(([id,icon,ka,en,count])=>({id:id as string,icon:icon as IconName,name:l(ka as string,en as string),description:l('შერჩეული ციფრული გადაწყვეტილებები','Curated digital solutions'),count:count as number}))
export const popularServices: Service[] = [
 {id:'social-management',slug:'social-media-management',title:l('სოციალური მედიის მართვა','Social Media Management'),description:l('სტრატეგია, კონტენტი და ყოველდღიური მართვა შენი ბრენდისთვის.','Strategy, content, and day-to-day management for your brand.'),provider:'Growth Studio',category:'social',rating:4.9,reviews:84,price:299,deliveryDays:3,providerType:'agency',serviceSource:'VERIFIED_PROVIDER',providerStatus:'VERIFIED',serviceType:'monthly',badges:['popular','fastDelivery'],preview:'social',createdOrder:8},
 {id:'business-website',slug:'business-website-development',title:l('ბიზნეს ვებსაიტის შექმნა','Business Website Development'),description:l('სწრაფი, თანამედროვე და მობილურზე მორგებული ბიზნეს ვებსაიტი.','A fast, modern, mobile-ready website for your business.'),provider:'WebCraft',category:'web',rating:4.8,reviews:61,price:799,deliveryDays:7,providerType:'agency',serviceSource:'VERIFIED_PROVIDER',providerStatus:'VERIFIED',serviceType:'oneTime',badges:['popular'],preview:'web',createdOrder:6},
 {id:'seo-audit',slug:'seo-audit-optimization',title:l('SEO აუდიტი და ოპტიმიზაცია','SEO Audit & Optimization'),description:l('ტექნიკური აუდიტი და პრაქტიკული გეგმა ორგანული ზრდისთვის.','A technical audit and practical roadmap for organic growth.'),provider:'Digital Step Team',category:'seo',rating:4.9,reviews:47,price:249,deliveryDays:3,providerType:'digitalStep',serviceSource:'DIGITAL_STEP',serviceType:'consultation',badges:['new'],preview:'seo',createdOrder:19},
 {id:'brand-identity',slug:'brand-identity-design',title:l('ბრენდის იდენტობის დიზაინი','Brand Identity Design'),description:l('ერთიანი ვიზუალური სისტემა დასამახსოვრებელი ბრენდისთვის.','A cohesive visual system for a memorable brand.'),provider:'Brand Works',category:'design',rating:4.7,reviews:38,price:449,deliveryDays:7,providerType:'agency',serviceSource:'VERIFIED_PROVIDER',providerStatus:'VERIFIED',serviceType:'oneTime',badges:['popular'],preview:'brand',createdOrder:5},
]
export const bestsellerServices: Service[] = [
 {id:'ad-campaign',slug:'advertising-campaign-setup',title:l('სარეკლამო კამპანიის გამართვა','Advertising Campaign Setup'),description:l('კამპანიის სტრუქტურა, აუდიტორიები და ანალიტიკის გამართვა.','Campaign structure, audiences, and analytics setup.'),provider:'Growth Studio',category:'advertising',rating:5,reviews:112,price:349,deliveryDays:1,providerType:'agency',serviceSource:'VERIFIED_PROVIDER',providerStatus:'VERIFIED',serviceType:'oneTime',badges:['bestseller','fastDelivery'],preview:'ads',createdOrder:3},
 {id:'promo-video',slug:'short-promotional-video',title:l('მოკლე სარეკლამო ვიდეო','Short Promotional Video'),description:l('დინამიკური ვიდეო სოციალური არხებისა და რეკლამისთვის.','A dynamic video for social channels and advertising.'),provider:'Motion Lab',category:'video',rating:4.9,reviews:76,price:399,deliveryDays:7,providerType:'agency',serviceSource:'VERIFIED_PROVIDER',providerStatus:'VERIFIED',serviceType:'oneTime',badges:['bestseller'],preview:'video',createdOrder:4},
 {id:'process-automation',slug:'business-process-automation',title:l('ბიზნეს პროცესების ავტომატიზაცია','Business Process Automation'),description:l('რუტინული პროცესების გამარტივება no-code ინსტრუმენტებით.','Streamline routine processes with no-code tools.'),provider:'Digital Step Team',category:'automation',rating:4.8,reviews:43,price:599,deliveryDays:7,providerType:'digitalStep',serviceSource:'DIGITAL_STEP',serviceType:'consultation',badges:['bestseller'],preview:'automation',createdOrder:7},
 {id:'ai-content',slug:'ai-content-assistant',title:l('AI კონტენტის ასისტენტი','AI Content Assistant'),description:l('შენს პროცესზე მორგებული AI კონტენტის სამუშაო სისტემა.','An AI content workflow tailored to your process.'),provider:'AutomateX',category:'ai',rating:4.8,reviews:35,price:219,deliveryDays:3,providerType:'specialist',serviceSource:'VERIFIED_PROVIDER',providerStatus:'VERIFIED',serviceType:'oneTime',badges:['aiService','new'],preview:'ai',createdOrder:20},
]
const extra = (id:string, ka:string, en:string, provider:string, category:string, rating:number, reviews:number, price:number, deliveryDays:number, providerType:ProviderType, serviceType:ServiceType, preview:string, createdOrder:number, badges:Badge[]=[]):Service => ({id,slug:id,title:l(ka,en),description:l('პრაქტიკული ციფრული მომსახურება მკაფიო შედეგითა და პროცესით.','A practical digital service with a clear process and outcome.'),provider,category,rating,reviews,price,deliveryDays,providerType,serviceSource:providerType==='digitalStep'?'DIGITAL_STEP':'VERIFIED_PROVIDER',providerStatus:providerType==='digitalStep'?undefined:'VERIFIED',serviceType,preview,createdOrder,badges})
export const catalogServices: Service[] = [...popularServices,...bestsellerServices,
 extra('content-strategy','კონტენტის სტრატეგია','Content Strategy','Next Media','marketing',4.6,29,189,3,'specialist','consultation','social',12,['new']),
 extra('email-marketing','ელფოსტის მარკეტინგის სისტემა','Email Marketing System','Growth Studio','marketing',4.5,42,279,7,'agency','monthly','ads',9),
 extra('landing-page','გაყიდვადი ლენდინგ გვერდი','Conversion Landing Page','WebCraft','web',4.9,58,549,7,'agency','oneTime','web',13,['popular']),
 extra('ecommerce-ui','ონლაინ მაღაზიის UI დიზაინი','E-commerce UI Design','Pixel Lab','design',4.7,33,479,7,'specialist','oneTime','brand',10),
 extra('instagram-content','Instagram კონტენტის პაკეტი','Instagram Content Pack','Next Media','social',4.6,67,239,3,'agency','monthly','social',15,['popular']),
 extra('tiktok-plan','TikTok ზრდის გეგმა','TikTok Growth Plan','Growth Studio','social',4.4,25,149,3,'specialist','consultation','video',18,['new']),
 extra('local-seo','ლოკალური SEO გამართვა','Local SEO Setup','Digital Step Team','seo',4.7,31,199,3,'digitalStep','oneTime','seo',11),
 extra('google-ads','Google Ads ოპტიმიზაცია','Google Ads Optimization','Next Media','advertising',4.8,91,329,3,'agency','monthly','ads',2,['bestseller']),
 extra('logo-animation','ლოგოს ანიმაცია','Logo Animation','Motion Lab','video',4.5,44,269,7,'specialist','oneTime','video',14),
 extra('crm-automation','CRM ავტომატიზაციის გამართვა','CRM Automation Setup','AutomateX','automation',4.7,28,649,7,'agency','oneTime','automation',16,['new']),
 extra('ai-chat-workflow','AI სამუშაო პროცესის კონსულტაცია','AI Workflow Consultation','Digital Step Team','ai',4.9,19,179,1,'digitalStep','consultation','ai',21,['aiService','fastDelivery']),
 extra('growth-consulting','ბიზნეს ზრდის კონსულტაცია','Business Growth Consultation','Brand Works','consulting',4.6,36,159,1,'specialist','consultation','brand',17,['fastDelivery']),
]
export const goals: Goal[] = [
 ['sales','target','მეტი გაყიდვა','Increase Sales'],['customers','users','მეტი მომხმარებელი','Reach More Customers'],['awareness','megaphone','ბრენდის ცნობადობა','Build Brand Awareness'],['website','globe','ახალი ვებსაიტი','Launch a New Website'],['social-growth','share','სოციალური მედიის განვითარება','Grow Social Media'],['automate','workflow','პროცესების ავტომატიზაცია','Automate Processes'],
].map(([id,icon,ka,en])=>({id,icon:icon as IconName,title:l(ka,en),description:l('ნახე მიზანზე მორგებული მომსახურებები','Explore services aligned with this goal')}))
export const trust = [l('შერჩეული სპეციალისტები','Curated Specialists'),l('გასაგები პროცესი','Clear Process'),l('ხარისხზე ორიენტირებული','Quality Focused'),l('მხარდაჭერის სივრცე','Support Resources')]
export const steps: Step[] = [
 {id:'choose',icon:'search',title:l('აირჩიე მომსახურება','Choose a Service'),description:l('შეადარე შეთავაზებები და შეარჩიე მიზნის შესაბამისი ვარიანტი.','Compare options and choose one aligned with your goal.')},
 {id:'requirements',icon:'briefcase',title:l('შეავსე მოთხოვნა','Submit Your Requirements'),description:l('აღწერე საჭირო შედეგი და სამუშაოს ძირითადი დეტალები.','Outline the result you need and the key project details.')},
 {id:'result',icon:'rocket',title:l('მიიღე შედეგი','Receive the Result'),description:l('შეთანხმებული პროცესი მიგიყვანს სასურველ ციფრულ შედეგამდე.','A clear process guides the work toward your digital outcome.')},
]
