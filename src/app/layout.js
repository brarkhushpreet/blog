import { Inter } from 'next/font/google'
import './globals.css'
import Navabar from '../components/navabar/navabar'
import Footer from '../components/footer/Footer'



const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Next App',
  description: 'Next.js starter app',
}

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <div className='container'>
      <Navabar />
        {children}
        <Footer/>
      </div>
       </body>
    </html>
  )
}