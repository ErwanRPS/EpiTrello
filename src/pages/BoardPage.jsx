import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Board from './Board'
import useBoardStore from '../store/useBoardStore'
import { boardsAPI } from '../services/api'

/**
 * Page wrapper pour le Board avec gestion de l'authentification
 */
const BoardPage = () => {
  const navigate = useNavigate()
  const { loadBoard, createBoard, boardId, loading } = useBoardStore()
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const initBoard = async () => {
      // Récupérer l'utilisateur du localStorage
      const userString = localStorage.getItem('user')
      if (userString) {
        setUser(JSON.parse(userString))
      }

      try {
        // Récupérer tous les boards de l'utilisateur
        const response = await boardsAPI.getAll()
        
        if (response.boards && response.boards.length > 0) {
          // Charger le premier board
          await loadBoard(response.boards[0]._id)
        } else {
          // Créer un nouveau board s'il n'y en a pas
          await createBoard()
        }
      } catch (error) {
        console.error('Erreur initialisation board:', error)
        // Si erreur d'authentification, rediriger vers login
        if (error.message.includes('autorisé') || error.message.includes('Token')) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
        }
      } finally {
        setInitializing(false)
      }
    }

    initBoard()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (initializing || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Chargement de votre tableau...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-primary-600">📋</span>
                EpiTrello
              </h1>
              {user && (
                <p className="text-sm text-gray-600 mt-1">
                  Bienvenue, {user.username}
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              🚪 Déconnexion
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Board />
      </main>
    </div>
  )
}

export default BoardPage
