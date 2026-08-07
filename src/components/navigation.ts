import { Boxes, CircleUserRound, Heart, Home, LayoutGrid, MessageCircle, Settings, ShoppingBag, type LucideIcon } from 'lucide-react'
export type NavigationKey = 'main'|'marketplace'|'categories'|'orders'|'favorites'|'messages'|'profile'
export type NavigationItem = { key: NavigationKey; href: string; icon: LucideIcon }
export const primaryNavigation: NavigationItem[] = [
 {key:'main',href:'/',icon:Home},{key:'marketplace',href:'/marketplace',icon:ShoppingBag},{key:'categories',href:'/marketplace#categories',icon:LayoutGrid},{key:'orders',href:'/dashboard/orders',icon:Boxes},{key:'favorites',href:'/dashboard/favorites',icon:Heart},{key:'messages',href:'/dashboard/messages',icon:MessageCircle},{key:'profile',href:'/dashboard/profile',icon:CircleUserRound},
]
export const settingsItem={key:'settings' as const,href:'/dashboard/settings',icon:Settings}
export const mobileNavigation=[primaryNavigation[0],primaryNavigation[2],primaryNavigation[1],primaryNavigation[4],primaryNavigation[6]]
