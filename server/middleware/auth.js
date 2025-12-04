import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/**
 * Middleware pour protéger les routes avec JWT
 * Vérifie la présence et la validité du token
 */
export const protect = async (req, res, next) => {
  let token

  // Vérifier si le header Authorization existe et commence par "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraire le token
      token = req.headers.authorization.split(' ')[1]

      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Récupérer l'utilisateur depuis la DB (sans le mot de passe)
      req.user = await User.findById(decoded.id).select('-password')

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé',
        })
      }

      next()
    } catch (error) {
      console.error('Erreur token:', error.message)
      return res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré',
      })
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé, token manquant',
    })
  }
}
