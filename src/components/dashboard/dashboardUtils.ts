import type { Locale } from '../../i18n'

export const dashboardCopy={ka:{status:{new:'ახალი',inProgress:'მიმდინარეობს',inReview:'შესამოწმებელი',completed:'დასრულებული',cancelled:'გაუქმებული'},order:'შეკვეთა',provider:'მიმწოდებელი',created:'შექმნის თარიღი',package:'პაკეტი',delivery:'მიწოდება',view:'შეკვეთის ნახვა',total:'ჯამი',stages:['შეკვეთა მიღებულია','სამუშაო დაწყებულია','შესრულების პროცესშია','შემოწმებაზეა','დასრულებულია']},en:{status:{new:'New',inProgress:'In Progress',inReview:'In Review',completed:'Completed',cancelled:'Cancelled'},order:'Order',provider:'Provider',created:'Created',package:'Package',delivery:'Delivery',view:'View Order',total:'Total',stages:['Order Received','Work Started','In Progress','In Review','Completed']}} as const

export const formatDate=(value:string,locale:Locale)=>new Intl.DateTimeFormat(locale==='ka'?'ka-GE':'en-US',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(value))

export const formatPrice=(price:number)=>`${new Intl.NumberFormat('en-US').format(price)}₾`
