// src/components/Wallet/WalletButton.jsx
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function WalletButton() {
  return (
    <div className="flex items-center">
      <div className="wallet-adapter-dropdown">
        <WalletMultiButton className="!bg-gold !rounded-md !px-4 !py-2 !text-black !font-medium !shadow-sm hover:!bg-gold-dark !transition !duration-150 !ease-in-out !border-none" />
      </div>
    </div>
  );
}