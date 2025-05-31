// src/components/Wallet/StyledWalletButton.jsx
import React, { useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export default function StyledWalletButton() {
  const { connected } = useWallet();
  
  // Apply CSS overrides when component mounts and when connection status changes
  useEffect(() => {
    // Target the actual button element and apply our styling
    const applyCustomStyling = () => {
      const walletButton = document.querySelector('.wallet-adapter-button-trigger');
      if (walletButton) {
        // Set the button text to "Join Presale" when not connected
        if (!connected && walletButton.textContent !== "Join Presale") {
          walletButton.textContent = "Join Presale";
        }
        
        // Apply our gold styling
        walletButton.style.backgroundColor = '#D4AF37';
        walletButton.style.color = 'black';
        walletButton.style.borderRadius = '9999px'; // rounded-full
        walletButton.style.padding = '0.5rem 1.5rem';
      }
    };
    
    // Apply immediately 
    applyCustomStyling();
    
    // Apply after a short delay to ensure it works after any wallet adapter renders
    const timeoutId = setTimeout(applyCustomStyling, 100);
    
    return () => clearTimeout(timeoutId);
  }, [connected]);
  
  return (
    <WalletMultiButton className="wallet-button-override" />
  );
}