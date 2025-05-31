// src/components/Wallet/CustomWalletButton.jsx
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCopy, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

// Create a completely custom button that doesn't use ANY wallet adapter UI components
export default function CustomWalletButton() {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [copied, setCopied] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Force gold background style - DO NOT rely on classes that might be overridden
  const goldButtonStyle = {
    backgroundColor: '#D4AF37',
    color: 'black',
    borderRadius: '9999px',
    padding: '0.5rem 1.5rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
    boxShadow: 'none',
    outline: 'none',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.875rem',
    lineHeight: '1.25rem'
  };

  const goldButtonHoverStyle = {
    ...goldButtonStyle,
    backgroundColor: '#c09c31', // Slightly darker gold on hover
  };

  // State to track hover
  const [isHovered, setIsHovered] = useState(false);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleConnect = () => {
    setVisible(true);
  };

  const handleDisconnect = () => {
    disconnect();
    setDropdownVisible(false);
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Truncate address for display
  const truncatedAddress = publicKey 
    ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` 
    : '';
  
  return (
    <div className="relative" ref={dropdownRef}>
      {connected ? (
        <>
          <button
            onClick={() => setDropdownVisible(!dropdownVisible)}
            style={isHovered ? goldButtonHoverStyle : goldButtonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {truncatedAddress}
            <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: '0.5rem' }} />
          </button>
          
          {dropdownVisible && (
            <div style={{
              position: 'absolute',
              right: 0,
              marginTop: '0.5rem',
              width: '12rem',
              borderRadius: '0.375rem',
              backgroundColor: '#1A120B',
              border: '1px solid #333',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              zIndex: 50
            }}>
              <div style={{ padding: '0.25rem 0' }}>
                <button
                  onClick={copyAddress}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    color: '#d1d5db',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#D4AF37';
                    e.currentTarget.style.color = 'black';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#d1d5db';
                  }}
                >
                  <FontAwesomeIcon icon={faCopy} style={{ marginRight: '0.5rem' }} />
                  {copied ? 'Copied!' : 'Copy Address'}
                </button>
                <button
                  onClick={handleDisconnect}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    color: '#d1d5db',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#D4AF37';
                    e.currentTarget.style.color = 'black';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#d1d5db';
                  }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '0.5rem' }} />
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={handleConnect}
          style={isHovered ? goldButtonHoverStyle : goldButtonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Enter App
        </button>
      )}
    </div>
  );
}