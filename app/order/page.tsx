'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/language-context'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Truck, MapPin, Phone, Mail, User, Package, ShoppingBag } from 'lucide-react'

// Note: addOrder function ko ab aap apne backend ya firebase service se direct import kar sakte hain
// Bina login context ke.

interface OrderItem {
  id: string
  items: any[]
  total: string
  status: string
  deliveryDate: string
  deliveryTime: string
  createdAt: any
  name: string
  phone: string
  address: string
}

export default function OrderPage() {
  const router = useRouter()
  const { lang } = useLanguage()
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'new'>('new')
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryDate: '',
    deliveryTime: '',
    items: [],
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [showOrderForm, setShowOrderForm] = useState(true)

  useEffect(() => {
    // Session Storage se cart uthana
    if (typeof window !== 'undefined') {
      const storedCart = sessionStorage.getItem('cartItems')
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart)
          setCartItems(parsedCart)
          // Order page par aane ke baad cart clear nahi karte jab tak order place na ho jaye
        } catch (error) {
          console.error('Error parsing cart items:', error)
        }
      }

      // Local storage se purani orders ki history dikhane ke liye (Optional)
      const savedOrders = localStorage.getItem('guestOrders')
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders))
      }
    }
    setLoading(false)
  }, [])

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cartItems.length === 0) {
      alert(lang === 'en' ? 'Please add items from menu' : '请从菜单中添加商品')
      return
    }

    setSubmitting(true)
    try {
      const newOrder: OrderItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        items: cartItems,
        total: getTotalPrice(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      }

      // Yahan aap apni Firebase Firestore logic call kar sakte hain bina user.uid ke
      // await db.collection('orders').add(newOrder)

      // Local state update karein history dikhane ke liye
      const updatedOrders = [newOrder, ...orders]
      setOrders(updatedOrders)
      localStorage.setItem('guestOrders', JSON.stringify(updatedOrders))

      setFormData({
        name: '',
        phone: '',
        address: '',
        deliveryDate: '',
        deliveryTime: '',
        items: [],
        notes: '',
      })
      setCartItems([])
      sessionStorage.removeItem('cartItems')
      alert(lang === 'en' ? 'Order placed successfully!' : '订单提交成功！')
      setActiveTab('history')
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price || 0)
      return total + price * (item.quantity || 1)
    }, 0).toFixed(2)
  }

  const removeFromCart = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index)
    setCartItems(updatedCart)
    sessionStorage.setItem('cartItems', JSON.stringify(updatedCart))
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <Spinner />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <Header />

      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-4 font-semibold"
            >
              <ArrowLeft size={20} />
              {lang === 'en' ? 'Back to Menu' : '返回菜单'}
            </button>
            <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
              {lang === 'en' ? 'Checkout' : '结账'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {lang === 'en' ? 'Complete your order details below' : '请在下面填写您的订单详情'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-white/10">
            <button
              onClick={() => setActiveTab('new')}
              className={`pb-4 font-semibold transition-colors ${
                activeTab === 'new'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {lang === 'en' ? 'Place Order' : '下单'}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-4 font-semibold transition-colors ${
                activeTab === 'history'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
            </button>
          </div>

          {/* Place Order Tab */}
          {activeTab === 'new' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2">
                <Card className="p-8 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-2xl">
                  <form onSubmit={handleAddOrder} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                          {lang === 'en' ? 'Full Name' : '姓名'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-white/20 text-black dark:text-white focus:ring-2 focus:ring-amber-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                          {lang === 'en' ? 'Phone Number' : '电话'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-white/20 text-black dark:text-white focus:ring-2 focus:ring-amber-600 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                        {lang === 'en' ? 'Delivery Address' : '配送地址'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Street, Building, Apartment No."
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-white/20 text-black dark:text-white focus:ring-2 focus:ring-amber-600 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                          {lang === 'en' ? 'Delivery Date' : '配送日期'}
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.deliveryDate}
                          onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-white/20 text-black dark:text-white focus:ring-2 focus:ring-amber-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                          {lang === 'en' ? 'Delivery Time' : '配送时间'}
                        </label>
                        <input
                          type="time"
                          required
                          value={formData.deliveryTime}
                          onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-white/20 text-black dark:text-white focus:ring-2 focus:ring-amber-600 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                        {lang === 'en' ? 'Special Instructions' : '特殊说明'}
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        placeholder={lang === 'en' ? 'Any allergies or delivery notes...' : '过敏要求或备注...'}
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-white/20 text-black dark:text-white focus:ring-2 focus:ring-amber-600 outline-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting || cartItems.length === 0}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg shadow-amber-600/20"
                    >
                      {submitting ? (lang === 'en' ? 'Processing...' : '正在处理...') : (lang === 'en' ? 'Confirm Order' : '确认订单')}
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Order Summary Section */}
              <div className="lg:col-span-1">
                <Card className="p-6 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-2xl sticky top-32">
                  <h3 className="text-xl font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                    <ShoppingBag className="text-amber-600" />
                    {lang === 'en' ? 'Order Summary' : '订单摘要'}
                  </h3>
                  
                  {cartItems.length > 0 ? (
                    <div className="space-y-4">
                      <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3">
                        {cartItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start gap-4 text-sm border-b border-gray-100 dark:border-white/5 pb-2">
                            <div className="flex-1">
                              <p className="font-medium text-black dark:text-white">{item.name}</p>
                              <p className="text-gray-500 text-xs">Qty: {item.quantity || 1}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-black dark:text-white">Rs {(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}</p>
                              <button 
                                onClick={() => removeFromCart(idx)}
                                className="text-red-500 text-[10px] hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-4 border-t-2 border-dashed border-gray-200 dark:border-white/10">
                        <div className="flex justify-between items-center text-xl font-bold">
                          <span className="text-black dark:text-white">Total</span>
                          <span className="text-amber-600">Rs {getTotalPrice()}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4 text-sm">Your cart is empty</p>
                      <Button 
                        variant="outline" 
                        onClick={() => router.push('/menu')}
                        className="w-full border-amber-600 text-amber-600"
                      >
                        Browse Menu
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}