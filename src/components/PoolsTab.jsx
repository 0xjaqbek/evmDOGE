// src/components/PoolsTab.jsx - Complete file with color updates
import { useState, useEffect } from 'react';
import { fetchSolUsdcPrice, fetchTopPools } from '../services/raydium';

const PoolsTab = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solPrice, setSolPrice] = useState(null);
  const [usdcPrice, setUsdcPrice] = useState(null);
  const [topPools, setTopPools] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPoolData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch SOL/USDC price data in parallel with pools data
      const [priceData, poolsData] = await Promise.all([
        fetchSolUsdcPrice(),
        fetchTopPools(5) // Fetch top 5 pools
      ]);
      
      setSolPrice(priceData.solPriceInUsdc);
      setUsdcPrice(priceData.usdcPriceInSol);
      setTopPools(poolsData);
    } catch (err) {
      console.error('Error fetching pool data:', err);
      setError('Failed to fetch pool data. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchPoolData();
    
    // Optional: Set up interval to refresh data periodically
    const intervalId = setInterval(() => {
      fetchPoolData();
    }, 60000); // Refresh every minute
    
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPoolData();
  };

  // Function to format price with appropriate decimal places
  const formatPrice = (price) => {
    if (!price) return '0';
    
    if (price < 0.0001) return price.toFixed(6);
    if (price < 0.01) return price.toFixed(4);
    return price.toFixed(2);
  };

  // Truncate an address for display
  const truncateAddress = (address) => {
    if (!address) return '';
    const start = address.substring(0, 4);
    const end = address.substring(address.length - 4);
    return `${start}...${end}`;
  };

  return (
    <div className="p-6 bg-brown-dark rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold">
          Raydium Pools
        </h2>
        <button
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            loading || refreshing
              ? 'bg-brown-medium text-gray-400 cursor-not-allowed'
              : 'bg-gold hover:bg-gold-dark text-black'
          }`}
        >
          {refreshing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing...
            </>
          ) : (
            <>
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>
      
      {loading && !refreshing ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900 bg-opacity-30 p-4 rounded-lg text-red-200">
          {error}
        </div>
      ) : (
        <div>
          {/* Price Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-brown-medium p-6 rounded-xl border border-gray-600 hover:border-gold transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <span className="font-bold text-sm">USDC</span>
                </div>
                <h3 className="text-lg font-medium text-gray-200">USDC to SOL</h3>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-gray-400 text-sm">Current Price</p>
                <p className="text-2xl font-bold text-gray-200">{formatPrice(usdcPrice)} SOL</p>
              </div>
            </div>
            
            <div className="bg-brown-medium p-6 rounded-xl border border-gray-600 hover:border-gold transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold-light to-gold flex items-center justify-center mr-3">
                  <span className="font-bold text-sm text-black">SOL</span>
                </div>
                <h3 className="text-lg font-medium text-gray-200">SOL to USDC</h3>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-gray-400 text-sm">Current Price</p>
                <p className="text-2xl font-bold text-gray-200">${formatPrice(solPrice)}</p>
              </div>
            </div>
          </div>
          
          {/* Top Pools Table */}
          <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold">
            Top Raydium Pools
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-brown-medium rounded-lg overflow-hidden">
              <thead className="bg-brown-dark">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pool</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Value Locked</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">24h Volume</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">APR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {topPools.map((pool, index) => (
                  <tr key={index} className="hover:bg-brown-light transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex -space-x-2 mr-3">
                          <div className="w-8 h-8 rounded-full bg-brown-dark flex items-center justify-center text-xs font-bold text-gray-200">
                            {pool.token0?.substring(0, 3)}
                          </div>
                          <div className="w-8 h-8 rounded-full bg-brown-light flex items-center justify-center text-xs font-bold text-gray-200">
                            {pool.token1?.substring(0, 3)}
                          </div>
                        </div>
                        <div className="ml-1">
                          <div className="text-sm font-medium text-gray-200">{pool.name}</div>
                          <div className="text-xs text-gray-400 font-mono">
                            {truncateAddress(pool.address)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{pool.tvl}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{pool.volume24h}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">{pool.apr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 text-center">
            <a 
              href="https://raydium.io/pools" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-gold hover:text-gold-light transition-colors"
            >
              View all Raydium pools →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoolsTab;