// src/components/Wallet/EthereumWalletButton.jsx
import { useState, useRef, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCopy, faSignOutAlt, faWallet } from '@fortawesome/free-solid-svg-icons';

export default function EthereumWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showConnectors, setShowConnectors] = useState(false);
  const dropdownRef = useRef(null);

  // Force gold background style
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
    backgroundColor: '#c09c31',
  };

  const [isHovered, setIsHovered] = useState(false);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
        setShowConnectors(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleConnect = () => {
    setShowConnectors(true);
  };

  const handleDisconnect = () => {
    disconnect();
    setDropdownVisible(false);
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncatedAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}` 
    : '';

  return (
    <div className="relative" ref={dropdownRef}>
      {isConnected ? (
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
        <>
          {!showConnectors ? (
            <button
              onClick={handleConnect}
              style={isHovered ? goldButtonHoverStyle : goldButtonStyle}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <FontAwesomeIcon icon={faWallet} style={{ marginRight: '0.5rem' }} />
              Connect Wallet
            </button>
          ) : (
            <div style={{
              position: 'absolute',
              right: 0,
              marginTop: '0.5rem',
              width: '16rem',
              borderRadius: '0.375rem',
              backgroundColor: '#1A120B',
              border: '1px solid #333',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              zIndex: 50
            }}>
              <div style={{ padding: '1rem' }}>
                <h3 style={{ color: '#D4AF37', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: '600' }}>
                  Connect a Wallet
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {connectors.map((connector) => (
                    <button
                      key={connector.id}
                      onClick={() => {
                        connect({ connector });
                        setShowConnectors(false);
                      }}
                      disabled={!connector.ready || isLoading}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#0a0a0a',
                        border: '1px solid #333',
                        borderRadius: '0.5rem',
                        color: '#d1d5db',
                        cursor: connector.ready ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease',
                        opacity: connector.ready ? 1 : 0.5
                      }}
                      onMouseEnter={(e) => {
                        if (connector.ready) {
                          e.currentTarget.style.backgroundColor = '#333';
                          e.currentTarget.style.borderColor = '#D4AF37';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#0a0a0a';
                        e.currentTarget.style.borderColor = '#333';
                      }}
                    >
                      <FontAwesomeIcon icon={faWallet} style={{ marginRight: '0.75rem' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                        {connector.name}
                        {isLoading && connector.id === pendingConnector?.id && ' (connecting)'}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowConnectors(false)}
                  style={{
                    marginTop: '0.75rem',
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: 'transparent',
                    border: '1px solid #333',
                    borderRadius: '0.375rem',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#333';
                    e.currentTarget.style.color = '#d1d5db';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#9ca3af';
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}