import TextLink from '@/components/text-link'
import { cn } from '@/lib/utils'

const links = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Groves', href: '/groves' },
    { name: 'Yield Tracking', href: '/yield-tracking' },
    { name: 'Resource Management', href: '/resource-management' },
    { name: 'Financials', href: '/financials' },
]

export function FarmerNav({ className }: { className?: string }) {
    return (
        <nav className={cn('space-y-1', className)}>
            {links.map((link, i) => (
                <TextLink key={i} href={link.href} className="block">
                    {link.name}
                </TextLink>
            ))}
        </nav>
    )
} 