'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  initializeApp,
  getApp,
} from 'firebase/app'
import {
  getAuth,
  signInWithCustomToken,
  signOut,
  Auth,
  User,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
}

interface UserData {
  email: string
  uid: string
  createdAt: any
  lastLogin?: any
  name?: string
  phone?: string
  address?: string
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  sendOTP: (email: string) => Promise<{ success: boolean; message: string }>
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; isNewUser: boolean; message: string }>
  logout: () => Promise<void>
  orders: any[]
  fetchOrders: (userId: string) => Promise<void>
  addOrder: (orderData: any) => Promise<string>
  updateUserData: (data: Partial<UserData>) => Promise<void>
}

const FirebaseAuthContext = createContext<AuthContextType | undefined>(undefined)

// Generate 6 digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [auth, setAuth] = useState<Auth | null>(null)
  const [db, setDb] = useState<any>(null)

  useEffect(() => {
    try {
      // Check if Firebase config is properly set
      const isConfigured = Object.values(firebaseConfig).every(val => val && val !== "")
      
      if (!isConfigured) {
        console.info('[v0] Firebase credentials not configured. Auth features will be disabled.')
        setLoading(false)
        return
      }

      let app
      try {
        app = getApp()
      } catch {
        app = initializeApp(firebaseConfig)
      }

      const authInstance = getAuth(app)
      const dbInstance = getFirestore(app)
      
      setAuth(authInstance)
      setDb(dbInstance)

      // Check if user is already signed in
      const unsubscribe = authInstance.onAuthStateChanged(async (currentUser) => {
        setUser(currentUser)
        if (currentUser) {
          // Fetch user data from Firestore
          await fetchUserData(currentUser.uid, dbInstance)
          // Fetch user's orders
          await fetchOrdersHelper(currentUser.uid, dbInstance)
        } else {
          setUserData(null)
          setOrders([])
        }
        setLoading(false)
      })

      return () => unsubscribe()
    } catch (error) {
      console.info("[v0] Firebase unavailable. Using offline mode.")
      setLoading(false)
    }
  }, [])

  const fetchUserData = async (userId: string, dbInstance: any) => {
    try {
      const userDoc = await getDoc(doc(dbInstance, 'users', userId))
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData)
      }
    } catch (error) {
      console.error("[v0] Error fetching user data:", error)
    }
  }

  const fetchOrdersHelper = async (userId: string, dbInstance: any) => {
    try {
      const q = query(collection(dbInstance, 'orders'), where('userId', '==', userId))
      const querySnapshot = await getDocs(q)
      const ordersData = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt || 0),
        }
      }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setOrders(ordersData)
    } catch (error) {
      console.error("[v0] Error fetching orders:", error)
      setOrders([])
    }
  }

  const fetchOrders = async (userId: string) => {
    if (!db) return
    await fetchOrdersHelper(userId, db)
  }

  const sendOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
    if (!db) throw new Error("Database not initialized")
    
    try {
      const otp = generateOTP()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
      
      // Store OTP in Firestore
      const otpRef = doc(db, 'otps', email.toLowerCase())
      await setDoc(otpRef, {
        otp,
        email: email.toLowerCase(),
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(expiresAt),
        verified: false,
      })
      
      // Send OTP via API route
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP')
      }
      
      console.log('[v0] OTP sent to email:', email)
      return { success: true, message: `OTP sent to ${email}` }
    } catch (error: any) {
      console.error("[v0] Error sending OTP:", error)
      throw error
    }
  }

  const verifyOTP = async (email: string, otp: string): Promise<{ success: boolean; isNewUser: boolean; message: string }> => {
    if (!db) throw new Error("Database not initialized")
    
    try {
      // Get OTP from Firestore
      const otpRef = doc(db, 'otps', email.toLowerCase())
      const otpDoc = await getDoc(otpRef)
      
      if (!otpDoc.exists()) {
        return { success: false, isNewUser: false, message: 'No OTP found. Please request a new one.' }
      }
      
      const otpData = otpDoc.data()
      
      // Check if OTP is expired
      const expiresAt = otpData.expiresAt?.toDate?.() || new Date(0)
      if (new Date() > expiresAt) {
        return { success: false, isNewUser: false, message: 'OTP has expired. Please request a new one.' }
      }
      
      // Check if OTP matches
      if (otpData.otp !== otp) {
        return { success: false, isNewUser: false, message: 'Invalid OTP. Please try again.' }
      }
      
      // Mark OTP as verified
      await updateDoc(otpRef, { verified: true })
      
      // Check if user exists
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('email', '==', email.toLowerCase()))
      const querySnapshot = await getDocs(q)
      
      let isNewUser = false
      let userId = ''
      
      if (querySnapshot.empty) {
        // Create new user
        isNewUser = true
        userId = email.toLowerCase().replace(/[^a-z0-9]/g, '_')
        
        await setDoc(doc(db, 'users', userId), {
          email: email.toLowerCase(),
          uid: userId,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        })
        
        setUserData({
          email: email.toLowerCase(),
          uid: userId,
          createdAt: new Date(),
        })
      } else {
        // Update existing user's last login
        const userDoc = querySnapshot.docs[0]
        userId = userDoc.id
        await updateDoc(doc(db, 'users', userId), {
          lastLogin: serverTimestamp(),
        })
        
        setUserData(userDoc.data() as UserData)
      }
      
      // Store user session in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('userSession', JSON.stringify({
          email: email.toLowerCase(),
          uid: userId,
          loggedInAt: new Date().toISOString(),
        }))
      }
      
      // Set mock user for the session
      setUser({
        uid: userId,
        email: email.toLowerCase(),
      } as User)
      
      // Fetch orders for the user
      await fetchOrdersHelper(userId, db)
      
      console.log('[v0] User verified and signed in:', email, isNewUser ? '(new user)' : '(existing user)')
      return { 
        success: true, 
        isNewUser, 
        message: isNewUser ? 'Account created successfully!' : 'Welcome back!' 
      }
    } catch (error: any) {
      console.error("[v0] Error verifying OTP:", error)
      throw error
    }
  }

  const logout = async () => {
    if (auth) {
      try {
        await signOut(auth)
      } catch (e) {
        // Ignore auth errors
      }
    }
    setUser(null)
    setUserData(null)
    setOrders([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userSession')
    }
  }

  const updateUserData = async (data: Partial<UserData>): Promise<void> => {
    if (!user || !db) throw new Error("User not authenticated or DB not initialized")
    
    try {
      await updateDoc(doc(db, 'users', user.uid), data)
      setUserData(prev => prev ? { ...prev, ...data } : null)
    } catch (error) {
      console.error("[v0] Error updating user data:", error)
      throw error
    }
  }

  const addOrder = async (orderData: any): Promise<string> => {
    if (!user || !db) throw new Error("User not authenticated or DB not initialized")
    
    try {
      const ordersRef = collection(db, 'orders')
      const docRef = await addDoc(ordersRef, {
        ...orderData,
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp(),
      })
      
      // Fetch updated orders
      await fetchOrdersHelper(user.uid, db)
      console.log('[v0] Order added:', docRef.id)
      
      return docRef.id
    } catch (error) {
      console.error("[v0] Error adding order:", error)
      throw error
    }
  }

  // Check for existing session on mount
  useEffect(() => {
    if (!loading && !user && db) {
      const session = typeof window !== 'undefined' ? localStorage.getItem('userSession') : null
      if (session) {
        try {
          const sessionData = JSON.parse(session)
          // Check if session is less than 7 days old
          const loggedInAt = new Date(sessionData.loggedInAt)
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          
          if (loggedInAt > sevenDaysAgo) {
            setUser({
              uid: sessionData.uid,
              email: sessionData.email,
            } as User)
            fetchUserData(sessionData.uid, db)
            fetchOrdersHelper(sessionData.uid, db)
          } else {
            localStorage.removeItem('userSession')
          }
        } catch (e) {
          localStorage.removeItem('userSession')
        }
      }
    }
  }, [loading, user, db])

  return (
    <FirebaseAuthContext.Provider value={{ 
      user, 
      userData,
      loading, 
      sendOTP, 
      verifyOTP, 
      logout, 
      orders, 
      fetchOrders, 
      addOrder,
      updateUserData 
    }}>
      {children}
    </FirebaseAuthContext.Provider>
  )
}

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext)
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within FirebaseAuthProvider')
  }
  return context
}
