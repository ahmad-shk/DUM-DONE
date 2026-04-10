'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  initializeApp,
  getApp,
} from 'firebase/app'
import {
  getAuth,
  signInWithEmailLink,
  isSignInWithEmailLink,
  signOut,
  Auth,
  User,
  sendSignInLinkToEmail,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  serverTimestamp,
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

interface AuthContextType {
  user: User | null
  loading: boolean
  sendOTP: (email: string) => Promise<void>
  verifyOTP: (email: string) => Promise<void>
  logout: () => Promise<void>
  orders: any[]
  fetchOrders: (userId: string) => Promise<void>
  addOrder: (orderData: any) => Promise<string>
}

const FirebaseAuthContext = createContext<AuthContextType | undefined>(undefined)

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
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
          // Fetch user's orders
          await fetchOrdersHelper(currentUser.uid, dbInstance)
        } else {
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

  const sendOTP = async (email: string) => {
    if (!auth) throw new Error("Auth not initialized")
    
    try {
      const actionCodeSettings = {
        url: `${typeof window !== 'undefined' ? window.location.origin : ''}/verify-otp?email=${encodeURIComponent(email)}`,
        handleCodeInApp: true,
      }
      
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('emailForSignIn', email)
      }
      console.log('[v0] OTP sent to email:', email)
    } catch (error) {
      console.error("[v0] Error sending OTP:", error)
      throw error
    }
  }

  const verifyOTP = async (email: string) => {
    if (!auth || !db) throw new Error("Auth or DB not initialized")
    
    try {
      if (typeof window !== 'undefined' && isSignInWithEmailLink(auth, window.location.href)) {
        const result = await signInWithEmailLink(auth, email, window.location.href)
        const userEmail = result.user.email

        // Create/update user document in Firestore
        const usersRef = collection(db, 'users')
        const q = query(usersRef, where('email', '==', userEmail))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          await addDoc(usersRef, {
            email: userEmail,
            createdAt: serverTimestamp(),
            uid: result.user.uid,
          })
        }

        setUser(result.user)
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('emailForSignIn')
        }
        console.log('[v0] User verified and signed in:', email)
      }
    } catch (error) {
      console.error("[v0] Error verifying OTP:", error)
      throw error
    }
  }

  const logout = async () => {
    if (!auth) throw new Error("Auth not initialized")
    await signOut(auth)
    setUser(null)
    setOrders([])
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

  return (
    <FirebaseAuthContext.Provider value={{ user, loading, sendOTP, verifyOTP, logout, orders, fetchOrders, addOrder }}>
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
