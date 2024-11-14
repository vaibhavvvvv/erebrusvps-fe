'use client'
import { ConnectButton, useWalletKit } from '@mysten/wallet-kit'

// interface WalletConnectProps {
//   onConnect: () => void;
// }

export default function WalletConnect() {
  const { currentAccount, disconnect } = useWalletKit()

  return (
    <div className="flex items-center gap-4">
      {currentAccount ? (
        <div className="flex items-center gap-4 bg-gray-900 p-3 rounded-lg border border-gray-800">
          <span className="text-gray-300">
            Connected: <span className="text-blue-400">{currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}</span>
          </span>
          <button
            onClick={disconnect}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Disconnect
          </button>
        </div>
      ) : (
       <ConnectButton connectText="Connect Wallet" />
      )}
    </div>
  )
}