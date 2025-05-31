// src/pages/Profile.jsx - Updated for auction/tender platform
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faBuilding, faIdCard, faHistory, 
  faCheckCircle, faFileContract, faSave, faTimes
} from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
  const { address } = useAccount();
  const { userProfile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('entityInfo');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Add transaction history state
  const [transactionHistory, setTransactionHistory] = useState([]);
  
  // Form data with additional fields
  const [formData, setFormData] = useState({
    displayName: userProfile.displayName || '',
    bio: userProfile.bio || '',
    // Entity information
    companyName: userProfile.companyName || '',
    nip: userProfile.nip || '',
    krs: userProfile.krs || '',
    regon: userProfile.regon || '',
    address: userProfile.address || '',
    city: userProfile.city || '',
    postalCode: userProfile.postalCode || '',
    country: userProfile.country || 'Poland',
    // Contact information
    contactPerson: userProfile.contactPerson || '',
    email: userProfile.email || '',
    phone: userProfile.phone || '',
    website: userProfile.website || ''
  });

  // Load mock transaction history
  useEffect(() => {
    if (address) {
      // Mock transaction history for Ethereum
      const mockTransactions = [
        {
          id: '0x123...abc',
          type: 'TENDER_CREATION',
          name: 'Office Equipment Supply Tender',
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          amount: '0.05',
          status: 'CONFIRMED',
          category: 'EQUIPMENT'
        },
        // ... more transactions
      ];
      
      setTransactionHistory(mockTransactions);
    }
  }, [address]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate NIP (Polish tax ID) - 10 digits
      if (formData.nip && !/^\d{10}$/.test(formData.nip)) {
        throw new Error('NIP must be exactly 10 digits');
      }
      
      // Validate KRS (Polish business registry ID) - 10 digits
      if (formData.krs && !/^\d{10}$/.test(formData.krs)) {
        throw new Error('KRS must be exactly 10 digits');
      }
      
      // Validate REGON (Polish statistical number) - 9 or 14 digits
      if (formData.regon && !/^(\d{9}|\d{14})$/.test(formData.regon)) {
        throw new Error('REGON must be either 9 or 14 digits');
      }
      
      // Update profile data
      await updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile. Please try again.' });
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
  
  const renderTransactionTypeIcon = (type) => {
    switch (type) {
      case 'TENDER_CREATION':
        return <FontAwesomeIcon icon={faFileContract} className="text-blue-400" />;
      case 'BID_SUBMISSION':
        return <FontAwesomeIcon icon={faFileContract} className="text-green-400" />;
      case 'AUCTION_CREATION':
        return <FontAwesomeIcon icon={faFileContract} className="text-purple-400" />;
      case 'AUCTION_BID':
        return <FontAwesomeIcon icon={faFileContract} className="text-yellow-400" />;
      default:
        return <FontAwesomeIcon icon={faHistory} className="text-gray-400" />;
    }
  };
  
  const renderTransactionTypeBadge = (type) => {
    let colorClass = '';
    switch (type) {
      case 'TENDER_CREATION':
        colorClass = 'bg-blue-900 text-blue-200';
        break;
      case 'BID_SUBMISSION':
        colorClass = 'bg-green-900 text-green-200';
        break;
      case 'AUCTION_CREATION':
        colorClass = 'bg-purple-900 text-purple-200';
        break;
      case 'AUCTION_BID':
        colorClass = 'bg-yellow-900 text-yellow-200';
        break;
      default:
        colorClass = 'bg-gray-800 text-gray-200';
    }
    
    const typeDisplay = type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {typeDisplay}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-200">Profile & Entity Information</h1>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-900 bg-opacity-50 text-green-200' : 'bg-red-900 bg-opacity-50 text-red-200'
        }`}>
          {message.text}
        </div>
      )}
      
      {/* Tabs */}
      <div className="bg-brown-dark rounded-lg shadow-md mb-8">
        <div className="border-b border-gray-700">
          <nav className="flex -mb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab('entityInfo')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'entityInfo'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              <FontAwesomeIcon icon={faBuilding} className="mr-2" />
              Entity Information
            </button>
            <button
              onClick={() => setActiveTab('transactionHistory')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'transactionHistory'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              <FontAwesomeIcon icon={faHistory} className="mr-2" />
              Transaction History
            </button>
            <button
              onClick={() => setActiveTab('verifications')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'verifications'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
              Verifications
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'entityInfo' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gold">Entity Details</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-gold text-black rounded-md hover:bg-gold-dark transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center"
                    >
                      <FontAwesomeIcon icon={faTimes} className="mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className={`px-4 py-2 bg-gold text-black rounded-md hover:bg-gold-dark transition-colors flex items-center ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      <FontAwesomeIcon icon={faSave} className="mr-2" />
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Information */}
                  <div className="bg-brown-medium p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-medium mb-4 text-gray-200 border-b border-gray-700 pb-2">
                      <FontAwesomeIcon icon={faBuilding} className="mr-2 text-gold" />
                      Company Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-1">
                          Company Name*
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-brown-dark border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200"
                            required
                          />
                        ) : (
                          <p className="text-gray-200">{formData.companyName || '-'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="nip" className="block text-sm font-medium text-gray-300 mb-1">
                          NIP (Tax ID)*
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            id="nip"
                            name="nip"
                            value={formData.nip}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-brown-dark border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200"
                            pattern="[0-9]{10}"
                            title="NIP must be exactly 10 digits"
                            required
                          />
                        ) : (
                          <p className="text-gray-200">{formData.nip || '-'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="krs" className="block text-sm font-medium text-gray-300 mb-1">
                          KRS Number
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            id="krs"
                            name="krs"
                            value={formData.krs}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-brown-dark border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200"
                            pattern="[0-9]{10}"
                            title="KRS must be exactly 10 digits"
                          />
                        ) : (
                          <p className="text-gray-200">{formData.krs || '-'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="regon" className="block text-sm font-medium text-gray-300 mb-1">
                          REGON Number
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            id="regon"
                            name="regon"
                            value={formData.regon}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-brown-dark border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200"
                            pattern="([0-9]{9}|[0-9]{14})"
                            title="REGON must be either 9 or 14 digits"
                          />
                        ) : (
                          <p className="text-gray-200">{formData.regon || '-'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  <div className="bg-brown-medium p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-medium mb-4 text-gray-200 border-b border-gray-700 pb-2">
                      <FontAwesomeIcon icon={faUser} className="mr-2 text-gold" />
                      Contact Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-300 mb-1">
                          Contact Person*
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            id="contactPerson"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-brown-dark border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200"
                            required
                          />
                        ) : (
                          <p className="text-gray-200">{formData.contactPerson || '-'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                          Email Address*
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-brown-dark border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200"
                            required
                          />
                        ) : (
                          <p className="text-gray-200">{formData.email || '-'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                          Phone Number*
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-brown-dark border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200"
                            required
                          />
                        ) : (
                          <p className="text-gray-200">{formData.phone || '-'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">
                          Website
                        </label>
                        {isEditing ? (
                          <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-brown-dark border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200"
                            placeholder="https://"
                          />
                        ) : (
                          <p className="text-gray-200">{formData.website || '-'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Address Information */}
                  <div className="bg-brown-medium p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-medium mb-4 text-gray-200 border-b border-gray-700 pb-2">
                      <FontAwesomeIcon icon={faIdCard} className="mr-2 text-gold" />
                      Address
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                          Street Address*
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-brown-dark border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200"
                            required
                          />
                        ) : (
                          <p className="text-gray-200">{formData.address || '-'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
                          City*
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-brown-dark border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200"
                            required
                          />
                        ) : (
                          <p className="text-gray-200">{formData.city || '-'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300 mb-1">
                          Postal Code*
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-brown-dark border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200"
                            required
                          />
                        ) : (
                          <p className="text-gray-200">{formData.postalCode || '-'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">
                          Country*
                        </label>
                        {isEditing ? (
                          <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-brown-dark border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200"
                            required
                          >
                            <option value="Poland">Poland</option>
                            <option value="Germany">Germany</option>
                            <option value="Czech Republic">Czech Republic</option>
                            <option value="Slovakia">Slovakia</option>
                            <option value="Ukraine">Ukraine</option>
                            <option value="Lithuania">Lithuania</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <p className="text-gray-200">{formData.country || '-'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Wallet Information */}
                  <div className="bg-brown-medium p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-medium mb-4 text-gray-200 border-b border-gray-700 pb-2">
                      <FontAwesomeIcon icon={faIdCard} className="mr-2 text-gold" />
                      Blockchain Identity
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Connected Wallet
                        </label>
                        <div className="flex items-center">
                          <p className="text-gray-200 font-mono text-sm break-all">
                            {address?.toString() || 'Not connected'}
                          </p>
                          <span className="ml-2 w-3 h-3 bg-green-500 rounded-full"></span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Registration Date
                        </label>
                        <p className="text-gray-200">
                          {new Date(Date.now() - 86400000 * 30).toLocaleDateString()} {/* Mock date - 30 days ago */}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Verification Status
                        </label>
                        <div className="flex items-center">
                          <span className="px-2 py-1 bg-green-900 text-green-200 rounded-full text-xs font-medium">
                            Verified
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Entity Type
                        </label>
                        {isEditing ? (
                          <select
                            id="entityType"
                            name="entityType"
                            value={formData.entityType || 'COMPANY'}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-brown-dark border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200"
                          >
                            <option value="COMPANY">Company (Sp. z o.o.)</option>
                            <option value="SOLE_PROPRIETOR">Sole Proprietor</option>
                            <option value="PARTNERSHIP">Partnership</option>
                            <option value="CORPORATION">Corporation (S.A.)</option>
                            <option value="NGO">Non-profit Organization</option>
                            <option value="OTHER">Other</option>
                          </select>
                        ) : (
                          <p className="text-gray-200">{formData.entityType || 'Company (Sp. z o.o.)'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <p className="text-sm text-gray-400 mr-auto">
                      * Required fields
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-3 bg-gold text-black rounded-md hover:bg-gold-dark transition-colors ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Saving...' : 'Save All Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
          
          {activeTab === 'transactionHistory' && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gold">Transaction History</h2>
              
              {transactionHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-brown-medium rounded-lg overflow-hidden">
                    <thead className="bg-brown-dark">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {transactionHistory.map((tx) => (
                        <tr key={tx.id} className="hover:bg-brown-light transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {renderTransactionTypeIcon(tx.type)}
                              <div className="ml-3">
                                {renderTransactionTypeBadge(tx.type)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-200">{tx.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {formatDate(tx.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {tx.type === 'BID_SUBMISSION' || tx.type === 'AUCTION_BID' ? (
                              <div className="text-sm text-green-300">{tx.bidAmount} {tx.currency}</div>
                            ) : (
                              <div className="text-sm text-gray-300">{tx.amount} SOL</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-200">
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <a href={`https://explorer.solana.com/tx/${tx.id}`} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light">
                              View on Explorer
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-brown-medium p-6 rounded-lg text-center">
                  <p className="text-gray-300">No transactions found.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'verifications' && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gold">Verifications & Credentials</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-brown-medium p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-medium mb-4 text-gray-200 border-b border-gray-700 pb-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-gold" />
                    Identity Verification
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-300">Company Registration</p>
                        <p className="text-xs text-gray-400">Verified against Polish KRS registry</p>
                      </div>
                      <span className="flex items-center text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                        Verified
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-300">Tax ID (NIP)</p>
                        <p className="text-xs text-gray-400">Verified against Ministry of Finance database</p>
                      </div>
                      <span className="flex items-center text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                        Verified
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-300">Address Verification</p>
                        <p className="text-xs text-gray-400">Physical address confirmation</p>
                      </div>
                      <span className="flex items-center text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                        Verified
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-300">Email Verification</p>
                        <p className="text-xs text-gray-400">Confirmed access to official email</p>
                      </div>
                      <span className="flex items-center text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-brown-medium p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-medium mb-4 text-gray-200 border-b border-gray-700 pb-2">
                    <FontAwesomeIcon icon={faFileContract} className="mr-2 text-gold" />
                    Platform Credentials
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-300">Tender Participant</p>
                        <p className="text-xs text-gray-400">Eligible to participate in tenders</p>
                      </div>
                      <span className="flex items-center text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                        Approved
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-300">Tender Creator</p>
                        <p className="text-xs text-gray-400">Eligible to create and manage tenders</p>
                      </div>
                      <span className="flex items-center text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                        Approved
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-300">Auction Participant</p>
                        <p className="text-xs text-gray-400">Eligible to participate in auctions</p>
                      </div>
                      <span className="flex items-center text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                        Approved
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-300">Auction Creator</p>
                        <p className="text-xs text-gray-400">Eligible to create and manage auctions</p>
                      </div>
                      <span className="flex items-center text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                        Approved
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}