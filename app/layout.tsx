import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Providers from './components/Providers'


export const metadata: Metadata = {
  title: "Erebrus Deployer",
  description: "Decentralized Website Deployer for Sui",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
