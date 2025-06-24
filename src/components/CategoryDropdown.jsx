import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export function CategoryDropdown({ allCategories, selectedCategories, onCategoryChange, onSelectAll, onClearAll }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let buttonText = 'Seleccionar Capítulos';
  if (selectedCategories.includes('Todos')) {
    buttonText = 'Todos los Capítulos';
  } else if (selectedCategories.length > 0) {
    buttonText = `${selectedCategories.length} Capítulos seleccionados`;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-64 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span>{buttonText}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-64 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-2 border-b">
            <button onClick={onSelectAll} className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-indigo-500 hover:text-white">Seleccionar Todos</button>
            <button onClick={onClearAll} className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-indigo-500 hover:text-white">Limpiar Selección</button>
          </div>
          <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar">
            {allCategories.filter(c => c !== 'Todos').map(category => (
              <label key={category} className="flex items-center w-full px-2 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  checked={selectedCategories.includes(category)}
                  onChange={() => onCategoryChange(category)}
                />
                <span className="ml-3">{category}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}