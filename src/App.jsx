import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import BoardPage from './pages/BoardPage'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes protégées */}
        <Route
          path="/board"
          element={
            <PrivateRoute>
              <BoardPage />
            </PrivateRoute>
          }
        />

        {/* Redirection par défaut */}
        <Route path="/" element={<Navigate to="/board" replace />} />
        <Route path="*" element={<Navigate to="/board" replace />} />
      </Routes>
    </Router>
  )
}

export default App
