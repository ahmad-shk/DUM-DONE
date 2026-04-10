"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"
import { Calendar, Users, Clock, Phone, User, Send } from "lucide-react"

export function Reservation() {
  const { lang } = useLanguage()
  const t = translations[lang].reservation

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    guests: "2 Person",
    date: "",
    time: "",
  })

  return (
    <section id="reservation" className="py-20 px-4 bg-gray-50 dark:bg-black transition-colors duration-500">
      <div className="max-w-6xl mx-auto overflow-hidden rounded-[3rem] bg-white dark:bg-[#0A0A0A] shadow-2xl border border-gray-100 dark:border-white/5">
        
        <div className="flex flex-col lg:flex-row">
          
          {/* Left Side: Visual Panel */}
          <div className="relative lg:w-2/5 h-[300px] lg:h-auto overflow-hidden">
            <img 
              src="/timer-bg.png" 
              alt="Table Reservation" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col items-center justify-end p-10 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4 leading-tight">
                {t.title.split(' ')[0]} <br/> <span className="text-amber-500">{t.title.split(' ').slice(1).join(' ')}</span>
              </h2>
              <p className="text-gray-300 text-sm md:text-base font-light max-w-xs">
                {lang === 'en' ? "Join us for an unforgettable culinary experience." : "加入我们，享受难忘的美食体验。"}
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:w-3/5 p-8 md:p-14">
            <div className="mb-10">
              <span className="text-amber-600 font-medium tracking-widest uppercase text-xs">{t.title}</span>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{t.title}</h3>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              
              {/* Name Input */}
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
                <Input
                  type="text"
                  placeholder={t.name} // Dynamic Translation
                  className="bg-gray-50 dark:bg-[#151515] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-2xl py-7 pl-12 focus:ring-2 focus:ring-amber-500 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Phone */}
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
                  <Input
                    type="tel"
                    placeholder={t.phone} // Dynamic Translation
                    className="bg-gray-50 dark:bg-[#151515] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-2xl py-7 pl-12 focus:ring-2 focus:ring-amber-500 transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                {/* Guests */}
                <div className="relative group">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 transition-colors z-10" />
                  <select
                    className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-2xl py-4 pl-12 pr-8 appearance-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  >
                    <option value="1">{lang === 'en' ? "1 Person" : "1 人"}</option>
                    <option value="2">{lang === 'en' ? "2 Persons" : "2 人"}</option>
                    <option value="4">{lang === 'en' ? "4 Persons" : "4 人"}</option>
                    <option value="6">{lang === 'en' ? "6+ Persons" : "6+ 人"}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Date */}
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
                  <Input
                    type="date"
                    placeholder={t.date} // Dynamic Translation
                    className="bg-gray-50 dark:bg-[#151515] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-2xl py-7 pl-12 focus:ring-2 focus:ring-amber-500 transition-all"
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                {/* Time */}
                <div className="relative group">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
                  <Input
                    type="time"
                    placeholder={t.time} // Dynamic Translation
                    className="bg-gray-50 dark:bg-[#151515] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-2xl py-7 pl-12 focus:ring-2 focus:ring-amber-500 transition-all"
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button className="w-full bg-black dark:bg-white hover:bg-amber-600 dark:hover:bg-amber-500 text-white dark:text-black rounded-2xl py-8 text-lg font-bold transition-all shadow-xl flex gap-3 group">
                  {t.submit} 
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}