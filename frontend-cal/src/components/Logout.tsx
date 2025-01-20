// Import required dependencies
import React from 'react'
import { useDispatch } from 'react-redux'
import { useLogoutMutation } from '../store/apiService'
import { logoutState } from '../store/slices/authSlice'

// Logout component for handling user logout functionality
const Logout: React.FC = () => {
  // Redux dispatch hook
  const dispatch = useDispatch()
  // RTK Query hook for logout mutation with loading state
  const [logout, { isLoading }] = useLogoutMutation()

  // Handle logout action
  const handleLogout = async () => {
    try {
      // Call logout API and unwrap response
      await logout().unwrap()
      // Update Redux store to clear user state
      dispatch(logoutState())
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    // Logout button that disables during logout process
    <button onClick={handleLogout} disabled={isLoading}>
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  )
}

export default Logout
