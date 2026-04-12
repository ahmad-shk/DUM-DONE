'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/language-context'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft } from 'lucide-react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

interface CartItem {
  id: string
  name: string
  price: string
  quantity: number
  description?: string
  image?: string
}

interface OrderItem {
  id: string
  items: CartItem[]
  total: string
  status: string
  createdAt: any
  name: string
  phone: string
  email: string
  address: string
  notes: string
}

// Validation Schema
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Full Name is required')
    .min(2, 'Name must be at least 2 characters'),
  phone: Yup.string()
    .required('Phone Number is required')
    .matches(/^[0-9\s\-\+\(\)]+$/, 'Please enter a valid phone number'),
  email: Yup.string()
    .email('Please enter a valid email')
    .nullable(),
  address: Yup.string()
    .required('Delivery Address is required')
    .min(5, 'Address must be at least 5 characters'),
  notes: Yup.string()
})

export default function OrderPage() {
  const router = useRouter()
  const { lang } = useLanguage()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new')

  useEffect(() => {
    // Load cart items from localStorage (same place CartContext stores them)
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart')
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart)
          setCartItems(parsedCart)
        } catch (error) {
          console.error('Error parsing cart items:', error)
        }
      }

      // Load order history from localStorage
      const savedOrders = localStorage.getItem('guestOrders')
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders))
      }
    }
    setLoading(false)
  }, [])

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, '') || '0')
        return total + price * item.quantity
      }, 0)
      .toFixed(2)
  }

  const handleSubmit = async (values: any) => {
    if (cartItems.length === 0) {
      alert(lang === 'en' ? 'Please add items from menu' : '请从菜单中添加商品')
      return
    }

    setIsSubmitting(true)
    try {
      // Prepare order payload with complete cart item details
      const orderPayload = {
        name: values.name,
        phone: values.phone,
        email: values.email || '',
        address: values.address,
        notes: values.notes || '',
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          description: item.description || '',
          image: item.image || ''
        })),
        total: getTotalPrice(),
        status: 'pending',
        createdAt: new Date().toISOString()
      }

      // Send POST request to backend
      const response = await axios.post(
        'https://dum-done-back-end.vercel.app/api/order-confirmation',
        orderPayload
      )

      if (response.status === 200 || response.status === 201) {
        // Save to local storage for history
        const updatedOrders = [...orders, { ...orderPayload, id: Math.random().toString(36).substr(2, 9) }]
        localStorage.setItem('guestOrders', JSON.stringify(updatedOrders))

        // Clear cart
        sessionStorage.removeItem('cartItems')
        setCartItems([])

        // Show success message
        alert(lang === 'en' ? 'Order placed successfully!' : '订单成功下达！')

        // Redirect to menu
        setTimeout(() => {
          router.push('/menu')
        }, 1500)
      }
    } catch (error: any) {
      console.error('Error submitting order:', error)
      const errorMessage = error.response?.data?.message || 'Failed to place order'
      alert(lang === 'en' ? errorMessage : '订单失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-white/10">
          <button
            onClick={() => setActiveTab('new')}
            className={`pb-4 font-semibold transition-colors ${
              activeTab === 'new'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {lang === 'en' ? 'Place Order' : '下订单'}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-4 font-semibold transition-colors ${
              activeTab === 'history'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {lang === 'en' ? 'Order History' : '订单历史'}
          </button>
        </div>

        {activeTab === 'new' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <button
                  onClick={() => router.push('/menu')}
                  className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold mb-4"
                >
                  <ArrowLeft className="w-5 h-5" />
                  {lang === 'en' ? 'Back to Menu' : '返回菜单'}
                </button>
                <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
                  {lang === 'en' ? 'Checkout' : '结账'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {lang === 'en' ? 'Complete your order details below' : '在下面完成您的订单详情'}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-amber-600 border-b-2 border-amber-600 pb-2 mb-6">
                  {lang === 'en' ? 'Order Details' : '订单详情'}
                </h2>

                <Formik
                  initialValues={{
                    name: '',
                    phone: '',
                    email: '',
                    address: '',
                    notes: ''
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, isSubmitting: formSubmitting }) => (
                    <Form className="space-y-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                          {lang === 'en' ? 'Full Name' : '全名'} <span className="text-red-500">*</span>
                        </label>
                        <Field
                          as="input"
                          type="text"
                          name="name"
                          placeholder={lang === 'en' ? 'Enter your full name' : '输入您的全名'}
                          className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-black border ${
                            touched.name && errors.name
                              ? 'border-red-500'
                              : 'border-gray-300 dark:border-white/20'
                          } text-black dark:text-white focus:ring-2 focus:ring-amber-600 outline-none transition`}
                        />
                        <ErrorMessage
                          name="name"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Phone & Email */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                            {lang === 'en' ? 'Phone Number' : '电话'} <span className="text-red-500">*</span>
                          </label>
                          <Field
                            as="input"
                            type="tel"
                            name="phone"
                            placeholder={lang === 'en' ? 'Enter your phone number' : '输入您的电话'}
                            className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-black border ${
                              touched.phone && errors.phone
                                ? 'border-red-500'
                                : 'border-gray-300 dark:border-white/20'
                            } text-black dark:text-white focus:ring-2 focus:ring-amber-600 outline-none transition`}
                          />
                          <ErrorMessage
                            name="phone"
                            component="p"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                            {lang === 'en' ? 'Email (Optional)' : '电子邮件（可选）'}
                          </label>
                          <Field
                            as="input"
                            type="email"
                            name="email"
                            placeholder={lang === 'en' ? 'Enter your email' : '输入您的电子邮件'}
                            className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-black border ${
                              touched.email && errors.email
                                ? 'border-red-500'
                                : 'border-gray-300 dark:border-white/20'
                            } text-black dark:text-white focus:ring-2 focus:ring-amber-600 outline-none transition`}
                          />
                          <ErrorMessage
                            name="email"
                            component="p"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                          {lang === 'en' ? 'Delivery Address' : '配送地址'} <span className="text-red-500">*</span>
                        </label>
                        <Field
                          as="textarea"
                          name="address"
                          placeholder={lang === 'en' ? 'Street, Building, Apartment No.' : '街道、建筑、公寓号'}
                          rows={3}
                          className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-black border ${
                            touched.address && errors.address
                              ? 'border-red-500'
                              : 'border-gray-300 dark:border-white/20'
                          } text-black dark:text-white focus:ring-2 focus:ring-amber-600 outline-none transition`}
                        />
                        <ErrorMessage
                          name="address"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Special Instructions */}
                      <div>
                        <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                          {lang === 'en' ? 'Special Instructions' : '特殊说明'}
                        </label>
                        <Field
                          as="textarea"
                          name="notes"
                          placeholder={lang === 'en' ? 'Any allergies or delivery notes...' : '任何过敏症或配送说明...'}
                          rows={4}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-white/20 text-black dark:text-white focus:ring-2 focus:ring-amber-600 outline-none transition"
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={formSubmitting || isSubmitting}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <Spinner className="w-5 h-5" />
                            {lang === 'en' ? 'Processing...' : '处理中...'}
                          </div>
                        ) : (
                          lang === 'en' ? 'Confirm Order' : '确认订单'
                        )}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl sticky top-24">
                <h3 className="text-2xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                  📦 {lang === 'en' ? 'Order Summary' : '订单摘要'}
                </h3>

                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {lang === 'en' ? 'Your cart is empty' : '您的购物车是空的'}
                    </p>
                    <Button
                      onClick={() => router.push('/menu')}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                    >
                      {lang === 'en' ? 'Browse Menu' : '浏览菜单'}
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                      {cartItems.map((item) => {
                        const price = parseFloat(item.price.replace(/[^0-9.]/g, '') || '0')
                        const itemTotal = (price * item.quantity).toFixed(2)

                        return (
                          <div
                            key={item.id}
                            className="flex justify-between items-start p-3 bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-black dark:text-white">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {lang === 'en' ? 'Qty' : '数量'}: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-amber-600">
                                {lang === 'en' ? 'Rs.' : '¥'}{itemTotal}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {item.price} each
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-300 dark:border-white/10 my-4" />

                    {/* Total */}
                    <div className="flex justify-between items-center mb-6">
                      <p className="text-lg font-bold text-black dark:text-white">
                        {lang === 'en' ? 'Total' : '总计'}
                      </p>
                      <p className="text-2xl font-bold text-amber-600">
                        {lang === 'en' ? 'Rs.' : '¥'}{getTotalPrice()}
                      </p>
                    </div>
                  </>
                )}
              </Card>
            </div>
          </div>
        ) : (
          /* Order History Tab */
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
              {lang === 'en' ? 'Your Order History' : '您的订单历史'}
            </h2>

            {orders.length === 0 ? (
              <Card className="p-8 text-center bg-gray-50 dark:bg-black/20">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {lang === 'en' ? 'No orders yet' : '还没有订单'}
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card
                    key={order.id}
                    className="p-6 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-semibold text-black dark:text-white">
                          {order.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Order ID: {order.id}
                        </p>
                      </div>
                      <p className="font-bold text-amber-600">
                        Rs.{order.total}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          {lang === 'en' ? 'Phone' : '电话'}
                        </p>
                        <p className="text-black dark:text-white">{order.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          {lang === 'en' ? 'Status' : '状态'}
                        </p>
                        <p className="text-black dark:text-white capitalize">
                          {order.status}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-300 dark:border-white/10 pt-4">
                      <p className="text-sm font-semibold text-black dark:text-white mb-2">
                        {lang === 'en' ? 'Items' : '商品'}
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            {item.name} x{item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
