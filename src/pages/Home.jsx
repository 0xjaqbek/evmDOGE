// src/pages/Home.jsx - Landing page
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Home() {
  const { connected } = useAccount();
  const navigate = useNavigate();
  
  // Redirect to dashboard if already connected
  useEffect(() => {
    if (connected) {
      navigate('/dashboard');
    }
  }, [connected, navigate]);

  return (

    
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-4xl font-bold text-center mb-6">
        Welcome to mini D.O.G.E.
      </h1>
      <p className="text-xl text-center text-gray-600 mb-8 max-w-2xl">
        Connect your Solana wallet to get started with our decentralized application.
        Manage your profile, interact with smart contracts, and more.
      </p>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-6 text-center">
          Use the button below to connect your Solana wallet. We support Phantom, Solflare, and more.
        </p>
        <div className="flex justify-center">
          {/* The WalletMultiButton is already included in the Header component */}
          <p className="text-sm text-gray-500 mt-2">
            Click the "Select Wallet" button in the top right corner to connect.
          </p>
        </div>
      </div>
    </div>
  );
}
