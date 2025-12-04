import { create } from 'zustand'
import { boardsAPI } from '../services/api'

// Données initiales pour un nouveau tableau
const initialData = {
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'À faire',
      cardIds: [],
    },
    'column-2': {
      id: 'column-2',
      title: 'En cours',
      cardIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Fait',
      cardIds: [],
    },
  },
  cards: {},
  columnOrder: ['column-1', 'column-2', 'column-3'],
}

// Store Zustand avec appels API
const useBoardStore = create((set, get) => ({
  ...initialData,
  boardId: null,
  loading: false,
  error: null,

  // Charger un tableau depuis l'API
  loadBoard: async (boardId) => {
    set({ loading: true, error: null })
    try {
      const response = await boardsAPI.getOne(boardId)
      const board = response.board

      // Convertir les Maps MongoDB en objets JS
      const columns = board.columns instanceof Map ? Object.fromEntries(board.columns) : board.columns
      const cards = board.cards instanceof Map ? Object.fromEntries(board.cards) : board.cards

      set({
        boardId: board._id,
        columns,
        cards,
        columnOrder: board.columnOrder,
        loading: false,
      })
    } catch (error) {
      set({ error: error.message, loading: false })
      console.error('Erreur chargement board:', error)
    }
  },

  // Créer un nouveau tableau
  createBoard: async () => {
    set({ loading: true, error: null })
    try {
      const response = await boardsAPI.create(initialData)
      const board = response.board

      const columns = board.columns instanceof Map ? Object.fromEntries(board.columns) : board.columns
      const cards = board.cards instanceof Map ? Object.fromEntries(board.cards) : board.cards

      set({
        boardId: board._id,
        columns,
        cards,
        columnOrder: board.columnOrder,
        loading: false,
      })

      return board._id
    } catch (error) {
      set({ error: error.message, loading: false })
      console.error('Erreur création board:', error)
    }
  },

  // Sauvegarder le board actuel dans l'API
  saveBoard: async () => {
    const { boardId, columns, cards, columnOrder } = get()
    if (!boardId) {
      console.warn('⚠️ Pas de boardId, impossible de sauvegarder')
      return
    }

    try {
      console.log('💾 Sauvegarde du board...', { boardId, colonnesCount: Object.keys(columns).length, cartesCount: Object.keys(cards).length })
      await boardsAPI.update(boardId, { columns, cards, columnOrder })
      console.log('✅ Board sauvegardé avec succès')
    } catch (error) {
      console.error('❌ Erreur sauvegarde board:', error)
      set({ error: error.message })
    }
  },

  // Ajouter une nouvelle carte
  addCard: async (columnId, title, description) => {
    const newCardId = `card-${Date.now()}`
    const newCard = {
      id: newCardId,
      title,
      description,
    }

    console.log('➕ Ajout d\'une carte:', { columnId, title })

    set(state => ({
      cards: {
        ...state.cards,
        [newCardId]: newCard,
      },
      columns: {
        ...state.columns,
        [columnId]: {
          ...state.columns[columnId],
          cardIds: [...state.columns[columnId].cardIds, newCardId],
        },
      },
    }))

    // Sauvegarder dans l'API
    await get().saveBoard()
  },

  // Supprimer une carte
  deleteCard: async (cardId, columnId) => {
    const { cards, columns } = get()
    const newCards = { ...cards }
    delete newCards[cardId]

    const newCardIds = columns[columnId].cardIds.filter(id => id !== cardId)

    set({
      cards: newCards,
      columns: {
        ...columns,
        [columnId]: {
          ...columns[columnId],
          cardIds: newCardIds,
        },
      },
    })

    // Sauvegarder dans l'API
    await get().saveBoard()
  },

  // Modifier une carte
  updateCard: async (cardId, title, description) => {
    set(state => ({
      cards: {
        ...state.cards,
        [cardId]: {
          ...state.cards[cardId],
          title,
          description,
        },
      },
    }))

    // Sauvegarder dans l'API
    await get().saveBoard()
  },

  // Gérer le drag and drop
  reorderCards: async (sourceColumnId, destColumnId, sourceIndex, destIndex) => {
    const { columns } = get()

    // Déplacement dans la même colonne
    if (sourceColumnId === destColumnId) {
      const column = columns[sourceColumnId]
      const newCardIds = Array.from(column.cardIds)
      const [removed] = newCardIds.splice(sourceIndex, 1)
      newCardIds.splice(destIndex, 0, removed)

      set({
        columns: {
          ...columns,
          [sourceColumnId]: {
            ...column,
            cardIds: newCardIds,
          },
        },
      })
    } else {
      // Déplacement entre colonnes différentes
      const sourceColumn = columns[sourceColumnId]
      const destColumn = columns[destColumnId]
      const sourceCardIds = Array.from(sourceColumn.cardIds)
      const destCardIds = Array.from(destColumn.cardIds)

      const [removed] = sourceCardIds.splice(sourceIndex, 1)
      destCardIds.splice(destIndex, 0, removed)

      set({
        columns: {
          ...columns,
          [sourceColumnId]: {
            ...sourceColumn,
            cardIds: sourceCardIds,
          },
          [destColumnId]: {
            ...destColumn,
            cardIds: destCardIds,
          },
        },
      })
    }

    // Sauvegarder dans l'API
    await get().saveBoard()
  },

  // Réinitialiser le tableau
  resetBoard: async () => {
    const { boardId } = get()
    set({ ...initialData, boardId })
    await get().saveBoard()
  },

  // Ajouter une nouvelle colonne
  addColumn: async (title) => {
    const newColumnId = `column-${Date.now()}`
    const newColumn = {
      id: newColumnId,
      title,
      cardIds: [],
    }

    set(state => ({
      columns: {
        ...state.columns,
        [newColumnId]: newColumn,
      },
      columnOrder: [...state.columnOrder, newColumnId],
    }))

    await get().saveBoard()
  },

  // Supprimer une colonne
  deleteColumn: async (columnId) => {
    const { columns, cards, columnOrder } = get()
    
    // Supprimer aussi toutes les cartes de la colonne
    const cardIdsToDelete = columns[columnId].cardIds
    const newCards = { ...cards }
    cardIdsToDelete.forEach(cardId => delete newCards[cardId])

    const newColumns = { ...columns }
    delete newColumns[columnId]

    const newColumnOrder = columnOrder.filter(id => id !== columnId)

    set({
      columns: newColumns,
      cards: newCards,
      columnOrder: newColumnOrder,
    })

    await get().saveBoard()
  },
}))

export default useBoardStore
