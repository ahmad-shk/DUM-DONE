'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sun, Moon, Globe, ShoppingBag, MenuIcon, X } from 'lucide-react'
import { useLanguage } from '@/lib/use-language'
import { translations } from '@/lib/translations'
import Image from 'next/image'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const { lang, toggleLang } = useLanguage()

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    const shouldBeDark = storedTheme === "dark"
    setIsDark(shouldBeDark)
    if (shouldBeDark) document.documentElement.classList.add("dark")
  }, [])

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    localStorage.setItem("theme", newDark ? "dark" : "light")
    document.documentElement.classList.toggle("dark")
  }

  const t = translations[lang].header

  return (
    <>
      {/* DESKTOP / PREVIOUS WEB VIEW */}
      <header className="hidden md:block fixed w-full top-4 md:top-6 z-[100] px-4 animate-in fade-in slide-in-from-top-8 duration-700">
        <nav className="max-w-7xl mx-auto relative">
          <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md text-black dark:text-white rounded-full px-4 md:px-12 py-2 md:py-3 flex items-center justify-between shadow-lg border border-gray-200 dark:border-white/10 min-h-[55px] md:min-h-[75px] transition-all duration-300">
            {/* LEFT SECTION */}
            <div className="flex items-center flex-1">
              <div className="hidden md:flex items-center gap-8">
                {[{ name: t.home, href: '/' }, { name: t.menu, href: '/menu' }, { name: t.about, href: '/about' }].map((link) => (
                  <Link key={link.name} href={link.href} className="relative text-sm font-semibold group py-1 hover:text-amber-600 transition-colors">
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </div>
            </div>

            {/* CENTER SECTION */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
              <Link href="/" className="flex items-center group transition-transform hover:scale-110 active:scale-95 duration-300">
                <img src="/DUM_AND_DONE_LOGO-.png" alt="DUM & DONE Logo" className="h-24 md:h-32 w-auto object-contain" loading="eager" />
              </Link>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-1 md:gap-3 flex-1 justify-end">
              <Link href="/order" className="flex items-center justify-center p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full transition-all shadow-md">
                <ShoppingBag size={18} />
                <span className="hidden lg:inline ml-2 text-xs font-bold">{t.booking}</span>
              </Link>
              <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all hidden sm:flex">
                {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
              </button>
              <button onClick={toggleLang} className="flex items-center gap-1 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all text-xs font-bold border border-transparent">
                <Globe size={16} className="hidden xs:block" />
                <span className="uppercase text-[10px] sm:text-xs">{lang === 'en' ? 'EN' : 'اردو'}</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* MOBILE APP VIEW */}
      <header className="md:hidden fixed top-0 left-0 w-full z-[100] bg-white dark:bg-[#111] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* LEFT: Logo */}
          <Link href="/" className="flex items-center active:scale-95 transition-transform h-full py-2">
            <div className="relative w-24 md:w-32 h-full">
              <Image src="/DUM_AND_DONE_LOGO-.png" alt="DUM & DONE Logo" fill className="object-contain object-left" priority />
            </div>
          </Link>

          {/* RIGHT: Theme & Language */}
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={toggleTheme} className="p-2.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all flex text-foreground/80 hover:text-foreground">
              {isDark ? <Sun size={20} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" /> : <Moon size={20} />}
            </button>
            <button onClick={toggleLang} className="flex items-center gap-1.5 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all text-sm font-bold text-foreground/80 hover:text-foreground">
              <Globe size={18} className="text-primary dark:text-gray-300" />
              <span className="uppercase tracking-wider">{lang === 'en' ? 'EN' : 'اردو'}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
