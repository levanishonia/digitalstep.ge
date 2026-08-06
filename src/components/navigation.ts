import { Boxes, CircleUserRound, Heart, Home, LayoutGrid, MessageCircle, Settings, ShoppingBag, type LucideIcon } from 'lucide-react'
export type NavigationKey = 'main'|'marketplace'|'categories'|'orders'|'favorites'|'messages'|'profile'
export type NavigationItem = { key: NavigationKey; href: string; icon: LucideIcon }
export const primaryNavigation: NavigationItem[] = [
 {key:'main',href:'#main',icon:Home},{key:'marketplace',href:'#main',icon:ShoppingBag},{key:'categories',href:'#categories',icon:LayoutGrid},{key:'orders',href:'#main',icon:Boxes},{key:'favorites',href:'#main',icon:Heart},{key:'messages',href:'#main',icon:MessageCircle},{key:'profile',href:'#main',icon:CircleUserRound},
]
export const settingsItem={key:'settings' as const,href:'#main',icon:Settings}
export const mobileNavigation=[primaryNavigation[0],primaryNavigation[2],primaryNavigation[1],primaryNavigation[4],primaryNavigation[6]]
