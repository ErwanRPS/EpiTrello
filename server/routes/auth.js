import express from 'express'
import { body } from 'express-validator'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

/**
 * Génère un token JWT
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

/**
 * @route   POST /api/auth/register
 * @desc    Inscription d'un nouvel utilisateur
 * @access  Public
 */
router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Le nom doit contenir entre 3 et 30 caractères'),
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  ],
  async (req, res) => {
    try {
      const { username, email, password } = req.body

      // Vérifier si l'utilisateur existe déjà
      const userExists = await User.findOne({ $or: [{ email }, { username }] })

      if (userExists) {
        return res.status(400).json({
          success: false,
          message: userExists.email === email 
            ? 'Cet email est déjà utilisé' 
            : 'Ce nom d\'utilisateur est déjà pris',
        })
      }

      // Créer l'utilisateur
      const user = await User.create({
        username,
        email,
        password,
      })

      // Générer le token
      const token = generateToken(user._id)

      res.status(201).json({
        success: true,
        message: 'Compte créé avec succès',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      })
    } catch (error) {
      console.error('Erreur inscription:', error)
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de l\'inscription',
        error: error.message,
      })
    }
  }
)

/**
 * @route   POST /api/auth/login
 * @desc    Connexion d'un utilisateur
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Mot de passe requis'),
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body

      // Vérifier si l'utilisateur existe (inclure le password pour la comparaison)
      const user = await User.findOne({ email }).select('+password')

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect',
        })
      }

      // Vérifier le mot de passe
      const isPasswordValid = await user.comparePassword(password)

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect',
        })
      }

      // Générer le token
      const token = generateToken(user._id)

      res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      })
    } catch (error) {
      console.error('Erreur connexion:', error)
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la connexion',
        error: error.message,
      })
    }
  }
)

/**
 * @route   GET /api/auth/me
 * @desc    Récupérer l'utilisateur connecté
 * @access  Private
 */
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    })
  }
})

export default router
