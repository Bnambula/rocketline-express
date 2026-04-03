import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import MobileBottomNav from './components/layout/MobileBottomNav'
import Home from './pages/Home'
import BookingFlow from './pages/BookingFlow'
import ParcelPage from './pages/ParcelPage'
import OperatorDashboard from './pages/operator/OperatorDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import PartnerPortal from './pages/PartnerPortal'
import ToastContainer from './components/ui/ToastContainer'
import { ToastContext } from './hooks/useToast'

export default function App() {
  const [toasts, setToasts] = useState([])

  const addToast = (msg, type = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }

  return (
    <ToastContext.Provider value={addToast}>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<BookingFlow />} />
          <Route path="/parcels" element={<ParcelPage />} />
          <Route path="/operator" element={<OperatorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/partner" element={<PartnerPortal />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <MobileBottomNav />
        <ToastContainer toasts={toasts} />
      </div>
    </ToastContext.Provider>
  )
}
