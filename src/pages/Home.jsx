import React from 'react'
import HeroSection from '../components/sections/HeroSection'
import WhereWeGoSection from '../components/sections/WhereWeGoSection'
import AvailableTripsSection from '../components/sections/AvailableTripsSection'
import HowItWorksSection from '../components/sections/HowItWorksSection'
import SeatSelectionSection from '../components/sections/SeatSelectionSection'
import ParcelSection from '../components/sections/ParcelSection'
import WhyChooseSection from '../components/sections/WhyChooseSection'
import OperatorSection from '../components/sections/OperatorSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import TravelTipsSection from '../components/sections/TravelTipsSection'
import Footer from '../components/layout/Footer'
import AIAssistant from '../components/ui/AIAssistant'

export default function Home() {
  return (
    <main style={{ paddingBottom: 64 }}>
      <HeroSection />
      <WhereWeGoSection />
      <AvailableTripsSection />
      <HowItWorksSection />
      <SeatSelectionSection />
      <ParcelSection />
      <WhyChooseSection />
      <OperatorSection />
      <TestimonialsSection />
      <TravelTipsSection />
      <Footer />
      <AIAssistant />
    </main>
  )
}
