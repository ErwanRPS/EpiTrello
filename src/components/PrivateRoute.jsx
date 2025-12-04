import { Navigate } from 'react-router-dom'

/**
 * Composant pour protéger les routes privées
 * Redirige vers /login si pas de token
 */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute
