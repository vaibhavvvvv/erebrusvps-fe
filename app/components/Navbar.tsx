'use client'
import Link from 'next/link'
import WalletConnect from './WalletConnect'

export default function Navbar() {
  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo/Name */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-2xl font-bold text-blue-500 hover:text-blue-400 transition-colors"
            >
              Erebrus
            </Link>
          </div>

          {/* Right side - Wallet Connect */}
          <div className="flex items-center">
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  )
}