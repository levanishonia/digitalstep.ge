import type { Locale } from '../i18n'
export type Localized = Record<Locale, string>
export type IconName = 'megaphone'|'code'|'palette'|'share'|'search'|'ads'|'video'|'workflow'|'sparkles'|'briefcase'|'target'|'users'|'globe'|'rocket'
export type Badge = 'popular'|'bestseller'|'new'|'fastDelivery'|'aiService'
export interface Category { id: string; icon: IconName; name: Localized; description: Localized; count: number }
export interface Service { id: string; title: Localized; provider: string; rating: number; reviews: number; price: number; badges: Badge[]; preview: string }
export interface Goal { id: string; icon: IconName; title: Localized; description: Localized }
export interface Step { id: string; icon: IconName; title: Localized; description: Localized }
const l = (ka:string,en:string):Localized => ({ka,en})
export const categories: Category[] = [
 ['marketing','megaphone','მარკეტინგი','Marketing',24],['web','code','ვებსაიტების შექმნა','Website Development',18],['design','palette','დიზაინი','Design',31],['social','share','სოციალური მედია','Social Media',22],['seo','search','SEO','SEO',14],['advertising','ads','რეკლამა','Advertising',16],['video','video','ვიდეო და ანიმაცია','Video & Animation',12],['automation','workflow','ავტომატიზაცია','Automation',9],['ai','sparkles','AI მომსახურებები','AI Services',11],['consulting','briefcase','ბიზნეს კონსულტაცია','Business Consulting',8],
].map(([id,icon,ka,en,count])=>({id:id as string,icon:icon as IconName,name:l(ka as string,en as string),description:l('შერჩეული ციფრული გადაწყვეტილებები','Curated digital solutions'),count:count as number}))
export const popularServices: Service[] = [
 {id:'social-management',title:l('სოციალური მედიის მართვა','Social Media Management'),provider:'Growth Studio',rating:4.9,reviews:84,price:299,badges:['popular','fastDelivery'],preview:'social'},
 {id:'business-website',title:l('ბიზნეს ვებსაიტის შექმნა','Business Website Development'),provider:'Pixel Lab',rating:4.8,reviews:61,price:799,badges:['popular'],preview:'web'},
 {id:'seo-audit',title:l('SEO აუდიტი და ოპტიმიზაცია','SEO Audit & Optimization'),provider:'Digital Step Team',rating:4.9,reviews:47,price:249,badges:['new'],preview:'seo'},
 {id:'brand-identity',title:l('ბრენდის იდენტობის დიზაინი','Brand Identity Design'),provider:'Next Media',rating:4.7,reviews:38,price:449,badges:['popular'],preview:'brand'},
]
export const bestsellerServices: Service[] = [
 {id:'ad-campaign',title:l('სარეკლამო კამპანიის გამართვა','Advertising Campaign Setup'),provider:'Growth Studio',rating:5,reviews:112,price:349,badges:['bestseller','fastDelivery'],preview:'ads'},
 {id:'promo-video',title:l('მოკლე სარეკლამო ვიდეო','Short Promotional Video'),provider:'Next Media',rating:4.9,reviews:76,price:399,badges:['bestseller'],preview:'video'},
 {id:'process-automation',title:l('ბიზნეს პროცესების ავტომატიზაცია','Business Process Automation'),provider:'Digital Step Team',rating:4.8,reviews:43,price:599,badges:['bestseller'],preview:'automation'},
 {id:'ai-content',title:l('AI კონტენტის ასისტენტი','AI Content Assistant'),provider:'Pixel Lab',rating:4.8,reviews:35,price:219,badges:['aiService','new'],preview:'ai'},
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
