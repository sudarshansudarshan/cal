import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutState } from '../store/slices/authSlice';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const auth = getAuth();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear any stored tokens/cookies
      localStorage.clear();
      sessionStorage.clear();
      
      // Update Redux store to clear user state
      dispatch(logoutState());
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      disabled={isLoading}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
};

export default Logout;