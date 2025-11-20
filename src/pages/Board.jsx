import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useState } from 'react'
import Column from '../components/Column'
import Card from '../components/Card'
import useBoardStore from '../store/useBoardStore'

/**
 * Composant Board - Page principale du tableau Kanban
 * Gère le drag & drop et affiche toutes les colonnes
 */
const Board = () => {
  const { columns, cards, columnOrder, reorderCards, resetBoard } = useBoardStore()
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Trouve la colonne qui contient une carte
  const findContainer = cardId => {
    if (cardId in columns) {
      return cardId
    }

    return Object.keys(columns).find(key =>
      columns[key].cardIds.includes(cardId)
    )
  }

  // Gère le début du drag
  const handleDragStart = event => {
    const { active } = event
    setActiveId(active.id)
  }

  // Gère le mouvement pendant le drag
  const handleDragOver = event => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId)

    if (!activeContainer || !overContainer) return

    if (activeContainer !== overContainer) {
      const activeIndex = columns[activeContainer].cardIds.indexOf(activeId)
      const overIndex = columns[overContainer].cardIds.indexOf(overId)

      const overIndexAdjusted = overId in columns 
        ? columns[overContainer].cardIds.length 
        : overIndex

      reorderCards(activeContainer, overContainer, activeIndex, overIndexAdjusted)
    }
  }

  // Gère la fin du drag
  const handleDragEnd = event => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    const activeId = active.id
    const overId = over.id

    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId)

    if (!activeContainer || !overContainer) {
      setActiveId(null)
      return
    }

    const activeIndex = columns[activeContainer].cardIds.indexOf(activeId)
    const overIndex = columns[overContainer].cardIds.indexOf(overId)

    if (activeIndex !== overIndex) {
      reorderCards(activeContainer, overContainer, activeIndex, overIndex)
    }

    setActiveId(null)
  }

  // Confirmer avant de réinitialiser
  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser le tableau ?')) {
      resetBoard()
    }
  }

  return (
    <div>
      {/* Barre d'actions */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Mon Tableau Kanban</h2>
          <p className="text-sm text-gray-600 mt-1">
            👆 Clique et maintiens une carte, puis déplace-la vers une autre colonne
          </p>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 text-sm font-medium transition-colors border border-red-200"
        >
          🔄 Réinitialiser
        </button>
      </div>

      {/* Tableau avec drag & drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col sm:flex-row gap-6 overflow-x-auto pb-4">
          {columnOrder.map(columnId => {
            const column = columns[columnId]
            const columnCards = column.cardIds.map(cardId => cards[cardId]).filter(Boolean)

            return <Column key={column.id} column={column} cards={columnCards} />
          })}
        </div>

        <DragOverlay>
          {activeId && cards[activeId] ? (
            <div className="opacity-90 rotate-3">
              <Card card={cards[activeId]} onDelete={() => {}} onUpdate={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default Board
