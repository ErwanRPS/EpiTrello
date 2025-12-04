import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import Card from './Card'
import useBoardStore from '../store/useBoardStore'

/**
 * Composant Column - Représente une colonne du tableau Kanban
 * Contient plusieurs cartes et permet d'en ajouter de nouvelles
 */
const Column = ({ column, cards, onDelete }) => {
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const [newCardDescription, setNewCardDescription] = useState('')

  const { addCard, deleteCard, updateCard } = useBoardStore()
  
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  // Ajoute une nouvelle carte
  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      addCard(column.id, newCardTitle, newCardDescription)
      setNewCardTitle('')
      setNewCardDescription('')
      setIsAddingCard(false)
    }
  }

  // Annule l'ajout
  const handleCancel = () => {
    setNewCardTitle('')
    setNewCardDescription('')
    setIsAddingCard(false)
  }

  return (
    <div className="bg-gray-100 rounded-lg p-4 w-full sm:w-80 flex-shrink-0">
      {/* En-tête de la colonne */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
          {column.title}
          <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
            {cards.length}
          </span>
        </h2>
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-600 transition-colors p-1"
            title="Supprimer la colonne"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Zone de drop pour les cartes */}
      <SortableContext items={cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`min-h-[200px] transition-colors rounded-lg ${
            isOver ? 'bg-primary-50' : ''
          }`}
        >
          {/* Liste des cartes */}
          {cards.map(card => (
            <Card
              key={card.id}
              card={card}
              onDelete={cardId => deleteCard(cardId, column.id)}
              onUpdate={updateCard}
            />
          ))}

          {/* Formulaire d'ajout de carte */}
          {isAddingCard ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
              <input
                type="text"
                value={newCardTitle}
                onChange={e => setNewCardTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                placeholder="Titre de la carte"
                autoFocus
              />
              <textarea
                value={newCardDescription}
                onChange={e => setNewCardDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                placeholder="Description (optionnelle)"
                rows="3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddCard}
                  className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium transition-colors"
                >
                  Ajouter
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingCard(true)}
              className="w-full py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span className="text-lg">+</span>
              Ajouter une carte
            </button>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export default Column
