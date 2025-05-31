// src/components/Layout.jsx - Updated for Ethereum
import { Link, useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faGavel, faFileContract } from '@fortawesome/free-solid-svg-icons';
import EthereumWalletButton from './Wallet/EthereumWalletButton';

export default function Layout({ children }) {
  const location = useLocation();
  const { isConnected } = useAccount();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: faHome },
    { name: 'Profile', href: '/profile', icon: faUser },
    { name: 'Create Tender', href: '/create-tender', icon: faFileContract },
    { name: 'Create Auction', href: '/create-auction', icon: faGavel },
  ];

  return (
    <div className="min-h-screen bg-appBg">
      <nav className="bg-brown-dark shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold gold-text">My Company D.O.G.E.</h1>
              </Link>
              
              {isConnected && (
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                        location.pathname === item.href
                          ? 'text-gold border-b-2 border-gold'
                          : 'text-gray-300 hover:text-gold hover:border-gray-300'
                      }`}
                    >
                      <FontAwesomeIcon icon={item.icon} className="mr-2" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center">
              <EthereumWalletButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}