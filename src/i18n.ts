export const locales = ['ka', 'en'] as const
export type Locale = (typeof locales)[number]

export const dictionary = {
  ka: {
    nav: { main: 'მთავარი', marketplace: 'მარკეტპლეისი', categories: 'კატეგორიები', orders: 'ჩემი შეკვეთები', favorites: 'რჩეულები', messages: 'შეტყობინებები', profile: 'პროფილი', settings: 'პარამეტრები', mobile: 'მობილური ნავიგაცია', navigation: 'მთავარი ნავიგაცია' },
    shell: { search: 'მომსახურების ძიება', searchPlaceholder: 'მოძებნე მომსახურება...', filters: 'ძიების ფილტრები', cart: 'კალათა', notifications: 'შეტყობინებები', account: 'ანგარიშის მენიუ', buyer: 'მყიდველი', seller: 'გახდი გამყიდველი', sellerText: 'შესთავაზე შენი ციფრული სერვისი', start: 'დაწყება', theme: 'მუქი თემა', changeTheme: 'თემის შეცვლა', newMessage: 'ახალი შეტყობინება', language: 'English' },
    home: {
      eyebrow: 'Digital Step მარკეტპლეისი', title: 'ციფრული მომსახურებები შენი ბიზნესის განვითარებისთვის', subtitle: 'მოძებნე, შეადარე და შეუკვეთე საჭირო მომსახურება ერთ სივრცეში', browse: 'მომსახურებების ნახვა', how: 'როგორ მუშაობს', categories: 'პოპულარული კატეგორიები', allCategories: 'ყველა კატეგორია', popular: 'პოპულარული მომსახურებები', viewAll: 'ყველას ნახვა', bestsellers: 'ბესტსელერები', goalsEyebrow: 'ბიზნესის მიზნის მიხედვით', goals: 'რის მიღწევა გსურს?', works: 'როგორ მუშაობს Digital Step', services: 'მომსახურება', reviews: 'შეფასებები', from: 'დან', viewService: 'მომსახურების ნახვა', viewCategory: 'კატეგორიის ნახვა', addFavorite: 'რჩეულებში დამატება', removeFavorite: 'რჩეულებიდან წაშლა', demo: 'სადემონსტრაციო მონაცემები', loading: 'კონტენტის ჩატვირთვა', footer: 'ციფრული მომსახურებების ორგანიზებული სივრცე ბიზნესისთვის.'
    },
    badges: { popular: 'პოპულარული', bestseller: 'ბესტსელერი', new: 'ახალი', fastDelivery: 'სწრაფი მიწოდება', aiService: 'AI მომსახურება' },
  },
  en: {
    nav: { main: 'Home', marketplace: 'Marketplace', categories: 'Categories', orders: 'My Orders', favorites: 'Favorites', messages: 'Messages', profile: 'Profile', settings: 'Settings', mobile: 'Mobile navigation', navigation: 'Main navigation' },
    shell: { search: 'Search services', searchPlaceholder: 'Search for a service...', filters: 'Search filters', cart: 'Cart', notifications: 'Notifications', account: 'Account menu', buyer: 'Buyer', seller: 'Become a seller', sellerText: 'Offer your digital service', start: 'Get started', theme: 'Dark theme', changeTheme: 'Change theme', newMessage: 'New message', language: 'ქართული' },
    home: {
      eyebrow: 'Digital Step Marketplace', title: 'Digital services for growing your business', subtitle: 'Discover, compare, and order the services you need in one place', browse: 'Browse Services', how: 'How It Works', categories: 'Popular Categories', allCategories: 'All Categories', popular: 'Popular Services', viewAll: 'View All', bestsellers: 'Bestsellers', goalsEyebrow: 'Browse by Business Goal', goals: 'What do you want to achieve?', works: 'How Digital Step Works', services: 'services', reviews: 'reviews', from: 'From', viewService: 'View Service', viewCategory: 'View Category', addFavorite: 'Add to Favorites', removeFavorite: 'Remove from Favorites', demo: 'Demo data', loading: 'Loading Content', footer: 'An organized space for business-focused digital services.'
    },
    badges: { popular: 'Popular', bestseller: 'Bestseller', new: 'New', fastDelivery: 'Fast Delivery', aiService: 'AI Service' },
  },
} as const

export function resolveLocale(pathname: string): Locale { return pathname.split('/')[1] === 'en' ? 'en' : 'ka' }
export function localePath(locale: Locale, destination: string): string {
  if (destination.startsWith('#')) return destination
  const [pathAndQuery, hash = ''] = destination.split('#')
  const [rawPath, query = ''] = pathAndQuery.split('?')
  const clean = `/${rawPath}`.replace(/^\/(ka|en)(?=\/|$)/, '').replace(/\/{2,}/g, '/')
  return `/${locale}${clean === '/' ? '' : clean}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`
}
