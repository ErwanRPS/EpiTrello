import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/database.js'
import authRoutes from './routes/auth.js'
import boardRoutes from './routes/boards.js'

// Charger les variables d'environnement
dotenv.config()

// Connexion à MongoDB
connectDB()

// Initialiser Express
const app = express()

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/boards', boardRoutes)

// Route de test
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API EpiTrello opérationnelle',
    timestamp: new Date().toISOString(),
  })
})

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
  })
})

// Démarrer le serveur
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`)
  console.log(`📍 Environnement: ${process.env.NODE_ENV}`)
})

export default app
