import type { LocalizedText } from '../i18n'

export type MessageSender = 'customer' | 'provider' | 'system'
export type MessageStatus = 'sent' | 'delivered' | 'read'
export type ConversationStatus = 'active' | 'completed'

export interface MessageAttachment { id:string; name:string; type:'image'|'document'; mimeType:string; sizeLabel:string; preview?:string }
export interface Message { id:string; conversationId:string; sender:MessageSender; text?:LocalizedText; sentAt:string; status?:MessageStatus; attachmentIds?:string[]; systemType?:'order'|'general' }
export interface Conversation { id:string; participantId:string; participantName:string; participantAvatar?:string; providerSlug?:string; serviceId?:string; serviceSlug?:string; serviceTitle?:LocalizedText; orderId?:string; unreadCount:number; lastMessage:LocalizedText; lastMessageAt:string; messageIds:string[]; status:ConversationStatus }

const l=(ka:string,en:string):LocalizedText=>({ka,en})
export const messageReferenceDate='2026-08-07T12:00:00Z'
export const mockMessageAttachments:MessageAttachment[]=[
 {id:'msg-file-brief',name:'website-brief.pdf',type:'document',mimeType:'application/pdf',sizeLabel:'2.4 MB'},
 {id:'msg-file-wireframe',name:'homepage-wireframe.png',type:'image',mimeType:'image/png',sizeLabel:'1.8 MB',preview:'web'},
]

export const mockMessages:Message[]=[
 {id:'msg-1',conversationId:'conversation-webcraft',sender:'system',text:l('შეკვეთა DS-2026-1042 შეიქმნა.','Order DS-2026-1042 was created.'),sentAt:'2026-08-05T09:00:00Z',systemType:'order'},
 {id:'msg-2',conversationId:'conversation-webcraft',sender:'provider',text:l('გამარჯობა, ლევან! მადლობა შეკვეთისთვის. ბრიფს გადავხედე.','Hello, Levan! Thank you for your order. I reviewed the brief.'),sentAt:'2026-08-05T09:12:00Z'},
 {id:'msg-3',conversationId:'conversation-webcraft',sender:'provider',text:l('შეგიძლიათ ბრენდის ფერები და ლოგოს ფაილი გამიზიაროთ?','Could you share the brand colors and logo file?'),sentAt:'2026-08-05T09:14:00Z'},
 {id:'msg-4',conversationId:'conversation-webcraft',sender:'customer',text:l('გამარჯობა! დიახ, ბრენდის სახელმძღვანელოს გიგზავნით.','Hi! Yes, I am sending the brand guide.'),sentAt:'2026-08-05T09:30:00Z',status:'read',attachmentIds:['msg-file-brief']},
 {id:'msg-5',conversationId:'conversation-webcraft',sender:'provider',text:l('მივიღე, ყველაფერი გასაგებია. პირველ მონახაზს ხვალ გაგიზიარებთ.','Received, everything is clear. I will share the first draft tomorrow.'),sentAt:'2026-08-05T10:02:00Z'},
 {id:'msg-6',conversationId:'conversation-webcraft',sender:'system',text:l('შეკვეთის პროგრესი განახლდა — 55%.','Order progress was updated — 55%.'),sentAt:'2026-08-06T11:00:00Z',systemType:'order'},
 {id:'msg-7',conversationId:'conversation-webcraft',sender:'provider',text:l('მთავარი გვერდის მონახაზი მზად არის.','The homepage wireframe is ready.'),sentAt:'2026-08-06T15:20:00Z',attachmentIds:['msg-file-wireframe']},
 {id:'msg-8',conversationId:'conversation-webcraft',sender:'provider',text:l('გთხოვთ, ნახოთ სტრუქტურა და მომწეროთ კომენტარები.','Please review the structure and send me your comments.'),sentAt:'2026-08-06T15:22:00Z'},
 {id:'msg-9',conversationId:'conversation-webcraft',sender:'customer',text:l('სტრუქტურა მომწონს. სერვისების ბლოკი ოდნავ მაღლა ავწიოთ.','I like the structure. Let us move the services section slightly higher.'),sentAt:'2026-08-07T08:40:00Z',status:'delivered'},
 {id:'msg-10',conversationId:'conversation-webcraft',sender:'provider',text:l('კარგი იდეაა, ცვლილებას დღესვე შევიტან.','Good idea, I will make that change today.'),sentAt:'2026-08-07T09:05:00Z'},
 {id:'msg-11',conversationId:'conversation-webcraft',sender:'customer',text:l('მადლობა! ასევე მობილურ ვერსიასაც დაველოდები.','Thank you! I will also wait for the mobile version.'),sentAt:'2026-08-07T09:18:00Z',status:'sent'},
 {id:'msg-12',conversationId:'conversation-webcraft',sender:'provider',text:l('რა თქმა უნდა — ორივე ზომას ერთად გამოგიგზავნით.','Of course — I will send both sizes together.'),sentAt:'2026-08-07T09:26:00Z'},
 {id:'msg-13',conversationId:'conversation-growth',sender:'provider',text:l('კონტენტ-გეგმა მზადაა შესამოწმებლად.','The content plan is ready for review.'),sentAt:'2026-08-07T08:10:00Z'},
 {id:'msg-14',conversationId:'conversation-brand',sender:'provider',text:l('სამი ლოგოს მიმართულებას ხვალ წარმოგიდგენთ.','I will present three logo directions tomorrow.'),sentAt:'2026-08-06T12:45:00Z'},
 {id:'msg-15',conversationId:'conversation-digital',sender:'provider',text:l('SEO აუდიტის საბოლოო ანგარიში ხელმისაწვდომია.','The final SEO audit report is available.'),sentAt:'2026-08-04T16:00:00Z'},
 {id:'msg-16',conversationId:'conversation-pixel',sender:'provider',text:l('რომელი ვიზუალური მიმართულება მოგწონთ?','Which visual direction do you prefer?'),sentAt:'2026-08-03T13:30:00Z'},
 {id:'msg-17',conversationId:'conversation-automation',sender:'provider',text:l('შეხვედრის დრო დავადასტურეთ.','We confirmed the meeting time.'),sentAt:'2026-08-01T10:15:00Z'},
]

