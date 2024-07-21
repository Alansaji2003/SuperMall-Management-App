import React, { useState, useEffect } from 'react'
import NavBar from '../common/NavBar'
import Dashboard from './Dashboard'
import Footer from '../common/Footer'
import { FirebaseProvider } from '../../scripts/firebaseContext'
import { ShopProvider } from '../../scripts/ShopDetailContext'

function Layout() {
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const currentHour = new Date().getHours()
    if (currentHour < 12) {
      setGreeting('Good Morning 🌤️')
    } else if (currentHour < 18) {
      setGreeting('Good Afternoon ☀️')
    } else {
      setGreeting('Good Evening 🌆')
    }
  }, [])

  return (
    <div>
    <FirebaseProvider>
    <ShopProvider>
      <NavBar greeting={greeting} />
        <Dashboard />
        </ShopProvider>
      </FirebaseProvider>
      <Footer />
    </div>
  )
}

export default Layout
