const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Utilitaire pour faire des requêtes HTTP avec gestion des tokens
 */
const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  // Ajouter le token si présent
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erreur réseau')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

/**
 * API d'authentification
 */
export const authAPI = {
  // Inscription
  register: async (username, email, password) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    })
  },

  // Connexion
  login: async (email, password) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  // Récupérer l'utilisateur connecté
  getMe: async () => {
    return fetchAPI('/auth/me')
  },
}

/**
 * API des tableaux
 */
export const boardsAPI = {
  // Récupérer tous les tableaux
  getAll: async () => {
    return fetchAPI('/boards')
  },

  // Récupérer un tableau
  getOne: async (id) => {
    return fetchAPI(`/boards/${id}`)
  },

  // Créer un tableau
  create: async (boardData) => {
    return fetchAPI('/boards', {
      method: 'POST',
      body: JSON.stringify(boardData),
    })
  },

  // Mettre à jour un tableau
  update: async (id, boardData) => {
    return fetchAPI(`/boards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(boardData),
    })
  },

  // Supprimer un tableau
  delete: async (id) => {
    return fetchAPI(`/boards/${id}`, {
      method: 'DELETE',
    })
  },
}
