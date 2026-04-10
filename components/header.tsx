"use client"

import { useState, useEffect } from "react"
import { MenuIcon, X, Sun, Moon, Globe } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion" // Pehle install kar chuke hain hum
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"



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

  const menuVariants = {
    closed: { opacity: 0, y: -20, scale: 0.95 },
    open: { opacity: 1, y: 0, scale: 1 }
  }

  return (
    <header className="fixed w-full top-4 md:top-6 z-[100] px-4">
      <nav className="max-w-7xl mx-auto relative">
        {/* Main Pill Bar */}
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md text-black dark:text-white rounded-full px-4 md:px-12 py-2 md:py-3 flex items-center justify-between shadow-lg border border-gray-200 dark:border-white/10 min-h-[55px] md:min-h-[75px] transition-all duration-300">
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors z-[110]"
          >
            {isOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>

          {/* Desktop Left Links */}
          <div className="hidden md:flex items-center gap-8 flex-1">
            {[
              { name: t.home, href: "#" },
              { name: t.menu, href: "/menu" },
              { name: t.booking, href: "/order" },
            ].map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-sm font-semibold group py-1 hover:text-amber-600 transition-colors"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Center Logo - Fixed Positioning */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="flex items-center group cursor-pointer transition-transform hover:scale-110 active:scale-95 duration-300">
               {/* Aapka SVG yahan aayega */}
               { isDark ? (
                <img src="/darkthemLogo.png" alt="DUM & DONE Logo" className="h-8 md:h-10" />
               ) : (
                <img src="/lightthemLogo.png" alt="DUM & DONE Logo" className="h-8 md:h-10" />
               )}
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-1 md:gap-4 flex-1 justify-end">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-300"
            >
              {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all text-xs font-bold border border-transparent hover:border-gray-200 dark:hover:border-white/10"
            >
              <Globe size={14} />
              <span className="uppercase">{lang}</span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-3 md:hidden overflow-hidden"
            >
              <div className="bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-2xl p-4 space-y-2">
                {[
                  { name: t.home, href: "#" },
                  { name: t.menu, href: "/menu" },
                  { name: t.booking, href: "/order" },
                ].map((link, i) => (
                  <motion.a
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-amber-500/10 hover:text-amber-600 dark:text-white text-lg font-medium transition-all"
                  >
                    {link.name}
                    <div className="w-2 h-2 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
