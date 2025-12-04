import mongoose from 'mongoose'

/**
 * Schéma pour une carte Kanban
 */
const cardSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Le titre de la carte est requis'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
})

/**
 * Schéma pour une colonne Kanban
 */
const columnSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Le titre de la colonne est requis'],
    trim: true,
  },
  cardIds: {
    type: [String],
    default: [],
  },
})

/**
 * Schéma principal pour un tableau Kanban
 */
const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre du tableau est requis'],
      trim: true,
      default: 'Mon Tableau Kanban',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'L\'ID utilisateur est requis'],
      index: true,
    },
    columns: {
      type: Map,
      of: columnSchema,
      default: () => new Map([
        ['column-1', { id: 'column-1', title: 'À faire', cardIds: [] }],
        ['column-2', { id: 'column-2', title: 'En cours', cardIds: [] }],
        ['column-3', { id: 'column-3', title: 'Fait', cardIds: [] }],
      ]),
    },
    cards: {
      type: Map,
      of: cardSchema,
      default: () => new Map(),
    },
    columnOrder: {
      type: [String],
      default: ['column-1', 'column-2', 'column-3'],
    },
  },
  {
    timestamps: true,
  }
)

// Index pour optimiser les requêtes par utilisateur
boardSchema.index({ userId: 1, createdAt: -1 })

const Board = mongoose.model('Board', boardSchema)

export default Board
