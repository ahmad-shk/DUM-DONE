'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MenuIcon, X, Sun, Moon, Globe, ShoppingBag } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'

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
    <header className="fixed w-full top-4 md:top-6 z-[100] px-4">
      <nav className="max-w-7xl mx-auto relative">
        {/* Background height set back to original min-h-[55px] / [75px] */}
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md text-black dark:text-white rounded-full px-4 md:px-12 py-2 md:py-3 flex items-center justify-between shadow-lg border border-gray-200 dark:border-white/10 min-h-[55px] md:min-h-[75px] transition-all duration-300">

          {/* LEFT SECTION: Menu (Mobile) / Links (Desktop) */}
          <div className="flex items-center flex-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors z-[110]"
            >
              {isOpen ? <X size={22} /> : <MenuIcon size={22} />}
            </button>

            <div className="hidden md:flex items-center gap-8">
              {[
                { name: t.home, href: '/' },
                { name: t.menu, href: '/menu' },
                { name: t.about, href: '/about' },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative text-sm font-semibold group py-1 hover:text-amber-600 transition-colors"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* CENTER SECTION: Logo (Keep Large but fixed position) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <Link href="/" className="flex items-center group transition-transform hover:scale-110 active:scale-95 duration-300">
              {isDark ? (
                <img
                  src="../DUM_AND_DONE_LOGO-.png"
                  alt="DUM & DONE Logo"
                  className="h-24 md:h-32 w-auto object-contain" // Mobile: h-24, Desktop: h-32
                  loading="eager"
                />
              ) : (
                <img
                  src="../DUM_AND_DONE_LOGO-.png"
                  alt="DUM & DONE Logo"
                  className="h-24 md:h-32 w-auto object-contain"
                  loading="eager"
                />
              )}
            </Link>
          </div>

          {/* RIGHT SECTION: Icons & Language */}
          <div className="flex items-center gap-1 md:gap-3 flex-1 justify-end">
            <Link
              href="/order"
              className="flex items-center justify-center p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full transition-all shadow-md"
            >
              <ShoppingBag size={18} />
              <span className="hidden lg:inline ml-2 text-xs font-bold">{t.booking}</span>
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all hidden sm:flex"
            >
              {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            </button>

            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all text-xs font-bold border border-transparent"
            >
              <Globe size={16} className="hidden xs:block" />
              <span className="uppercase text-[10px] sm:text-xs">{lang === 'en' ? 'EN' : 'اردو'}</span>
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-3 md:hidden overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-2xl p-4 space-y-2">
              {[
                { name: t.home, href: '/' },
                { name: t.menu, href: '/menu' },
                { name: t.about, href: '/about' },
                { name: t.booking, href: '/order' },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-amber-500/10 hover:text-amber-600 dark:text-white text-lg font-medium transition-all"
                >
                  {link.name}
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}