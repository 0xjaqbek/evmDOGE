// src/components/Layout/Header.jsx
import { Link } from 'react-router-dom';
import WalletButton from '../Wallet/WalletButton';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { currentUser } = useAuth();

  return (
    <header className="bg-brown-dark shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-gold text-xl font-bold hover:text-gold-light transition duration-150">
              mini D.O.G.E.
            </Link>
            {currentUser && (
              <nav className="ml-10 flex space-x-4">
                <Link 
                  to="/dashboard" 
                  className="text-gray-300 hover:text-gold hover:border-b hover:border-gold px-3 py-2 text-sm font-medium transition duration-150"
                >
                  Dashboard
                </Link>

                <Link 
                  to="/profile" 
                  className="text-gray-300 hover:text-gold hover:border-b hover:border-gold px-3 py-2 text-sm font-medium transition duration-150"
                >
                  Profile
                </Link>
              </nav>
            )}
          </div>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}