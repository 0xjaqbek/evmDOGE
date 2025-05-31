// src/context/AuthContext.jsx - Authentication context for Ethereum
import { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // User profile data (in a real app, this would come from a database)
  const [userProfile, setUserProfile] = useState({
    displayName: '',
    bio: '',
    avatar: '',
    // Additional profile fields
    companyName: '',
    nip: '',
    krs: '',
    regon: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    entityType: '',
  });

  // Update user state when wallet connection changes
  useEffect(() => {
    if (isConnected && address) {
      // User is authenticated with wallet
      const userAddress = address;
      
      // Check if we have existing profile data in localStorage
      const savedProfile = localStorage.getItem(`profile_${userAddress}`);
      
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
      
      setCurrentUser({
        address: userAddress,
        // Add other user data here
      });
    } else {
      // User is not authenticated
      setCurrentUser(null);
      // Reset profile when disconnected
      setUserProfile({
        displayName: '',
        bio: '',
        avatar: '',
        companyName: '',
        nip: '',
        krs: '',
        regon: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        contactPerson: '',
        email: '',
        phone: '',
        website: '',
        entityType: '',
      });
    }
    
    setLoading(false);
  }, [isConnected, address]);

  // Save profile changes
  const updateProfile = (profileData) => {
    if (!currentUser) return;
    
    const updatedProfile = { ...userProfile, ...profileData };
    setUserProfile(updatedProfile);
    
    // Save to localStorage (in a real app, this would be sent to a database)
    localStorage.setItem(`profile_${currentUser.address}`, JSON.stringify(updatedProfile));
    
    return updatedProfile;
  };

  // Logout function
  const logout = async () => {
    disconnect();
    navigate('/');
  };

  const value = {
    currentUser,
    userProfile,
    updateProfile,
    logout,
    loading,
    isConnected,
    address,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}