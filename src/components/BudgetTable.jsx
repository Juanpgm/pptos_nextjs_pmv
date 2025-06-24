import React, { useState, useEffect, useRef } from 'react';
import { Trash2, ChevronDown, ChevronUp, Edit, Check, PlusCircle, FilePlus2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const formattedValue = (value) => new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', minimumFractionDigits: 2,
}).format(value);

const EditableChapterName = ({ name, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(name);

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate(value);
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
        autoFocus
        // Aplicamos la clase también al input para consistencia
        className="bg-transparent border-b border-violet-8 text-mauve-12 w-full budget-chapter-title"
      />
    );
  }
  // Aplicamos la clase .budget-chapter-title que ya tienes en tu CSS
  return <span onClick={() => setIsEditing(true)} className="cursor-pointer budget-chapter-title">{name}</span>;
};

const formatCurrency = (value) => Number(value).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });

// --- 1. MODIFICACIÓN EN ChapterRow ---
// Este componente ahora solo renderiza filas (<tr>), no una tabla completa.
function ChapterRow({ chapter, onUpdateQty, onUpdateChapterName, onDeleteChapter, onOpenAddItemModal }) {
  const [open, setOpen] = useState(true);
  
  // El cálculo del total no cambia
  const chapterTotal = chapter.items.reduce((total, item) => total + (item.VALOR * (item.QTY || 0)), 0);
  
  const UpArrow = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>;
  const DownArrow = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;

  return (
    <React.Fragment>
      {/* Fila del Título del Capítulo (Modificada: sin total) */}
      <tr className="bg-mauve-4 border-b border-mauve-6 text-mauve-12">
        <td className="w-12 px-2 py-3 align-middle">
          <button onClick={() => setOpen(!open)} className="p-2 rounded-full hover:bg-mauve-5">
            {open ? <UpArrow /> : <DownArrow />}
          </button>
        </td>
        <td className="px-4 py-3 font-bold align-middle" colSpan={3}>
          <EditableChapterName name={chapter.name} onUpdate={(newName) => onUpdateChapterName(chapter.id, newName)} />
        </td>
        {/* Se ajusta colSpan para ocupar el espacio del total que se eliminó */}
        <td className="px-4 py-3 text-right align-middle" colSpan={3}>
          <div className="flex justify-end space-x-3">
            <button onClick={() => onOpenAddItemModal(chapter.id)} className="p-2 rounded-full hover:bg-mauve-5 text-medium-blue transition-colors" title="Añadir Items">
              <PlusCircle size={20} />
            </button>
            <button onClick={() => onDeleteChapter(chapter.id)} className="p-2 rounded-full hover:bg-mauve-5 text-error transition-colors" title="Eliminar Capítulo">
              <Trash2 size={20} />
            </button>
          </div>
        </td>
      </tr>

      {/* Filas de los Items (sin cambios) */}
      {open && chapter.items.map(item => (
        <tr key={item.CODIGO} className="border-b border-mauve-4 hover:bg-mauve-3 bg-white">
          <td className="w-12 px-2"></td>
          <td className="px-4 py-3 font-mono">{item.CODIGO}</td>
          <td className="px-4 py-3">{item.DESCRIPCION}</td>
          <td className="px-4 py-3 text-center">{item.UNIDAD}</td>
          <td className="px-4 py-3">
            <input 
              type="number"
              value={item.QTY}
              onChange={(e) => onUpdateQty(chapter.id, item.CODIGO, parseFloat(e.target.value) || 0)}
              className="Input w-full text-center"
            />
          </td>
          <td className="px-4 py-3 text-right font-mono">{formatCurrency(item.VALOR)}</td>
          <td className="px-4 py-3 text-right font-semibold font-mono">{formatCurrency(item.VALOR * item.QTY)}</td>
        </tr>
      ))}

      {/* --- NUEVA FILA DE SUBTOTAL DEL CAPÍTULO --- */}
      {/* Esta fila aparece al final de los items si el capítulo está abierto y tiene items */}
      {open && chapter.items.length > 0 && (
        <tr className="bg-mauve-3 border-b-2 border-mauve-6">
          <td colSpan={6} className="px-4 py-2 text-right font-bold text-mauve-12">
            Subtotal Capítulo
          </td>
          <td className="px-4 py-2 text-right font-bold text-mauve-12 font-mono">
            {formatCurrency(chapterTotal)}
          </td>
        </tr>
      )}

      {/* Mensaje cuando no hay items (sin cambios) */}
      {open && chapter.items.length === 0 && (
        <tr className="bg-white">
          <td className="w-12 px-2"></td>
          <td colSpan={6} className="text-center py-8 text-mauve-11">
            Este capítulo no tiene items. Haz clic en "Añadir Items" para empezar.
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

export function BudgetTable({ chapters, onUpdateQty, onClearBudget, onAddChapter, onUpdateChapterName, onDeleteChapter, onOpenAddItemModal, total }) {
  return (
    <div className="bg-mauve-2 rounded-lg shadow-lg overflow-hidden border border-mauve-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-mauve-12">
          
          {/* ENCABEZADO GENERAL Y ÚNICO DE LA TABLA (Visible en PC) */}
          <thead className="hidden md:table-header-group text-xs text-mauve-11 uppercase bg-mauve-3">
            <tr>
              <th scope="col" className="w-12 px-2"></th> {/* Columna para el botón de expandir */}
              <th scope="col" className="px-4 py-3 w-[10%]">CODIGO</th>
              <th scope="col" className="px-4 py-3 w-[40%]">DESCRIPCION</th>
              <th scope="col" className="px-4 py-3 w-[10%] text-center">UNIDAD</th>
              <th scope="col" className="px-4 py-3 w-[15%] text-center">CANTIDAD</th>
              <th scope="col" className="px-4 py-3 w-[12.5%] text-right">PRECIO UNITARIO</th>
              <th scope="col" className="px-4 py-3 w-[12.5%] text-right">VALOR PARCIAL</th>
            </tr>
          </thead>

          <tbody>
            {/* El componente ChapterRow ahora inserta sus filas aquí, bajo el encabezado general */}
            {chapters.map(chapter => (
              <ChapterRow
                key={chapter.id}
                chapter={chapter}
                onUpdateQty={onUpdateQty}
                onUpdateChapterName={onUpdateChapterName}
                onDeleteChapter={onDeleteChapter}
                onOpenAddItemModal={onOpenAddItemModal}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pie de la tabla con el total y botones actualizados */}
      <div className="p-4 border-t border-mauve-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <span className="text-lg font-bold text-mauve-12">Total Presupuesto</span>
            <span className="text-2xl font-extrabold text-violet-11">{formatCurrency(total)}</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button onClick={onAddChapter} className="Button violet w-full sm:w-auto">
            Añadir Capítulo
          </button>
          {chapters.length > 0 && (
            <button onClick={onClearBudget} className="Button red w-full sm:w-auto">
              Limpiar Presupuesto
            </button>
          )}
        </div>
      </div>
    </div>
  );
}