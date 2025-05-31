// src/components/Dashboard/UserStats.jsx - Updated for Ethereum
import { useState, useEffect } from 'react';
import { useAccount, useNetwork, useBalance } from 'wagmi';
import { formatEther } from 'viem';
import useEthereum from '../../hooks/useEthereum';
import { getNetworkName } from '../../utils/helpers';

export default function UserStats() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: balanceData } = useBalance({ address });
  const { getTokenBalance } = useEthereum();
  const [tokenAccounts, setTokenAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Common ERC-20 tokens to display
  const commonTokens = [
    { 
      address: '0xA0b86a33E6471E0E5B79bDfC1b635AD9d8B9ee98', 
      symbol: 'USDC', 
      name: 'USD Coin' 
    },
    { 
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', 
      symbol: 'USDT', 
      name: 'Tether USD' 
    },
  ];

  useEffect(() => {
    async function loadData() {
      if (!address) return;
      
      setIsLoading(true);
      try {
        // Get token balances for common tokens
        const tokenBalances = await Promise.all(
          commonTokens.map(async (token) => {
            try {
              const balance = await getTokenBalance(token.address);
              return {
                ...token,
                balance: balance.balance || '0',
                formattedBalance: parseFloat(balance.balance || '0').toFixed(4)
              };
            } catch (error) {
              console.error(`Error getting balance for ${token.symbol}:`, error);
              return {
                ...token,
                balance: '0',
                formattedBalance: '0.0000'
              };
            }
          })
        );
        
        // Filter out tokens with zero balances for cleaner display
        const nonZeroTokens = tokenBalances.filter(token => 
          parseFloat(token.balance) > 0
        );
        
        setTokenAccounts(nonZeroTokens);
      } catch (error) {
        console.error('Error loading wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [address, getTokenBalance]);

  const ethBalance = balanceData ? formatEther(balanceData.value) : '0';

  if (isLoading) {
    return <div className="text-center py-4 text-gray-300">Loading...</div>;
  }

  return (
    <div className="bg-brown-dark rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-200">Wallet Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ETH Balance */}
        <div className="bg-brown-medium p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gold mb-1">ETH Balance</h3>
          <p className="text-2xl font-bold text-gray-200">
            {parseFloat(ethBalance).toFixed(4)} ETH
          </p>
        </div>
        
        {/* Wallet Address */}
        <div className="bg-brown-medium p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-300 mb-1">Wallet Address</h3>
          <p className="text-xs font-mono truncate text-gray-400">
            {address}
          </p>
        </div>
        
        {/* Network */}
        <div className="bg-brown-medium p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-300 mb-1">Network</h3>
          <p className="text-lg font-semibold text-gray-200">
            {chain ? getNetworkName(chain.id) : 'Unknown'}
          </p>
          <p className="text-xs text-gray-400">
            {chain?.testnet ? 'Testnet' : 'Mainnet'}
          </p>
        </div>
      </div>
      
      {/* Token Accounts */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3 text-gray-200">Token Balances</h3>
        
        {tokenAccounts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-brown-dark">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Contract
                  </th>
                </tr>
              </thead>
              <tbody className="bg-brown-medium divide-y divide-gray-600">
                {tokenAccounts.map((token, index) => (
                  <tr key={index} className="hover:bg-brown-light">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                      {token.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {token.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {token.formattedBalance}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                      {token.address.slice(0, 6)}...{token.address.slice(-4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400">No token balances found.</p>
        )}
      </div>
      
      {/* Network Info */}
      <div className="mt-6 p-4 bg-brown-medium rounded-lg">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Network Information</h4>
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
          <div>
            <span className="font-medium">Chain ID:</span> {chain?.id || 'Unknown'}
          </div>
          <div>
            <span className="font-medium">Currency:</span> {chain?.nativeCurrency?.symbol || 'ETH'}
          </div>
        </div>
      </div>
    </div>
  );
}