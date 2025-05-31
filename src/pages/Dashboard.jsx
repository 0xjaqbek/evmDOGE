// src/pages/Dashboard.jsx - Updated for Ethereum blockchain
import { useState, useEffect } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGavel, faPaperPlane, faFilter, 
  faListAlt, faPlus, faSearch
} from '@fortawesome/free-solid-svg-icons';

// Import components
import DOGEAssist from '../utils/DOGEAssist';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activeTenders');
  const navigate = useNavigate();
  
  // State for tenders and auctions (would be fetched from blockchain/API in a real app)
  const [tenders, setTenders] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [userTenders, setUserTenders] = useState([]);
  const [userAuctions, setUserAuctions] = useState([]);
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate fetching data from Ethereum blockchain
    const fetchData = async () => {
      if (!address) return;
      
      try {
        // In a real app, these would be smart contract calls or API calls to your backend
        // For now, we'll use mock data with Ethereum addresses
        const mockTenders = [
          { 
            id: '1', 
            title: 'Office Equipment Supply Tender', 
            category: 'EQUIPMENT', 
            endDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
            startDate: new Date().toISOString(),
            maxAmount: '50000',
            currency: 'USDC',
            location: 'Warsaw, Poland',
            organizer: 'Tech Supplies Ltd',
            organizerAddress: '0x742d35Cc6634C0532925a3b8D98d6b6f8E1C1b2C', // Ethereum address
          },
          { 
            id: '2', 
            title: 'Construction Materials Tender', 
            category: 'CONSTRUCTION', 
            endDate: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
            startDate: new Date().toISOString(),
            maxAmount: '120000',
            currency: 'DAI',
            location: 'Gdansk, Poland', 
            organizer: 'BuildIt Construction',
            organizerAddress: '0x8ba1f109551bD432803012645Hac136c23F94C',
          },
          { 
            id: '3', 
            title: 'Agricultural Seeds Supply', 
            category: 'GRAINS', 
            endDate: new Date(Date.now() + 86400000 * 10).toISOString(), // 10 days from now
            startDate: new Date().toISOString(),
            maxAmount: '35000',
            currency: 'EUR',
            location: 'Krakow, Poland',
            organizer: 'GrowWell Farms',
            organizerAddress: '0x1a9C8182C09F50C8318d769245beA52c32BE35BC',
          },
        ];
        
        const mockAuctions = [
          { 
            id: '1', 
            title: 'Premium Office Space', 
            category: 'REAL_ESTATE', 
            endDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
            startDate: new Date().toISOString(),
            startingBid: '250000',
            currentBid: '275000',
            currency: 'ETH',
            location: 'Warsaw, Poland',
            organizer: 'City Properties',
            organizerAddress: '0x6C5024Cd4F8A59110119C56f8933403A539555EB',
          },
          { 
            id: '2', 
            title: 'Used Farm Equipment', 
            category: 'EQUIPMENT', 
            endDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
            startDate: new Date().toISOString(),
            startingBid: '12000',
            currentBid: '15500',
            currency: 'USDC',
            location: 'Lublin, Poland',
            organizer: 'Harvest Solutions',
            organizerAddress: '0x742d35Cc6634C0532925a3b8D98d6b6f8E1C1b2C',
          },
        ];
        
        // Simulate user's own tenders/auctions
        const mockUserTenders = [
          { 
            id: '5', 
            title: 'IT Services Tender', 
            category: 'SERVICES', 
            endDate: new Date(Date.now() + 86400000 * 14).toISOString(), // 14 days from now
            startDate: new Date().toISOString(),
            maxAmount: '75000',
            currency: 'DAI',
            location: 'Remote, Poland',
            organizer: userProfile.displayName || currentUser?.address,
            organizerAddress: address,
            status: 'ACTIVE',
            bids: 3
          }
        ];
        
        const mockUserAuctions = [
          { 
            id: '4', 
            title: 'Office Furniture Lot', 
            category: 'EQUIPMENT', 
            endDate: new Date(Date.now() + 86400000 * 4).toISOString(), // 4 days from now
            startDate: new Date().toISOString(),
            startingBid: '5000',
            currentBid: '6200',
            currency: 'USDC',
            location: 'Gdansk, Poland',
            organizer: userProfile.displayName || currentUser?.address,
            organizerAddress: address,
            status: 'ACTIVE',
            bids: 5
          }
        ];
        
        setTenders(mockTenders);
        setAuctions(mockAuctions);
        setUserTenders(mockUserTenders);
        setUserAuctions(mockUserAuctions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address, currentUser, userProfile]);

  const tabs = [
    { id: 'activeTenders', label: 'Browse Tenders', icon: faListAlt },
    { id: 'activeAuctions', label: 'Browse Auctions', icon: faGavel },
    { id: 'myTenders', label: 'My Tenders', icon: faPaperPlane },
    { id: 'myAuctions', label: 'My Auctions', icon: faGavel }
  ];

  // Filter tenders based on category and search query
  const filteredTenders = tenders.filter(tender => {
    return (categoryFilter === '' || tender.category === categoryFilter) && 
           (searchQuery === '' || 
            tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tender.organizer.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Filter auctions based on category and search query
  const filteredAuctions = auctions.filter(auction => {
    return (categoryFilter === '' || auction.category === categoryFilter) && 
           (searchQuery === '' || 
            auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            auction.organizer.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderCategoryBadge = (category) => {
    let colorClass = '';
    switch (category) {
      case 'EQUIPMENT':
        colorClass = 'bg-blue-900 text-blue-200';
        break;
      case 'CONSTRUCTION':
        colorClass = 'bg-yellow-900 text-yellow-200';
        break;
      case 'GRAINS':
      case 'VEGETABLES':
        colorClass = 'bg-green-900 text-green-200';
        break;
      case 'REAL_ESTATE':
        colorClass = 'bg-purple-900 text-purple-200';
        break;
      case 'SERVICES':
        colorClass = 'bg-indigo-900 text-indigo-200';
        break;
      default:
        colorClass = 'bg-gray-800 text-gray-200';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {category}
      </span>
    );
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId) => {
    const networks = {
      1: 'Ethereum',
      137: 'Polygon',
      42161: 'Arbitrum',
      5: 'Goerli',
      80001: 'Mumbai',
    };
    return networks[chainId] || 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-appBg flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-300">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-appBg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-gold to-gold-dark rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-black">Welcome to My Company D.O.G.E.</h1>
              <p className="text-brown-dark font-medium">
                {userProfile.displayName ? userProfile.displayName : truncateAddress(currentUser?.address)}
              </p>
              <p className="text-sm text-brown-dark">
                Connected to: {chain ? getNetworkName(chain.id) : 'Unknown Network'}
              </p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => navigate('/create-tender')}
                className="flex items-center bg-brown-dark hover:bg-brown-medium text-gold px-4 py-2 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Create Tender
              </button>

              <button 
                onClick={() => navigate('/create-auction')}
                className="flex items-center bg-brown-dark hover:bg-brown-medium text-gold px-4 py-2 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Create Auction
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-brown-dark rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-700">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-gold text-gold'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {/* Filter Section */}
            <div className="mb-6 bg-brown-medium p-4 rounded-lg flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by title or organizer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-brown-dark border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="flex items-center">
                  <label htmlFor="category" className="mr-2 text-gray-300 whitespace-nowrap">Category:</label>
                  <select
                    id="category"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-brown-dark border border-gray-600 text-gray-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                  >
                    <option value="">All Categories</option>
                    <option value="EQUIPMENT">Equipment</option>
                    <option value="CONSTRUCTION">Construction</option>
                    <option value="GRAINS">Grains</option>
                    <option value="VEGETABLES">Vegetables</option>
                    <option value="REAL_ESTATE">Real Estate</option>
                    <option value="SERVICES">Services</option>
                  </select>
                </div>
                <button className="bg-gold text-black px-4 py-2 rounded-md hover:bg-gold-dark transition-colors flex items-center">
                  <FontAwesomeIcon icon={faFilter} className="mr-2" />
                  Filter
                </button>
              </div>
            </div>
            
            {/* Active Tenders Tab */}
            {activeTab === 'activeTenders' && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gold">Active Tenders</h2>
                
                {filteredTenders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTenders.map((tender) => (
                      <div key={tender.id} 
                           className="bg-brown-medium rounded-lg overflow-hidden border border-gray-700 hover:border-gold transition-colors shadow-md">
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-medium text-gray-200 truncate">{tender.title}</h3>
                            {renderCategoryBadge(tender.category)}
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Max Amount:</span>
                              <span className="text-gray-200 font-medium">{tender.maxAmount} {tender.currency}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Location:</span>
                              <span className="text-gray-200">{tender.location}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Organizer:</span>
                              <span className="text-gray-200">{tender.organizer}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Address:</span>
                              <span className="text-gray-200 font-mono">{truncateAddress(tender.organizerAddress)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Ends:</span>
                              <span className="text-gray-200">{formatDate(tender.endDate)}</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => navigate(`/tender/${tender.id}`)}
                              className="flex-1 bg-gold text-black px-3 py-2 rounded-md hover:bg-gold-dark transition-colors text-sm font-medium"
                            >
                              View Details
                            </button>
                            <button 
                              onClick={() => navigate(`/tender/${tender.id}`)}
                              className="flex-1 bg-brown-dark text-gold px-3 py-2 rounded-md border border-gold hover:bg-brown-light transition-colors text-sm font-medium"
                            >
                              Submit Bid
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-brown-medium p-6 rounded-lg text-center">
                    <p className="text-gray-300">No tenders found matching your criteria.</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Active Auctions Tab */}
            {activeTab === 'activeAuctions' && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gold">Active Auctions</h2>
                
                {filteredAuctions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAuctions.map((auction) => (
                      <div key={auction.id} 
                           className="bg-brown-medium rounded-lg overflow-hidden border border-gray-700 hover:border-gold transition-colors shadow-md">
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-medium text-gray-200 truncate">{auction.title}</h3>
                            {renderCategoryBadge(auction.category)}
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Current Bid:</span>
                              <span className="text-green-300 font-medium">{auction.currentBid} {auction.currency}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Starting Bid:</span>
                              <span className="text-gray-200">{auction.startingBid} {auction.currency}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Location:</span>
                              <span className="text-gray-200">{auction.location}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Organizer:</span>
                              <span className="text-gray-200">{auction.organizer}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Address:</span>
                              <span className="text-gray-200 font-mono">{truncateAddress(auction.organizerAddress)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Ends:</span>
                              <span className="text-gray-200">{formatDate(auction.endDate)}</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => navigate(`/auction/${auction.id}`)}
                              className="flex-1 bg-gold text-black px-3 py-2 rounded-md hover:bg-gold-dark transition-colors text-sm font-medium"
                            >
                              View Details
                            </button>
                            <button 
                              onClick={() => navigate(`/auction/${auction.id}`)}
                              className="flex-1 bg-brown-dark text-gold px-3 py-2 rounded-md border border-gold hover:bg-brown-light transition-colors text-sm font-medium"
                            >
                              Place Bid
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-brown-medium p-6 rounded-lg text-center">
                    <p className="text-gray-300">No auctions found matching your criteria.</p>
                  </div>
                )}
              </div>
            )}
            
            {/* My Tenders Tab - Similar structure but with user's tenders */}
            {activeTab === 'myTenders' && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gold">My Tenders</h2>
                
                {userTenders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-brown-medium rounded-lg overflow-hidden">
                      <thead className="bg-brown-dark">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Max Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">End Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bids</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {userTenders.map((tender) => (
                          <tr key={tender.id} className="hover:bg-brown-light transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-200">{tender.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {renderCategoryBadge(tender.category)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-200">{tender.maxAmount} {tender.currency}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-200">
                                {tender.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {formatDate(tender.endDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {tender.bids}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              <div className="flex space-x-2">
                                <button className="text-gold hover:text-gold-light">
                                  View Bids
                                </button>
                                <button className="text-blue-400 hover:text-blue-300">
                                  Edit
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-brown-medium p-6 rounded-lg text-center">
                    <p className="text-gray-300">You haven't created any tenders yet.</p>
                    <button 
                      onClick={() => navigate('/create-tender')}
                      className="mt-4 bg-gold text-black px-4 py-2 rounded-md hover:bg-gold-dark transition-colors"
                    >
                      Create Your First Tender
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* My Auctions Tab - Similar structure but with user's auctions */}
            {activeTab === 'myAuctions' && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gold">My Auctions</h2>
                
                {userAuctions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-brown-medium rounded-lg overflow-hidden">
                      <thead className="bg-brown-dark">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Current Bid</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">End Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bids</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {userAuctions.map((auction) => (
                          <tr key={auction.id} className="hover:bg-brown-light transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-200">{auction.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {renderCategoryBadge(auction.category)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-green-300">{auction.currentBid} {auction.currency}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-200">
                                {auction.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {formatDate(auction.endDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {auction.bids}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              <div className="flex space-x-2">
                                <button className="text-gold hover:text-gold-light">
                                  View Bids
                                </button>
                                <button className="text-blue-400 hover:text-blue-300">
                                  Edit
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-brown-medium p-6 rounded-lg text-center">
                    <p className="text-gray-300">You haven't created any auctions yet.</p>
                    <button 
                      onClick={() => navigate('/create-auction')}
                      className="mt-4 bg-gold text-black px-4 py-2 rounded-md hover:bg-gold-dark transition-colors"
                    >
                      Create Your First Auction
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* DOGEAssist Integration */}
      <DOGEAssist />
    </div>
  );
}