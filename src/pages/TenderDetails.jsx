// src/pages/TenderDetails.jsx - Updated for Ethereum
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import useEthereum from '../hooks/useEthereum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, faFileContract, faCalendarAlt, 
   faMapMarkerAlt, faBuilding, 
   faLink, faFileAlt, faInfo,
   faExclamationTriangle, faSpinner,
  faFileDownload, faBalanceScale
} from '@fortawesome/free-solid-svg-icons';
import DOGEAssist from '../utils/DOGEAssist';

export default function TenderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { sendEth, isLoading } = useEthereum();
  
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [showCompareContracts, setShowCompareContracts] = useState(false);
  const [contractComparison, setContractComparison] = useState(null);
  
  // Fetch tender details
  useEffect(() => {
    const fetchTenderDetails = async () => {
      setLoading(true);
      
      try {
        // In a real app, this would be an API call to fetch data from your backend
        // For now, we'll use mock data based on the ID
        
        setTimeout(() => {
          // Mock tender data with Ethereum addresses
          const mockTender = {
            id: id,
            title: 'Office Equipment Supply Tender #' + id,
            category: 'EQUIPMENT',
            description: 'We are looking for a supplier to provide office equipment including computers, printers, and furniture for our new office location in Warsaw. The equipment must be new, high quality, and delivered within 30 days of contract signing.',
            endDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
            startDate: new Date().toISOString(),
            maxAmount: '50000',
            currency: 'USDC',
            location: 'Warsaw, Poland',
            organizer: 'Tech Supplies Ltd',
            organizerAddress: '0x742d35Cc6634C0532925a3b8D98d6b6f8E1C1b2C', // Ethereum address
            status: 'ACTIVE',
            requirements: 'Suppliers must have at least 5 years of experience in office equipment provisioning and be able to provide warranty services for at least 24 months.',
            contractUrl: '#',
            requirementsUrl: '#',
            standardContractUrl: '#',
            bids: [
              {
                bidder: 'Office Solutions Inc.',
                bidderAddress: '0x8ba1f109551bD432803012645Hac136c23F94C',
                amount: '48000',
                timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
                status: 'PENDING'
              },
              {
                bidder: 'EquipmentPro Ltd.',
                bidderAddress: '0x1a9C8182C09F50C8318d769245beA52c32BE35BC',
                amount: '45500',
                timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
                status: 'PENDING'
              }
            ]
          };
          
          setTender(mockTender);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching tender details:', err);
        setError('Failed to load tender details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchTenderDetails();
  }, [id]);
  
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
    
    if (parseFloat(bidAmount) > parseFloat(tender.maxAmount)) {
      setBidError(`Bid amount cannot exceed the maximum amount of ${tender.maxAmount} ${tender.currency}`);
      return;
    }
    
    setBidError('');
    setIsSubmitting(true);
    
    try {
      // This would be an actual blockchain transaction in a real app
      console.log('Submitting bid for tender:', tender.id, 'Amount:', bidAmount, tender.currency);
      
      // Simulate transaction and processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success and update UI
      alert('Bid submitted successfully!');
      setShowBidForm(false);
      
      // Update the local tender object with the new bid
      setTender(prev => ({
        ...prev,
        bids: [
          {
            bidder: 'Your Company', // In a real app, this would be the user's profile name
            bidderAddress: address,
            amount: bidAmount,
            timestamp: new Date().toISOString(),
            status: 'PENDING'
          },
          ...prev.bids
        ]
      }));
      
    } catch (error) {
      console.error('Error submitting bid:', error);
      setBidError(error.message || 'Failed to submit bid. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCompareContracts = async () => {
    setShowCompareContracts(true);
    
    // Simulate contract comparison analysis
    setTimeout(() => {
      setContractComparison({
        matches: 85, // percentage match with standard
        mainDifferences: [
          'Extended warranty period (24 months vs. standard 12 months)',
          'Custom payment terms (50% advance, 50% upon delivery)',
          'Specific delivery timeline requirements'
        ],
        riskAreas: [
          {
            clause: 'Liability Limitations',
            risk: 'HIGH',
            description: 'Supplier liability is capped at 50% of contract value, below the recommended 100%'
          },
          {
            clause: 'Termination Conditions',
            risk: 'MEDIUM',
            description: 'Early termination fees exceed standard recommendations'
          },
          {
            clause: 'Intellectual Property',
            risk: 'LOW',
            description: 'Minor differences in IP protection clauses'
          }
        ]
      });
    }, 2000);
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
      case 'PENDING':
        colorClass = 'bg-yellow-900 text-yellow-200';
        break;
      case 'CLOSED':
        colorClass = 'bg-red-900 text-red-200';
        break;
      case 'AWARDED':
        colorClass = 'bg-blue-900 text-blue-200';
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
  
  const renderRiskBadge = (risk) => {
    let colorClass = '';
    
    switch (risk.toUpperCase()) {
      case 'HIGH':
        colorClass = 'bg-red-900 text-red-200';
        break;
      case 'MEDIUM':
        colorClass = 'bg-yellow-900 text-yellow-200';
        break;
      case 'LOW':
        colorClass = 'bg-green-900 text-green-200';
        break;
      default:
        colorClass = 'bg-gray-800 text-gray-200';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {risk}
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
          <p className="text-lg font-medium text-gray-300">Loading tender details...</p>
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
          <h2 className="text-xl font-semibold mb-2 text-red-200">Error Loading Tender</h2>
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

  if (!tender) {
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
          <h2 className="text-xl font-semibold mb-2 text-gray-300">Tender Not Found</h2>
          <p className="text-gray-400">The tender you're looking for doesn't exist or has been removed.</p>
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
              <h1 className="text-2xl font-bold text-gray-200 mb-2">{tender.title}</h1>
              <div className="flex items-center text-gray-400 text-sm">
                <span className="mr-2">ID: {tender.id}</span>
                <span className="mx-2">•</span>
                <span className="mr-2">Category: {tender.category}</span>
                <span className="mx-2">•</span>
                <span>{renderStatusBadge(tender.status)}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gold">
                {tender.maxAmount} {tender.currency}
              </div>
              <div className="text-sm text-gray-400">Maximum Budget</div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-brown-medium p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-200">
                  <FontAwesomeIcon icon={faFileContract} className="mr-2 text-gold" />
                  Tender Description
                </h2>
                <p className="text-gray-300 whitespace-pre-line">{tender.description}</p>
              </div>
              
              <div className="bg-brown-medium p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-200">
                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-gold" />
                  Requirements
                </h2>
                <p className="text-gray-300 whitespace-pre-line">{tender.requirements}</p>
              </div>
              
              <div className="bg-brown-medium p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-200">
                  <FontAwesomeIcon icon={faFileContract} className="mr-2 text-gold" />
                  Documents & Contracts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a 
                    href={tender.contractUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-brown-dark rounded-md hover:bg-brown-light transition-colors"
                  >
                    <FontAwesomeIcon icon={faFileDownload} className="mr-2 text-gold" />
                    <span className="text-gray-300">Download Contract</span>
                  </a>
                  
                  <a 
                    href={tender.requirementsUrl}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="flex items-center p-3 bg-brown-dark rounded-md hover:bg-brown-light transition-colors"
                  >
                    <FontAwesomeIcon icon={faFileDownload} className="mr-2 text-gold" />
                    <span className="text-gray-300">Download Requirements</span>
                  </a>
                  
                  <button 
                    onClick={handleCompareContracts}
                    className="flex items-center p-3 bg-brown-dark rounded-md hover:bg-brown-light transition-colors"
                  >
                    <FontAwesomeIcon icon={faBalanceScale} className="mr-2 text-gold" />
                    <span className="text-gray-300">Compare with Standard</span>
                  </button>
                  
                  <a 
                    href={tender.standardContractUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-brown-dark rounded-md hover:bg-brown-light transition-colors"
                  >
                    <FontAwesomeIcon icon={faFileDownload} className="mr-2 text-gold" />
                    <span className="text-gray-300">Standard Contract</span>
                  </a>
                </div>
              </div>
              
              {/* Contract Comparison Results */}
              {showCompareContracts && (
                <div className="bg-brown-medium p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-3 text-gray-200">
                    <FontAwesomeIcon icon={faBalanceScale} className="mr-2 text-gold" />
                    Contract Comparison Results
                  </h2>
                  
                  {!contractComparison ? (
                    <div className="flex items-center justify-center p-6">
                      <FontAwesomeIcon icon={faSpinner} spin className="mr-2 text-gold" />
                      <span className="text-gray-300">Analyzing contracts...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-24 h-24 relative">
                          <div className="w-full h-full rounded-full bg-brown-dark flex items-center justify-center">
                            <span className="text-2xl font-bold text-gold">{contractComparison.matches}%</span>
                          </div>
                        </div>
                        <div className="ml-6">
                          <p className="text-gray-300 mb-1">
                            <span className="font-medium">Match with standard contract:</span> {contractComparison.matches}%
                          </p>
                          <p className="text-gray-300">
                            This contract is {contractComparison.matches >= 80 ? 'generally aligned' : 'significantly different'} from the standard template for this category.
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-md font-medium mb-2 text-gray-200">Main Differences:</h3>
                        <ul className="list-disc pl-6 text-gray-300 space-y-1">
                          {contractComparison.mainDifferences.map((diff, index) => (
                            <li key={index}>{diff}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-md font-medium mb-2 text-gray-200">Risk Areas:</h3>
                        <div className="space-y-2">
                          {contractComparison.riskAreas.map((risk, index) => (
                            <div key={index} className="bg-brown-dark p-3 rounded-md">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className="font-medium text-gray-200">{risk.clause}</h4>
                                {renderRiskBadge(risk.risk)}
                              </div>
                              <p className="text-sm text-gray-400">{risk.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Current Bids */}
              <div className="bg-brown-medium p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-200">
                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-gold" />
                  Current Bids ({tender.bids.length})
                </h2>
                
                {tender.bids.length > 0 ? (
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
                        {tender.bids.map((bid, index) => (
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
                              {bid.amount} {tender.currency}
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
                  <p className="text-gray-400 text-center py-2">No bids have been submitted yet.</p>
                )}
                
                {/* Bid Form Toggle */}
                <div className="mt-4 text-center">
                  {!showBidForm && (
                    <button
                      onClick={() => setShowBidForm(true)}
                      className="px-4 py-2 bg-gold text-black rounded-md hover:bg-gold-dark transition-colors"
                    >
                      Submit a Bid
                    </button>
                  )}
                </div>
                
                {/* Bid Form */}
                {showBidForm && (
                  <form onSubmit={handleSubmitBid} className="mt-4 bg-brown-dark p-4 rounded-lg">
                    <h3 className="text-md font-medium mb-3 text-gray-200">Submit Your Bid</h3>
                    
                    <div className="mb-4">
                      <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-300 mb-1">
                        Bid Amount* (max: {tender.maxAmount} {tender.currency})
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <input
                          type="number"
                          name="bidAmount"
                          id="bidAmount"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          step="0.01"
                          min="0"
                          max={tender.maxAmount}
                          required
                          className={`block w-full pr-12 bg-brown-medium border ${
                            bidError ? 'border-red-500' : 'border-gray-600'
                          } rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-gold focus:border-gold`}
                          placeholder="0.00"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-400 sm:text-sm">{tender.currency}</span>
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
                          'Submit Bid'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Key Information */}
              <div className="bg-brown-medium p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-200">
                  <FontAwesomeIcon icon={faInfo} className="mr-2 text-gold" />
                  Key Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Category</p>
                    <p className="text-gray-200">{tender.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <p className="text-gray-200">{renderStatusBadge(tender.status)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Maximum Amount</p>
                    <p className="text-gray-200 font-medium">{tender.maxAmount} {tender.currency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-gray-200 flex items-center">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-gold text-xs" />
                      {tender.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Start Date</p>
                    <p className="text-gray-200 flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-gold text-xs" />
                      {formatDate(tender.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">End Date</p>
                    <p className="text-gray-200 flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-gold text-xs" />
                      {formatDate(tender.endDate)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Organizer Information */}
              <div className="bg-brown-medium p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-200">
                  <FontAwesomeIcon icon={faBuilding} className="mr-2 text-gold" />
                  Organizer
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Company Name</p>
                    <p className="text-gray-200 font-medium">{tender.organizer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Ethereum Address</p>
                    <div className="flex items-center">
                      <p className="text-gray-200 text-xs font-mono truncate">{truncateAddress(tender.organizerAddress)}</p>
                      <button className="ml-2 text-gold hover:text-gold-light">
                        <FontAwesomeIcon icon={faLink} />
                      </button>
                    </div>
                  </div>
                  <div className="pt-2">
                    <a 
                      href={`/profile/${tender.organizerAddress}`}
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
                  <FontAwesomeIcon icon={faFileContract} className="mr-2 text-gold" />
                  Actions
                </h2>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowBidForm(true)}
                    className="w-full py-2 bg-gold text-black rounded-md hover:bg-gold-dark transition-colors flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faFileContract} className="mr-2" />
                    Submit Bid
                  </button>
                  
                  <button 
                    onClick={handleCompareContracts}
                    className="w-full py-2 bg-brown-dark text-gold border border-gold rounded-md hover:bg-brown-light transition-colors flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faBalanceScale} className="mr-2" />
                    Analyze Contract
                  </button>
                  
                  <a
                    href={tender.contractUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-brown-dark text-gray-300 rounded-md hover:bg-brown-light transition-colors flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faFileDownload} className="mr-2" />
                    Download Documents
                  </a>
                </div>
              </div>
              
              {/* Timeline/Activity */}
              <div className="bg-brown-medium p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-gray-200">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-gold" />
                  Timeline
                </h2>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <div className="h-full w-0.5 bg-gray-600"></div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-200">Tender Created</p>
                      <p className="text-xs text-gray-400">{formatDate(tender.startDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <div className="h-full w-0.5 bg-gray-600"></div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-200">Bidding Period</p>
                      <p className="text-xs text-gray-400">In Progress</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 border-2 border-gray-600 rounded-full bg-brown-medium"></div>
                      <div className="h-full w-0.5 bg-gray-600"></div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Tender Closing</p>
                      <p className="text-xs text-gray-400">{formatDate(tender.endDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 border-2 border-gray-600 rounded-full bg-brown-medium"></div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Winner Announcement</p>
                      <p className="text-xs text-gray-400">TBD</p>
                    </div>
                  </div>
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