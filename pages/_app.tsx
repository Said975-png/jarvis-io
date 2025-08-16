import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'
import '../styles/theme.css'
import { AuthProvider } from '../contexts/AuthContext'
import { CartProvider } from '../contexts/CartContext'
import { OrderProvider } from '../contexts/OrderContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import CodeProtection from '../components/CodeProtection'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <CodeProtection />
              <Component {...pageProps} />
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}