export const mockConversations:Conversation[]=[
 {id:'conversation-webcraft',participantId:'webcraft',participantName:'WebCraft',providerSlug:'webcraft',serviceId:'business-website',serviceSlug:'business-website-development',serviceTitle:l('ბიზნეს ვებსაიტის შექმნა','Business Website Development'),orderId:'order-demo-1',unreadCount:0,lastMessage:l('ორივე ზომას ერთად გამოგიგზავნით.','I will send both sizes together.'),lastMessageAt:'2026-08-07T09:26:00Z',messageIds:['msg-1','msg-2','msg-3','msg-4','msg-5','msg-6','msg-7','msg-8','msg-9','msg-10','msg-11','msg-12'],status:'active'},
 {id:'conversation-growth',participantId:'growth-studio',participantName:'Growth Studio',providerSlug:'growth-studio',serviceId:'social-management',serviceSlug:'social-media-management',serviceTitle:l('სოციალური მედიის მართვა','Social Media Management'),orderId:'order-demo-2',unreadCount:2,lastMessage:l('კონტენტ-გეგმა მზადაა შესამოწმებლად.','The content plan is ready for review.'),lastMessageAt:'2026-08-07T08:10:00Z',messageIds:['msg-13'],status:'active'},
 {id:'conversation-brand',participantId:'brand-works',participantName:'Brand Works',providerSlug:'brand-works',serviceId:'brand-identity',serviceSlug:'brand-identity-design',serviceTitle:l('ბრენდის იდენტობის დიზაინი','Brand Identity Design'),orderId:'order-demo-4',unreadCount:1,lastMessage:l('სამი მიმართულება ხვალ იქნება მზად.','Three directions will be ready tomorrow.'),lastMessageAt:'2026-08-06T12:45:00Z',messageIds:['msg-14'],status:'active'},
 {id:'conversation-digital',participantId:'digital-step',participantName:'Digital Step Team',providerSlug:'digital-step-team',serviceId:'seo-audit',serviceSlug:'seo-audit-optimization',serviceTitle:l('SEO აუდიტი და ოპტიმიზაცია','SEO Audit & Optimization'),orderId:'order-demo-3',unreadCount:0,lastMessage:l('საბოლოო ანგარიში ხელმისაწვდომია.','The final report is available.'),lastMessageAt:'2026-08-04T16:00:00Z',messageIds:['msg-15'],status:'completed'},
 {id:'conversation-pixel',participantId:'pixel-lab',participantName:'Pixel Lab',serviceTitle:l('მობილური აპის UI დიზაინი','Mobile App UI Design'),unreadCount:3,lastMessage:l('რომელი ვიზუალური მიმართულება მოგწონთ?','Which visual direction do you prefer?'),lastMessageAt:'2026-08-03T13:30:00Z',messageIds:['msg-16'],status:'active'},
 {id:'conversation-automation',participantId:'digital-step',participantName:'Digital Step Team',providerSlug:'digital-step-team',serviceId:'process-automation',serviceSlug:'business-process-automation',serviceTitle:l('ბიზნეს პროცესების ავტომატიზაცია','Business Process Automation'),unreadCount:0,lastMessage:l('შეხვედრის დრო დავადასტურეთ.','We confirmed the meeting time.'),lastMessageAt:'2026-08-01T10:15:00Z',messageIds:['msg-17'],status:'active'},
]
