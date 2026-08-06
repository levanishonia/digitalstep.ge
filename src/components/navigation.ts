import {
  Bell, Boxes, CircleUserRound, Heart, Home, LayoutGrid, MessageCircle,
  Settings, ShoppingBag, SlidersHorizontal, type LucideIcon,
} from 'lucide-react'

export type NavigationItem = { label: string; href: string; icon: LucideIcon }

export const primaryNavigation: NavigationItem[] = [
  { label: 'მთავარი', href: '#main', icon: Home },
  { label: 'მარკეტპლეისი', href: '#marketplace', icon: ShoppingBag },
  { label: 'კატეგორიები', href: '#categories', icon: LayoutGrid },
  { label: 'ჩემი შეკვეთები', href: '#orders', icon: Boxes },
  { label: 'რჩეულები', href: '#favorites', icon: Heart },
  { label: 'შეტყობინებები', href: '#messages', icon: MessageCircle },
  { label: 'პროფილი', href: '#profile', icon: CircleUserRound },
]

export const settingsItem: NavigationItem = {
  label: 'პარამეტრები', href: '#settings', icon: Settings,
}

export const mobileNavigation = [primaryNavigation[0], primaryNavigation[2], primaryNavigation[1], primaryNavigation[4], primaryNavigation[6]]
export { Bell, SlidersHorizontal, ShoppingBag }
