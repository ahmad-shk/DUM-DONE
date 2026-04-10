'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useFirebaseAuth } from '@/lib/firebase-context'
import { useLanguage } from '@/lib/language-context'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Truck, MapPin, Phone, Mail, User, Package, LogOut } from 'lucide-react'

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
  const { user, userData, loading, orders, addOrder, logout } = useFirebaseAuth()
  const router = useRouter()
  const { lang } = useLanguage()
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'new'>('profile')
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
  const [showOrderForm, setShowOrderForm] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
    
    // Pre-fill form with user data
    if (userData) {
      setFormData(prev => ({
        ...prev,
        name: userData.name || '',
        phone: userData.phone || '',
        address: userData.address || '',
      }))
    }
    
    // Retrieve cart items from sessionStorage if available
    if (typeof window !== 'undefined') {
      const storedCart = sessionStorage.getItem('cartItems')
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart)
          setCartItems(parsedCart)
          sessionStorage.removeItem('cartItems')
        } catch (error) {
          console.error('[v0] Error parsing cart items:', error)
        }
      }
    }
  }, [user, userData, loading, router])

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cartItems.length === 0) {
      alert('Please add items from menu')
      return
    }

    setSubmitting(true)
    try {
      await addOrder({
        ...formData,
        items: cartItems,
        total: getTotalPrice(),
        status: 'pending',
      })
      setFormData({
        name: userData?.name || '',
        phone: userData?.phone || '',
        address: userData?.address || '',
        deliveryDate: '',
        deliveryTime: '',
        items: [],
        notes: '',
      })
      setCartItems([])
      setShowOrderForm(false)
      alert('Order placed successfully!')
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
    setCartItems(prevItems => prevItems.filter((_, i) => i !== index))
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <Spinner />
      </main>
    )
  }

  if (!user) {
    return null
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
              Back
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
                  {lang === 'en' ? 'Your Account' : '您的账户'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut size={18} />
                Logout
              </Button>
            </div>
          </div>

          {/* User Profile Card */}
          <Card className="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-black dark:text-white">
                  {userData?.name || user.email?.split('@')[0] || 'User'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{user.email}</p>
                {userData?.phone && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1 mt-1">
                    <Phone size={14} /> {userData.phone}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-amber-600">
                  <Package size={20} />
                  <span className="font-bold text-2xl">{orders.length}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {lang === 'en' ? 'Orders' : '订单'}
                </p>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-white/10">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-4 font-semibold transition-colors ${
                activeTab === 'profile'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {lang === 'en' ? 'Profile' : '个人资料'}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-4 font-semibold transition-colors ${
                activeTab === 'history'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {lang === 'en' ? 'Order History' : '订单历史'} ({orders.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('new')
                setShowOrderForm(true)
              }}
              className={`pb-4 font-semibold transition-colors ${
                activeTab === 'new'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {lang === 'en' ? 'Place Order' : '下单'}
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card className="p-8 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-2xl">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
                {lang === 'en' ? 'Account Information' : '账户信息'}
              </h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">
                      Email
                    </p>
                    <p className="font-semibold text-black dark:text-white flex items-center gap-2">
                      <Mail size={16} className="text-amber-600" />
                      {user.email}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">
                      {lang === 'en' ? 'Member Since' : '注册时间'}
                    </p>
                    <p className="font-semibold text-black dark:text-white">
                      {userData?.createdAt 
                        ? new Date(userData.createdAt?.toDate?.() || userData.createdAt).toLocaleDateString()
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>

                {userData?.address && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">
                      {lang === 'en' ? 'Saved Address' : '保存的地址'}
                    </p>
                    <p className="font-semibold text-black dark:text-white flex items-center gap-2">
                      <MapPin size={16} className="text-amber-600" />
                      {userData.address}
                    </p>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                  <Button
                    onClick={() => router.push('/menu')}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {lang === 'en' ? 'Browse Menu' : '浏览菜单'}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Order History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <Card className="p-12 text-center bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10">
                  <Truck className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                    {lang === 'en' ? 'No orders yet. Start ordering now!' : '还没有订单。现在开始订购！'}
                  </p>
                  <Button
                    onClick={() => router.push('/menu')}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {lang === 'en' ? 'Go to Menu' : '去菜单'}
                  </Button>
                </Card>
              ) : (
                orders.map((order: OrderItem, idx) => (
                  <Card
                    key={idx}
                    className="p-6 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-2xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">
                          Order #{order.id?.slice(-6).toUpperCase() || idx + 1}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold ${
                        order.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                        order.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      }`}>
                        {order.status?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="font-bold text-lg text-black dark:text-white mb-4">
                          {lang === 'en' ? 'Delivery Details' : '配送详情'}
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <MapPin size={16} className="text-amber-600" />
                            <span>{order.address || 'Address not provided'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Phone size={16} className="text-amber-600" />
                            <span>{order.phone || 'Phone not provided'}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-lg text-black dark:text-white mb-4">
                          {lang === 'en' ? 'Delivery Time' : '配送时间'}
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">
                              {lang === 'en' ? 'Date' : '日期'}
                            </p>
                            <p className="font-semibold text-black dark:text-white">
                              {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">
                              {lang === 'en' ? 'Time' : '时间'}
                            </p>
                            <p className="font-semibold text-black dark:text-white">
                              {order.deliveryTime || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="border-t border-gray-200 dark:border-white/10 pt-6 mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-black dark:text-white">
                          {lang === 'en' ? 'Items' : '商品'}
                        </h3>
                        <span className="text-lg font-bold text-amber-600">
                          Total: Rs {order.total}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {order.items?.map((item: any, itemIdx: number) => (
                          <div key={itemIdx} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                            <span>{item.name} x{item.quantity || 1}</span>
                            <span>Rs {(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Place Order Tab */}
          {activeTab === 'new' && showOrderForm && (
            <Card className="p-8 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-2xl">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
                {lang === 'en' ? 'New Order' : '新订单'}
              </h2>

              <form onSubmit={handleAddOrder} className="space-y-6">
                {/* Order Items from Menu */}
                <div>
                  <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                    {lang === 'en' ? 'Select Items from Menu' : '从菜单选择商品'}
                  </label>
                  <Button
                    type="button"
                    onClick={() => router.push('/menu')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  >
                    {lang === 'en' ? 'Go to Menu' : '去菜单'}
                  </Button>
                  {cartItems.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <p className="font-semibold text-black dark:text-white">
                        {lang === 'en' ? 'Selected Items' : '选定的商品'}:
                      </p>
                      {cartItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-3 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-white/10"
                        >
                          <span>{item.name} x{item.quantity || 1}</span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(idx)}
                            className="text-red-600 hover:text-red-700 font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <div className="text-lg font-bold text-amber-600">
                        Total: Rs {getTotalPrice()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                      {lang === 'en' ? 'Name' : '姓名'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-white/20 text-black dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                      {lang === 'en' ? 'Phone' : '电话'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-white/20 text-black dark:text-white"
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
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-white/20 text-black dark:text-white"
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
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-white/20 text-black dark:text-white"
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
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-white/20 text-black dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                    {lang === 'en' ? 'Special Notes' : '特殊说明'}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-white/20 text-black dark:text-white"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting || cartItems.length === 0}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3"
                >
                  {submitting ? 'Placing Order...' : 'Place Order'}
                </Button>
              </form>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
