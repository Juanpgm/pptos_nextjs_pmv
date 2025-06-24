// filepath: src/pages/index.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { ItemTable } from '../components/ItemTable';
import { BudgetTable } from '../components/BudgetTable';
import { Navbar } from '../components/Navbar';
import { Header } from '../components/Header';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useDebounce } from '../hooks/useDebounce';
import useSWR from 'swr'; // Añade esta importación
import { v4 as uuidv4 } from 'uuid'; // También falta esta importación para handleAddChapter

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CrmPage() {
  // Estado para el presupuesto
  const [budgetChapters, setBudgetChapters] = useState([]);
  
  // Estado para el modal de items
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentlyAddingToChapterId, setCurrentlyAddingToChapterId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  // Carga todos los items cuando el modal se abre.
  // El filtrado y la paginación se manejarán en el lado del cliente dentro de ItemTable.
  const { data: itemsData, error: itemsError } = useSWR(isModalOpen ? '/api/items?limit=30000' : null, fetcher);

  const handleOpenAddItemModal = (chapterId) => {
    setCurrentlyAddingToChapterId(chapterId);
    setIsModalOpen(true);
    setSelectedItems([]);
  };

  // Cierra el modal y resetea los estados relacionados
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentlyAddingToChapterId(null); // Limpia el ID del capítulo
    setSelectedItems([]);
  };

  const handleToggleItemSelected = (item) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(i => i.CODIGO === item.CODIGO);
      return isSelected ? prev.filter(i => i.CODIGO !== item.CODIGO) : [...prev, item];
    });
  };

  // La función de confirmación vuelve a la lógica de añadir a un capítulo específico
  const handleConfirmItems = () => {
    setBudgetChapters(prevChapters => {
      return prevChapters.map(chapter => {
        if (chapter.id === currentlyAddingToChapterId) {
          const existingItemCodes = new Set(chapter.items.map(item => item.CODIGO));
          const newItemsToAdd = selectedItems
            .filter(selectedItem => !existingItemCodes.has(selectedItem.CODIGO))
            .map(item => ({ ...item, QTY: 1 }));
          
          return { ...chapter, items: [...chapter.items, ...newItemsToAdd] };
        }
        return chapter;
      });
    });
    handleCloseModal();
  };

  const handleUpdateQty = (chapterId, itemCode, newQty) => {
    setBudgetChapters(prev => prev.map(chapter => {
      if (chapter.id === chapterId) {
        const updatedItems = newQty > 0
          ? chapter.items.map(item => item.CODIGO === itemCode ? { ...item, QTY: newQty } : item)
          : chapter.items.filter(item => item.CODIGO !== itemCode);
        return { ...chapter, items: updatedItems };
      }
      return chapter;
    }));
  };
  
  const handleAddChapter = () => {
    const newChapter = { id: uuidv4(), name: "Nuevo Capítulo (Haz clic para editar)", items: [] };
    setBudgetChapters(prev => [...prev, newChapter]);
  };

  const handleUpdateChapterName = (chapterId, newName) => setBudgetChapters(prev => prev.map(c => c.id === chapterId ? { ...c, name: newName } : c));
  const handleDeleteChapter = (chapterId) => setBudgetChapters(prev => prev.filter(c => c.id !== chapterId));
  const handleClearBudget = () => setBudgetChapters([]);

  const totalBudget = useMemo(() => budgetChapters.reduce((total, chapter) => total + chapter.items.reduce((subTotal, item) => subTotal + (item.VALOR * (item.QTY || 0)), 0), 0), [budgetChapters]);

  return (
    <div>
      <Navbar />
      {/* Se añaden paddings responsivos: px-4 por defecto, sm:px-6 en pantallas pequeñas, lg:px-8 en grandes */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12 md:py-20">
          {/* El tamaño del texto ya es responsivo con md:text-7xl */}
          <h1 className="text-6xl md:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500 pb-4">
            ConstructionWise
          </h1>
          <p className="mt-6 text-lg md:text-xl text-mauve-11 max-w-2xl mx-auto">
            La herramienta inteligente para crear presupuestos de construcción de forma rápida y precisa.
          </p>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-mauve-12 mb-6 pb-2 border-b-2 border-mauve-6">Mi Presupuesto</h2>
          <BudgetTable 
            chapters={budgetChapters}
            onUpdateQty={handleUpdateQty}
            onClearBudget={handleClearBudget}
            onAddChapter={handleAddChapter}
            onUpdateChapterName={handleUpdateChapterName}
            onDeleteChapter={handleDeleteChapter}
            onOpenAddItemModal={handleOpenAddItemModal}
            total={totalBudget}
          />
        </section>
      </main>

      <Dialog.Root open={isModalOpen} onOpenChange={(open) => !open && handleCloseModal()}>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <div className="p-6 border-b border-mauve-6 flex-shrink-0 flex justify-between items-center">
              <Dialog.Title className="DialogTitle">
                Añadir Item al Presupuesto
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="IconButton" aria-label="Close">
                  <Cross2Icon className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>
            
            {/* El componente ItemTable ahora ocupa todo el espacio y maneja su propio estado */}
            <div className="flex-grow overflow-hidden">
              <ItemTable 
                items={itemsData?.items || []} 
                isLoading={!itemsData && !itemsError} 
                onToggleItem={handleToggleItemSelected}
                selectedItems={selectedItems}
                onAddItems={handleConfirmItems}
                onClose={handleCloseModal} // Pasar la función de cierre
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}