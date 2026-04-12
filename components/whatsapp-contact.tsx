'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { MessageCircle, X } from 'lucide-react'

export function WhatsAppContact() {
  const [showMenu, setShowMenu] = useState(false)
  const pathname = usePathname()
  const contacts = [
    {
      name: 'Customer Support',
      phone: '3084948853',
      number: '+923084948853',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'Complaint Agent',
      phone: '3173070894',
      number: '+923173070894',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
  ]

  const handleWhatsAppClick = (phoneNumber: string) => {
    const message = encodeURIComponent('Hello, I need assistance')
    window.open(`https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${message}`, '_blank')
    setShowMenu(false)
  }

  return (
    <>
      {/* Overlay when menu is open */}
      {showMenu && (
        <div
          className="fixed inset-0 z-[998]"
          onClick={() => setShowMenu(false)}
        />
      )}

      {/* WhatsApp Contact Button - Fixed position Bottom Left */}
      <div className="fixed bottom-24 md:bottom-6 left-6 z-[999] flex items-center transition-all duration-300">
        
        {/* Main WhatsApp Button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="relative bg-green-500 hover:bg-green-600 text-white p-2 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 z-10"
          aria-label="Contact us on WhatsApp"
        >
          {showMenu ? (
            <X className="w-5 md:w-6 h-5 md:h-6" />
          ) : (
            <MessageCircle className="w-5 md:w-6 h-5 md:h-6" />
          )}
        </button>

        {/* Popup Menu - appears on RIGHT side of button */}
        {showMenu && (
          <div className="absolute left-full bottom-0 ml-3 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-3 space-y-2 animate-in fade-in slide-in-from-left-2 duration-200 z-[1002]">
            {contacts.map((contact) => (
              <button
                key={contact.phone}
                onClick={() => handleWhatsAppClick(contact.number)}
                className="flex flex-col gap-1 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-left whitespace-nowrap"
              >
                <span className="font-bold text-sm text-black dark:text-white">{contact.name}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{contact.phone}</span>
              </button>
            ))}
          </div>
        )}

      </div>
    </>
  )
}
