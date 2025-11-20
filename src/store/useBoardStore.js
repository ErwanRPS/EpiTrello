import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Données initiales pour la première utilisation
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

// Store Zustand avec persistance localStorage
const useBoardStore = create(
  persist(
    (set, get) => ({
      ...initialData,

      // Ajouter une nouvelle carte
      addCard: (columnId, title, description) => {
        const newCardId = `card-${Date.now()}`
        const newCard = {
          id: newCardId,
          title,
          description,
        }

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
      },

      // Supprimer une carte
      deleteCard: (cardId, columnId) => {
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
      },

      // Modifier une carte
      updateCard: (cardId, title, description) => {
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
      },

      // Gérer le drag and drop
      reorderCards: (sourceColumnId, destColumnId, sourceIndex, destIndex) => {
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
      },

      // Réinitialiser le tableau
      resetBoard: () => {
        set(initialData)
      },
    }),
    {
      name: 'epitrello-storage', // Nom de la clé dans localStorage
    }
  )
)

export default useBoardStore
