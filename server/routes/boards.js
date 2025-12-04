import express from 'express'
import { body } from 'express-validator'
import Board from '../models/Board.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Toutes les routes sont protégées
router.use(protect)

/**
 * @route   GET /api/boards
 * @desc    Récupérer tous les tableaux de l'utilisateur connecté
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const boards = await Board.find({ userId: req.user.id }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: boards.length,
      boards,
    })
  } catch (error) {
    console.error('Erreur récupération boards:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des tableaux',
      error: error.message,
    })
  }
})

/**
 * @route   GET /api/boards/:id
 * @desc    Récupérer un tableau spécifique
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Tableau non trouvé',
      })
    }

    res.status(200).json({
      success: true,
      board,
    })
  } catch (error) {
    console.error('Erreur récupération board:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du tableau',
      error: error.message,
    })
  }
})

/**
 * @route   POST /api/boards
 * @desc    Créer un nouveau tableau
 * @access  Private
 */
router.post(
  '/',
  [body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Le titre doit contenir entre 1 et 100 caractères')],
  async (req, res) => {
    try {
      const { title, columns, cards, columnOrder } = req.body

      const boardData = {
        title: title || 'Mon Tableau Kanban',
        userId: req.user.id,
      }

      // Ajouter les données personnalisées si fournies
      if (columns) boardData.columns = columns
      if (cards) boardData.cards = cards
      if (columnOrder) boardData.columnOrder = columnOrder

      const board = await Board.create(boardData)

      res.status(201).json({
        success: true,
        message: 'Tableau créé avec succès',
        board,
      })
    } catch (error) {
      console.error('Erreur création board:', error)
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du tableau',
        error: error.message,
      })
    }
  }
)

/**
 * @route   PUT /api/boards/:id
 * @desc    Mettre à jour un tableau
 * @access  Private
 */
router.put('/:id', async (req, res) => {
  try {
    const { title, columns, cards, columnOrder } = req.body

    // Vérifier que le tableau appartient à l'utilisateur
    let board = await Board.findOne({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Tableau non trouvé',
      })
    }

    // Mettre à jour les champs fournis
    if (title !== undefined) board.title = title
    if (columns !== undefined) board.columns = columns
    if (cards !== undefined) board.cards = cards
    if (columnOrder !== undefined) board.columnOrder = columnOrder

    await board.save()

    res.status(200).json({
      success: true,
      message: 'Tableau mis à jour avec succès',
      board,
    })
  } catch (error) {
    console.error('Erreur mise à jour board:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du tableau',
      error: error.message,
    })
  }
})

/**
 * @route   DELETE /api/boards/:id
 * @desc    Supprimer un tableau
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Tableau non trouvé',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Tableau supprimé avec succès',
    })
  } catch (error) {
    console.error('Erreur suppression board:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du tableau',
      error: error.message,
    })
  }
})

export default router
