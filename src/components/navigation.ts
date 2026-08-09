import { Boxes, BriefcaseBusiness, CircleUserRound, Heart, Home, MessageCircle, Settings, ShoppingBag, Sparkles, type LucideIcon } from 'lucide-react'
export type NavigationKey = 'main'|'marketplace'|'studio'|'business'|'orders'|'favorites'|'messages'|'profile'
export type NavigationItem = { key: NavigationKey; href: string; icon: LucideIcon }
export const primaryNavigation: NavigationItem[] = [
 {key:'main',href:'/',icon:Home},{key:'marketplace',href:'/marketplace',icon:ShoppingBag},{key:'studio',href:'/studio',icon:Sparkles},{key:'business',href:'/business',icon:BriefcaseBusiness},{key:'orders',href:'/dashboard/orders',icon:Boxes},{key:'messages',href:'/dashboard/messages',icon:MessageCircle},{key:'favorites',href:'/dashboard/favorites',icon:Heart},{key:'profile',href:'/dashboard/profile',icon:CircleUserRound},
]
export const settingsItem={key:'settings' as const,href:'/dashboard/settings',icon:Settings}
export const mobileNavigation=[primaryNavigation[0],primaryNavigation[1],primaryNavigation[2],primaryNavigation[4],primaryNavigation[7]]
