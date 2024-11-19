import './globals.css'
import {ReactQueryProvider} from './react-query-provider'

export const metadata = {
  title: 'Cards Against Humanity',
  description: 'A game where randomness meets creativity, and every move becomes a collectible memory on the blockchain. Powered by Blinks on Solana',
}

const links: { label: string; path: string }[] = [
  { label: 'Account', path: '/account' },
  { label: 'Clusters', path: '/clusters' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
                {children}
        </ReactQueryProvider>
      </body>
    </html>
  )
}
