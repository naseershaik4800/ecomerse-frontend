// src/components/ProtectedRoute/index.js
import {Navigate} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = ({children}) => {
  const jwtToken = Cookies.get('jwt_token')

  if (jwtToken === undefined) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />
  }

  // Logged in, render the child component
  return children
}

export default ProtectedRoute
