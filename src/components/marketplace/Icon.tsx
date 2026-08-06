import { BriefcaseBusiness, Code2, Film, Globe2, Megaphone, Palette, Rocket, Search, Share2, Sparkles, Target, Users, Workflow, BadgeDollarSign } from 'lucide-react'
import type { IconName } from '../../data/marketplace'
const icons = { megaphone:Megaphone, code:Code2, palette:Palette, share:Share2, search:Search, ads:BadgeDollarSign, video:Film, workflow:Workflow, sparkles:Sparkles, briefcase:BriefcaseBusiness, target:Target, users:Users, globe:Globe2, rocket:Rocket }
export function MarketplaceIcon({name}:{name:IconName}) { const Icon=icons[name]; return <Icon aria-hidden="true"/> }
