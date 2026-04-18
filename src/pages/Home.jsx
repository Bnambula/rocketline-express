import React from 'react'
import HeroSection from '../components/hero/HeroSection'
import LeavingSoonSection from '../components/sections/LeavingSoonSection'
import WhereWeGoSection from '../components/sections/WhereWeGoSection'
import ServicesGrid from '../components/sections/ServicesGrid'
import HowItWorksSection from '../components/sections/HowItWorksSection'
import WhyChooseSection from '../components/sections/WhyChooseSection'
import OperatorSection from '../components/sections/OperatorSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import Footer from '../components/layout/Footer'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <LeavingSoonSection />
      <WhereWeGoSection />
      <ServicesGrid />
      <HowItWorksSection />
      <WhyChooseSection />
      <OperatorSection />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}
