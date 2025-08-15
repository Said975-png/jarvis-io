import { useState, useEffect } from 'react'
import Head from 'next/head'
import SearchableNavbar from '../components/SearchableNavbar'
import Hero from '../components/Hero'
import Pricing from '../components/Pricing'
import Features from '../components/Features'
import Benefits from '../components/Benefits'
import TestimonialsSimple from '../components/TestimonialsSimple'
import ChatManager from '../components/ChatManager'
import Footer from '../components/Footer'
import ShineEffect from '../components/ShineEffect'
import LoadingAnimation from '../components/LoadingAnimation'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Минимальное время загрузки для красивой анимации
    const minLoadingTime = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(minLoadingTime)
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return <LoadingAnimation onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <>
      <Head>
        <title>Jarvis - умный ИИ ассистент</title>
        <meta name="description" content="JARVIS - революционный ИИ-ассистент для создания потрясающих веб-сайтов с использованием искусственного интеллекта" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://cdn.builder.io/api/v1/image/assets%2F321030175d41423db42a978adc722c81%2F37b07a37d18e47b9a7c20f69c11e21f0?format=webp&width=32" />
      </Head>

      {/* Глобальный фон с клеточками */}
      <div className="global-background">
        <div className="global-grid-pattern"></div>
        <div className="global-orb global-orb-1"></div>
        <div className="global-orb global-orb-2"></div>
      </div>

      {/* Эффект сияния как ChatGPT */}
      <ShineEffect />

      <SearchableNavbar />

      <main>
        <Hero />
        <Pricing />
        <Features />
        <Benefits />
        <TestimonialsSimple />
      </main>

      <Footer />
      <ChatManager />
    </>
  )
}

export async function getServerSideProps() {
  return {
    props: {}
  }
}
