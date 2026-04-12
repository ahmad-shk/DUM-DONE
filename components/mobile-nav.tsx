"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, UtensilsCrossed, ShoppingBag, Info } from "lucide-react"
import { useLanguage } from "@/lib/language-provider"
import { translations } from "@/lib/translations"
import Image from "next/image"

export function MobileNav() {
  const pathname = usePathname()
  const { lang } = useLanguage()
  const t = translations[lang].header

  const navItemsLeft = [
    { name: t.home, href: "/", icon: Home },
    { name: t.menu, href: "/menu", icon: UtensilsCrossed },
  ]
  
  const navItemsRight = [
    { name: t.booking, href: "/order", icon: ShoppingBag },
    { name: t.about, href: "/about", icon: Info },
  ]

  const NavLink = ({ item }: { item: any }) => {
    const isActive = pathname === item.href
    const Icon = item.icon
    return (
      <Link
        href={item.href}
        className={`relative flex flex-col items-center justify-center w-[20%] h-14 rounded-full transition-all duration-300 ${
          isActive 
            ? "text-primary scale-110" 
            : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
        }`}
      >
        {isActive && (
          <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full -z-10 animate-in zoom-in duration-300" />
        )}
        <Icon 
          strokeWidth={isActive ? 2.5 : 2} 
          className={`w-5 h-5 mb-1 transition-transform duration-300 ${isActive ? "-translate-y-0.5 drop-shadow-[0_0_8px_rgba(200,0,0,0.5)]" : ""}`} 
        />
        <span className={`text-[10px] font-medium transition-all duration-300 ${isActive ? "font-bold" : ""}`}>
          {item.name}
        </span>
      </Link>
    )
  }

  return (
    <div className="md:hidden fixed bottom-4 left-2 right-2 z-[100] animate-in slide-in-from-bottom-12 duration-700 pointer-events-none">
      <nav className="glass border border-white/20 dark:border-white/10 rounded-[2rem] px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-between pointer-events-auto relative">
        
        {/* Left Nav Items */}
        {navItemsLeft.map((item) => <NavLink key={item.name} item={item} />)}

        {/* Floating Center Logo */}
        <div className="w-[20%] flex justify-center -mt-8">
          <Link href="/" className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-black shadow-[0_0_20px_rgba(0,0,0,0.2)] border-2 border-primary/20 p-2 hover:scale-105 active:scale-95 transition-transform">
            <Image 
              src="/DUM_AND_DONE_LOGO-.png" 
              alt="Logo" 
              fill 
              className="object-contain p-1"
            />
          </Link>
        </div>

        {/* Right Nav Items */}
        {navItemsRight.map((item) => <NavLink key={item.name} item={item} />)}

      </nav>
    </div>
  )
}
