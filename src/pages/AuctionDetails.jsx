// src/pages/AuctionDetails.jsx - Updated for Ethereum
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import useEthereum from '../hooks/useEthereum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, faGavel, faCalendarAlt, 
  faDollarSign, faMapMarkerAlt, faBuilding, 
  faLink, faFileAlt, 
  faExclamationTriangle, faSpinner,
  faFileDownload, faImage, faInfo
} from '@fortawesome/free-solid-svg-icons';
import DOGEAssist from '../utils/DOGEAssist';

export default function AuctionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { sendEth, isLoading } = useEthereum();
  
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Fetch auction details
  useEffect(() => {
    const fetchAuctionDetails = async () => {
      setLoading(true);
      
      try {
        // In a real app, this would be a smart contract call or API call
        // For now, we'll use mock data based on the ID
        
        setTimeout(() => {
          // Mock auction data with Ethereum addresses
          const mockAuction = {
            id: id,
            title: 'Premium Office Equipment Auction #' + id,
            category: 'EQUIPMENT',
            description: 'Collection of high-quality office equipment including 5 workstations, 3 conference tables, and various office chairs. All items are in excellent condition with minimal wear.',
            images: [
              'https://via.placeholder.com/600x400?text=Office+Equipment+1',
              'https://via.placeholder.com/600x400?text=Office+Equipment+2',
              'https://via.placeholder.com/600x400?text=Office+Equipment+3',
            ],
            startDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
            endDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
            startingBid: '1',
            currentBid: '1.55',
            minBidIncrement: '0.05',
            currency: 'ETH',
            location: 'Warsaw, Poland',
            organizer: 'Office Solutions Ltd',
            organizerAddress: '0x742d35Cc6634C0532925a3b8D98d6b6f8E1C1b2C', // Ethereum address
            status: 'ACTIVE',
            termsUrl: '#',
            details: 'The equipment is available for viewing by appointment. The winner is responsible for pickup or shipping arrangements. All items are sold as-is with no warranty provided.',
            bids: [
              {
                bidder: 'EquipmentPro Ltd.',
                bidderAddress: '0x8ba1f109551bD432803012645Hac136c23F94C',
                amount: '1.55',
                timestamp: new Date(Date.now() - 86400000 * 0.5).toISOString(), // 12 hours ago
                status: 'HIGHEST'
              },
              {
                bidder: 'Office Depot Inc.',
                bidderAddress: '0x1a9C8182C09F50C8318d769245beA52c32BE35BC',
                amount: '1.30',
                timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
                status: 'OUTBID'
              },
              {
                bidder: 'Tech Supplies Ltd.',
                bidderAddress: '0x6C5024Cd4F8A59110119C56f8933403A539555EB',
                amount: '1.20',
                timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(), // 1.5 days ago
                status: 'OUTBID'
              }
            ]
          };
          
          setAuction(mockAuction);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching auction details:', err);
        setError('Failed to load auction details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchAuctionDetails();
  }, [id]);
  
  // Calculate time left for auction
  useEffect(() => {
    if (!auction) return;
    
    const endDate = new Date(auction.endDate).getTime();
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = endDate - now;
      
      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };
    
    // Calculate time left initially
    calculateTimeLeft();
    
    // Update time left every second
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Clean up timer
    return () => clearInterval(timer);
  }, [auction]);
  
  const handleSubmitBid = async (e) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }
    
    // Validate bid amount
    if (!bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= 0) {
      setBidError('Please enter a valid bid amount');
      return;
    }
    
    const currentBidAmount = parseFloat(auction.currentBid);
    const minIncrement = parseFloat(auction.minBidIncrement);
    const minValidBid = currentBidAmount + minIncrement;
    
    if (parseFloat(bidAmount) < minValidBid) {
      setBidError(`Bid must be at least ${minValidBid} ${auction.currency} (current bid + minimum increment)`);
      return;
    }
    
    setBidError('');
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be a smart contract transaction
      console.log('Submitting bid for auction:', auction.id, 'Amount:', bidAmount, auction.currency);
      
      // For demo purposes, we'll simulate sending ETH to the auction contract
      // In reality, you'd call a smart contract method like placeBid()
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success and update UI
      alert('Bid submitted successfully!');
      setShowBidForm(false);
      
      // Update the local auction object with the new bid and current bid
      setAuction(prev => ({
        ...prev,
        currentBid: bidAmount,
        bids: [
          {
            bidder: 'Your Company', // In a real app, this would be the user's profile name
            bidderAddress: address,
            amount: bidAmount,
            timestamp: new Date().toISOString(),
            status: 'HIGHEST'
          },
          ...prev.bids.map(bid => ({
            ...bid,
            status: 'OUTBID'
          }))
        ]
      }));
      
    } catch (error) {
      console.error('Error submitting bid:', error);
      setBidError(error.message || 'Failed to submit bid. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
  
  const renderStatusBadge = (status) => {
    let colorClass = '';
    let statusText = status;
    
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        colorClass = 'bg-green-900 text-green-200';
        break;
      case 'OUTBID':
        colorClass = 'bg-yellow-900 text-yellow-200';
        break;
      case 'HIGHEST':
        colorClass = 'bg-blue-900 text-blue-200';
        break;
      case 'CLOSED':
        colorClass = 'bg-red-900 text-red-200';
        break;
      case 'AWARDED':
        colorClass = 'bg-purple-900 text-purple-200';
        break;
      default:
        colorClass = 'bg-gray-800 text-gray-200';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {statusText}
      </span>
    );
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-appBg flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-300">Loading auction details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-400 hover:text-gold transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Dashboard
          </button>
        </div>
        
        <div className="bg-red-900 bg-opacity-30 rounded-lg p-6 text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-red-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-red-200">Error Loading Auction</h2>
          <p className="text-red-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-800 text-red-200 rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-400 hover:text-gold transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Dashboard
          </button>
        </div>
        
        <div className="bg-brown-dark rounded-lg p-6 text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-gray-300">Auction Not Found</h2>
          <p className="text-gray-400">The auction you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-400 hover:text-gold transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Dashboard
        </button>
      </div>
      
      <div className="bg-brown-dark rounded-lg shadow-md overflow-hidden mb-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-brown-medium to-brown-dark p-6 border-b border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-200 mb-2">{auction.title}</h1>
              <div className="flex items-center text-gray-400 text-sm">
                <span className="mr-2">ID: {auction.id}</span>
                <span className="mx-2">•</span>
                <span className="mr-2">Category: {auction.category}</span>
                <span className="mx-2">•</span>
                <span>{renderStatusBadge(auction.status)}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gold">
                {auction.currentBid} {auction.currency}
              </div>
              <div className="text-sm text-gray-400">Current Bid</div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="bg-brown-medium rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-brown-dark">
                  {auction.images && auction.images.length > 0 ? (
                    <img 
                      src={auction.images[0]}
                      alt={auction.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faImage} className="text-4xl text-gray-400" />
                      <p className="ml-2 text-gray-400">No images available</p>
                    </div>
                  )}
                </div>
                
                {auction.images && auction.images.length > 1 && (
                  <div className="p-4 grid grid-cols-4 gap-2">
                    {auction.images.map((image, index) => (
                      <div key={index} className="aspect-w-1 aspect-h-1 bg-brown-dark rounded-md overflow-hidden">
                        <img
                          src={image}
                          alt={`${auction.title} image ${index + 1}`}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-brown-medium p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-200">
                  <FontAwesomeIcon icon={faGavel} className="mr-2 text-gold" />
                  Auction Description
                </h2>
                <p className="text-gray-300 whitespace-pre-line">{auction.description}</p>
              </div>
              
              <div className="bg-brown-medium p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-200">
                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-gold" />
                  Item Details
                </h2>
                <p className="text-gray-300 whitespace-pre-line">{auction.details}</p>
              </div>
              
              <div className="bg-brown-medium p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-200">
                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-gold" />
                  Documents & Terms
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a 
                    href={auction.termsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-brown-dark rounded-md hover:bg-brown-light transition-colors"
                  >
                    <FontAwesomeIcon icon={faFileDownload} className="mr-2 text-gold" />
                    <span className="text-gray-300">Terms & Conditions</span>
                  </a>
                </div>
              </div>
              
              {/* Bid History */}
              <div className="bg-brown-medium p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-200">
                  <FontAwesomeIcon icon={faGavel} className="mr-2 text-gold" />
                  Bid History ({auction.bids.length})
                </h2>
                
                {auction.bids.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-brown-dark">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Bidder
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {auction.bids.map((bid, index) => (
                          <tr key={index} className="hover:bg-brown-light">
                            <td className="px-4 py-3 text-sm text-gray-300">
                              <div>
                                <div>{bid.bidder}</div>
                                <div className="text-xs font-mono text-gray-400">
                                  {truncateAddress(bid.bidderAddress)}
                                </div>
                              </div>
                              {bid.bidderAddress?.toLowerCase() === address?.toLowerCase() && (
                                <span className="ml-2 text-xs text-gold">(You)</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-200">
                              {bid.amount} {auction.currency}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-300">
                              {formatDate(bid.timestamp)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {renderStatusBadge(bid.status)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-2">No bids have been placed yet.</p>
                )}
                
                {/* Bid Form Toggle */}
                <div className="mt-4 text-center">
                  {!showBidForm && (
                    <button
                      onClick={() => setShowBidForm(true)}
                      className="px-4 py-2 bg-gold text-black rounded-md hover:bg-gold-dark transition-colors"
                    >
                      Place a Bid
                    </button>
                  )}
                </div>
                
                {/* Bid Form */}
                {showBidForm && (
                  <form onSubmit={handleSubmitBid} className="mt-4 bg-brown-dark p-4 rounded-lg">
                    <h3 className="text-md font-medium mb-3 text-gray-200">Place Your Bid</h3>
                    
                    <div className="mb-4">
                      <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-300 mb-1">
                        Bid Amount* (min: {parseFloat(auction.currentBid) + parseFloat(auction.minBidIncrement)} {auction.currency})
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <input
                          type="number"
                          name="bidAmount"
                          id="bidAmount"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          step="0.01"
                          min={parseFloat(auction.currentBid) + parseFloat(auction.minBidIncrement)}
                          required
                          className={`block w-full pr-12 bg-brown-medium border ${
                            bidError ? 'border-red-500' : 'border-gray-600'
                          } rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-gold focus:border-gold`}
                          placeholder="0.00"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-400 sm:text-sm">{auction.currency}</span>
                        </div>
                      </div>
                      {bidError && (
                        <p className="mt-1 text-sm text-red-500">{bidError}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setShowBidForm(false);
                          setBidAmount('');
                          setBidError('');
                        }}
                        className="px-4 py-2 bg-brown-medium text-gray-300 rounded-md hover:bg-brown-light transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 bg-gold text-black rounded-md hover:bg-gold-dark transition-colors ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                            Submitting...
                          </>
                        ) : (
                          'Place Bid'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Time Left Card */}
              <div className="bg-brown-medium p-4 rounded-lg text-center">
                <h2 className="text-lg font-semibold mb-2 text-gray-200">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-gold" />
                  Time Left
                </h2>
                
                <div className="grid grid-cols-4 gap-2 text-center mt-3">
                  <div className="bg-brown-dark rounded-md p-2">
                    <div className="text-xl font-bold text-gold">{timeLeft.days}</div>
                    <div className="text-xs text-gray-400">Days</div>
                  </div>
                  <div className="bg-brown-dark rounded-md p-2">
                    <div className="text-xl font-bold text-gold">{timeLeft.hours}</div>
                    <div className="text-xs text-gray-400">Hours</div>
                  </div>
                  <div className="bg-brown-dark rounded-md p-2">
                    <div className="text-xl font-bold text-gold">{timeLeft.minutes}</div>
                    <div className="text-xs text-gray-400">Mins</div>
                  </div>
                  <div className="bg-brown-dark rounded-md p-2">
                    <div className="text-xl font-bold text-gold">{timeLeft.seconds}</div>
                    <div className="text-xs text-gray-400">Secs</div>
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-gray-400">
                  Auction ends: {formatDate(auction.endDate)}
                </div>
              </div>
              
              {/* Bidding Info */}
              <div className="bg-brown-medium p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-200">
                  <FontAwesomeIcon icon={faDollarSign} className="mr-2 text-gold" />
                  Bidding Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Starting Bid</p>
                    <p className="text-gray-200">{auction.startingBid} {auction.currency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Current Bid</p>
                    <p className="text-gray-200 font-medium">{auction.currentBid} {auction.currency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Minimum Bid Increment</p>
                    <p className="text-gray-200">{auction.minBidIncrement} {auction.currency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Your Minimum Bid</p>
                    <p className="text-gold font-medium">
                      {parseFloat(auction.currentBid) + parseFloat(auction.minBidIncrement)} {auction.currency}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Key Information */}
              <div className="bg-brown-medium p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-200">
                  <FontAwesomeIcon icon={faInfo} className="mr-2 text-gold" />
                  Item Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Category</p>
                    <p className="text-gray-200">{auction.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-gray-200 flex items-center">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-gold text-xs" />
                      {auction.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Start Date</p>
                    <p className="text-gray-200 flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-gold text-xs" />
                      {formatDate(auction.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">End Date</p>
                    <p className="text-gray-200 flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-gold text-xs" />
                      {formatDate(auction.endDate)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Organizer Information */}
              <div className="bg-brown-medium p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-200">
                  <FontAwesomeIcon icon={faBuilding} className="mr-2 text-gold" />
                  Seller
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Company Name</p>
                    <p className="text-gray-200 font-medium">{auction.organizer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Ethereum Address</p>
                    <div className="flex items-center">
                      <p className="text-gray-200 text-xs font-mono truncate">{truncateAddress(auction.organizerAddress)}</p>
                      <button className="ml-2 text-gold hover:text-gold-light">
                        <FontAwesomeIcon icon={faLink} />
                      </button>
                    </div>
                  </div>
                  <div className="pt-2">
                    <a 
                      href={`/profile/${auction.organizerAddress}`}
                      className="text-sm text-gold hover:text-gold-light"
                    >
                      View Complete Profile
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Actions Sidebar */}
              <div className="bg-brown-medium p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-200">
                  <FontAwesomeIcon icon={faGavel} className="mr-2 text-gold" />
                  Actions
                </h2>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowBidForm(true)}
                    className="w-full py-2 bg-gold text-black rounded-md hover:bg-gold-dark transition-colors flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faGavel} className="mr-2" />
                    Place Bid
                  </button>
                  
                  <a
                    href={auction.termsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-brown-dark text-gray-300 rounded-md hover:bg-brown-light transition-colors flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faFileDownload} className="mr-2" />
                    Download Terms
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* DOGEAssist Integration */}
      <DOGEAssist />
    </div>
  );
}