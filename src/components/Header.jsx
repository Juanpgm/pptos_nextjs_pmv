import React from 'react';
import { CategoryDropdown } from './CategoryDropdown';
import { Search } from 'lucide-react';

export function Header({
  allCategories,
  selectedCategories,
  onCategoryChange,
  onSelectAll,
  onClearAll,
  searchTerm,
  onSearchChange
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-200 sticky top-20 z-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-shrink-0">
          <CategoryDropdown 
            allCategories={allCategories}
            selectedCategories={selectedCategories}
            onCategoryChange={onCategoryChange}
            onSelectAll={onSelectAll}
            onClearAll={onClearAll}
          />
        </div>
        <div className="relative w-full md:w-auto md:flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar en capítulos seleccionados..."
            value={searchTerm}
            className="w-full p-2 pl-10 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            onChange={onSearchChange}
          />
        </div>
      </div>
    </div>
  );
}