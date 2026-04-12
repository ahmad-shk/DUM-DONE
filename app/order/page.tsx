'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
      alert(lang === 'en' ? 'Please add items from menu' : 'براہ کرم مینو سے آئٹمز شامل کریں')
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
        alert(lang === 'en' ? 'Order placed successfully!' : 'آرڈر کامیابی سے دیا گیا!')

        // Redirect to menu
        setTimeout(() => {
          router.push('/menu')
        }, 1500)
      }
    } catch (error: any) {
      console.error('Error submitting order:', error)
      const errorMessage = error.response?.data?.message || 'Failed to place order'
      alert(lang === 'en' ? errorMessage : 'آرڈر ناکام ہو گیا، براہ کرم دوبارہ کوشش کریں')
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
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 md:py-10 pb-28 md:pb-10">
        {/* Page Header */}
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-bold text-black dark:text-white mb-2">
            {lang === 'en' ? 'Your Order' : 'آپ کا آرڈر'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
            {lang === 'en' ? 'Complete your order and enjoy delicious food' : 'اپنا آرڈر مکمل کریں اور سستی کا ذائقہ لیں'}
          </p>
        </div>

        {/* Tabs - Pill Style */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('new')}
            className={`px-5 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${
              activeTab === 'new'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700'
            }`}
          >
            {lang === 'en' ? 'Place Order' : 'آرڈر دیں'}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${
              activeTab === 'history'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700'
            }`}
          >
            {lang === 'en' ? 'Order History' : 'آرڈر کا تاریخ'}
          </button>
        </div>

        {activeTab === 'new' ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
            {/* Form Section */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <Card className="p-5 md:p-8 bg-white dark:bg-zinc-900 border-0 shadow-sm rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg md:text-xl font-bold text-black dark:text-white">
                    {lang === 'en' ? 'Delivery Details' : 'ڈیلیوری کے تفصیلات'}
                  </h2>
                  <button
                    onClick={() => router.push('/menu')}
                    className="flex items-center gap-1.5 text-amber-600 hover:text-amber-700 text-sm font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {lang === 'en' ? 'Add more' : 'مزید شامل کریں'}
                  </button>
                </div>

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
                    <Form className="space-y-5">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          {lang === 'en' ? 'Full Name' : 'پورا نام'} <span className="text-red-500">*</span>
                        </label>
                        <Field
                          as="input"
                          type="text"
                          name="name"
                          placeholder={lang === 'en' ? 'Enter your full name' : 'اپنا پورا نام درج کریں'}
                          className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border ${
                            touched.name && errors.name
                              ? 'border-red-500'
                              : 'border-gray-200 dark:border-zinc-700'
                          } text-black dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-sm`}
                        />
                        <ErrorMessage
                          name="name"
                          component="p"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>

                      {/* Phone & Email */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            {lang === 'en' ? 'Phone Number' : 'فون نمبر'} <span className="text-red-500">*</span>
                          </label>
                          <Field
                            as="input"
                            type="tel"
                            name="phone"
                            placeholder={lang === 'en' ? 'e.g. 0300-1234567' : 'اپنا فون نمبر ڈالیں'}
                            className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border ${
                              touched.phone && errors.phone
                                ? 'border-red-500'
                                : 'border-gray-200 dark:border-zinc-700'
                            } text-black dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-sm`}
                          />
                          <ErrorMessage
                            name="phone"
                            component="p"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            {lang === 'en' ? 'Email (Optional)' : 'ای میل（اختیاری）'}
                          </label>
                          <Field
                            as="input"
                            type="email"
                            name="email"
                            placeholder={lang === 'en' ? 'you@example.com' : 'اپنا ای میل ڈالیں'}
                            className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border ${
                              touched.email && errors.email
                                ? 'border-red-500'
                                : 'border-gray-200 dark:border-zinc-700'
                            } text-black dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-sm`}
                          />
                          <ErrorMessage
                            name="email"
                            component="p"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          {lang === 'en' ? 'Delivery Address' : 'ڈیلیوری کا پتہ'} <span className="text-red-500">*</span>
                        </label>
                        <Field
                          as="textarea"
                          name="address"
                          placeholder={lang === 'en' ? 'House #, Street, Area, City' : 'سڑک، گھر نمبر، علاقہ، شہر'}
                          rows={2}
                          className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border ${
                            touched.address && errors.address
                              ? 'border-red-500'
                              : 'border-gray-200 dark:border-zinc-700'
                          } text-black dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none text-sm`}
                        />
                        <ErrorMessage
                          name="address"
                          component="p"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>

                      {/* Special Instructions */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          {lang === 'en' ? 'Special Instructions' : 'خصوصی اشارات'}
                        </label>
                        <Field
                          as="textarea"
                          name="notes"
                          placeholder={lang === 'en' ? 'Any allergies or delivery notes...' : ' کوئی الرجی یا ترسیل کی ہدایات...'}
                          rows={2}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-black dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={formSubmitting || isSubmitting}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3.5 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 shadow-lg shadow-amber-600/20 hover:shadow-xl hover:shadow-amber-600/30 text-base"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <Spinner className="w-5 h-5" />
                            {lang === 'en' ? 'Processing...' : 'پروسیسنگ...'}
                          </div>
                        ) : (
                          lang === 'en' ? 'Confirm Order' : 'آرڈر کی تصدیق کریں۔'
                        )}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <Card className="p-5 md:p-6 bg-white dark:bg-zinc-900 border-0 shadow-sm rounded-2xl sticky top-24">
                <h3 className="text-lg md:text-xl font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-sm">
                    🛒
                  </span>
                  {lang === 'en' ? 'Order Summary' : 'آرڈر کا خلاصہ'}
                  <span className="ml-auto text-sm font-normal text-gray-500">
                    {cartItems.length} {lang === 'en' ? 'items' : 'آئٹمز'}
                  </span>
                </h3>

                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                      🍽️
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                      {lang === 'en' ? 'Your cart is empty' : 'آپ کی گاڑی خالی ہے'}
                    </p>
                    <Button
                      onClick={() => router.push('/menu')}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl px-6"
                    >
                      {lang === 'en' ? 'Browse Menu' : 'مینو تلاش کریں'}
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-4 max-h-60 md:max-h-80 overflow-y-auto pr-1">
                      {cartItems.map((item) => {
                        const price = parseFloat(item.price.replace(/[^0-9.]/g, '') || '0')
                        const itemTotal = (price * item.quantity).toFixed(0)

                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl"
                          >
                            {item.image && (
                              <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-black dark:text-white truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.price} x {item.quantity}
                              </p>
                            </div>
                            <p className="font-bold text-amber-600 text-sm">
                              Rs.{itemTotal}
                            </p>
                          </div>
                        )
                      })}
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-100 dark:border-zinc-800 pt-4">
                      <div className="flex justify-between items-center">
                        <p className="text-base font-medium text-gray-600 dark:text-gray-400">
                          {lang === 'en' ? 'Total' : 'کل قیمت'}
                        </p>
                        <p className="text-2xl font-bold text-amber-600">
                          Rs. {getTotalPrice()}
                        </p>
                      </div>
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
              {lang === 'en' ? 'Your Order History' : 'آپ کا آرڈر کا تاریخ'}
            </h2>

            {orders.length === 0 ? (
              <Card className="p-8 text-center bg-gray-50 dark:bg-black/20">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {lang === 'en' ? 'No orders yet' : 'ابھی تک کوئی آرڈر نہیں'}
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
                          {lang === 'en' ? 'Phone' : 'فون نمبر'}
                        </p>
                        <p className="text-black dark:text-white">{order.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          {lang === 'en' ? 'Status' : 'حالت'}
                        </p>
                        <p className="text-black dark:text-white capitalize">
                          {order.status}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-300 dark:border-white/10 pt-4">
                      <p className="text-sm font-semibold text-black dark:text-white mb-2">
                        {lang === 'en' ? 'Items' : 'آئٹمز'}
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
