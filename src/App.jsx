// src/App.jsx - Updated with new routes
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateTender from './pages/CreateTender';
import CreateAuction from './pages/CreateAuction';
import TenderDetails from './pages/TenderDetails';
import AuctionDetails from './pages/AuctionDetails';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/shared/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Landing page as the default route - outside of Layout */}
        <Route path="/" element={<LandingPage />} />
        
        {/* All other routes wrapped in Layout */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              {/* Original home page now moved to /connect */}
              <Route path="connect" element={<Home />} />
              
              {/* Protected routes */}
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="create-tender" element={
                <ProtectedRoute>
                  <CreateTender />
                </ProtectedRoute>
              } />
              <Route path="create-auction" element={
                <ProtectedRoute>
                  <CreateAuction />
                </ProtectedRoute>
              } />
              <Route path="tender/:id" element={
                <ProtectedRoute>
                  <TenderDetails />
                </ProtectedRoute>
              } />
              <Route path="auction/:id" element={
                <ProtectedRoute>
                  <AuctionDetails />
                </ProtectedRoute>
              } />
              
              <Route path="404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;