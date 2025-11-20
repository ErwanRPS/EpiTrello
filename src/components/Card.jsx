import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

/**
 * Composant Card - Représente une carte individuelle dans une colonne
 * Affiche le titre et la description, avec options d'édition et suppression
 */
const Card = ({ card, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Sauvegarde les modifications
  const handleSave = () => {
    if (title.trim()) {
      onUpdate(card.id, title, description)
      setIsEditing(false)
    }
  }

  // Annule les modifications
  const handleCancel = () => {
    setTitle(card.title)
    setDescription(card.description)
    setIsEditing(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 transition-all duration-200 hover:shadow-md ${
        isDragging ? 'opacity-50 shadow-lg' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      {isEditing ? (
        // Mode édition
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            placeholder="Titre de la carte"
            autoFocus
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
            placeholder="Description (optionnelle)"
            rows="3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-3 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium transition-colors"
            >
              Enregistrer
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        // Mode affichage
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1">
              {card.title}
            </h3>
            <span 
              {...attributes} 
              {...listeners} 
              className="text-gray-400 ml-2 cursor-grab active:cursor-grabbing hover:text-gray-600" 
              title="Glisser-déposer"
            >
              ⋮⋮
            </span>
          </div>
          {card.description && (
            <p className="text-gray-600 text-xs mb-3 leading-relaxed">{card.description}</p>
          )}
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded transition-colors font-medium"
            >
              ✏️ Modifier
            </button>
            <button
              onClick={() => onDelete(card.id)}
              className="flex-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors font-medium"
            >
              🗑️ Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Card
