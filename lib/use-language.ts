'use client'

import { useState, useEffect } from 'react'
import type { Language } from './translations'

export function useLanguage() {
  const [lang, setLang] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load language from localStorage on mount
    const saved = localStorage.getItem('language') as Language || 'en'
    setLang(saved)
    setMounted(true)
  }, [])

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'ur' : 'en'
    setLang(newLang)
    localStorage.setItem('language', newLang)
  }

  const changeLang = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('language', newLang)
  }

  return { lang, setLang: changeLang, toggleLang, mounted }
}
