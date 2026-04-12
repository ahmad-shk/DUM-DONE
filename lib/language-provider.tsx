'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Language } from './translations'

interface LanguageContextType {
  lang: Language
  toggleLang: () => void
  setLang: (lang: Language) => void
  mounted: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLanguage] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load language from localStorage on mount
    const saved = localStorage.getItem('language') as Language || 'en'
    setLanguage(saved)
    setMounted(true)
  }, [])

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'ur' : 'en'
    setLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  const setLang = (newLang: Language) => {
    setLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang, mounted }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
