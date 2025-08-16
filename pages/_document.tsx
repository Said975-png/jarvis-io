import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ru">
      <Head>

        {/* Защита от открытия консоли и DevTools */}
        <script src="/protection.js" />
        
        {/* Мета теги для защиты */}
        <meta name="referrer" content="no-referrer" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
