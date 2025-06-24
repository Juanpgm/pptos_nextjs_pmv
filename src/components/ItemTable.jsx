import React, { useState, useMemo, useEffect } from 'react';
import { PlusCircle, X } from 'lucide-react'; // Añade esta importación

export function ItemTable({ items, isLoading, onToggleItem, selectedItems, onAddItems, onClose }) {
  // Estados para la tabla interactiva
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedCategory, setSelectedCategory] = useState('TODOS'); // 1. Nuevo estado para el capítulo

  // 2. Obtener la lista de capítulos únicos para el dropdown
  const allCategories = useMemo(() => {
    if (!items) return ['TODOS'];
    const categorySet = new Set(items.map(item => item.CAPITULO));
    return ['TODOS', ...Array.from(categorySet).sort()];
  }, [items]);
  
  // Función para ordenar las columnas
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // 3. Filtrar y ordenar los items (lógica actualizada)
  const filteredAndSortedItems = useMemo(() => {
    let filteredItems = items;

    // Primero, filtrar por capítulo si no es "TODOS"
    if (selectedCategory !== 'TODOS') {
      filteredItems = filteredItems.filter(item => item.CAPITULO === selectedCategory);
    }
    
    // Luego, filtrar por el término de búsqueda sobre la lista YA FILTRADA
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      // BUG CORREGIDO: Se filtra sobre `filteredItems`, no sobre `items`
      filteredItems = filteredItems.filter(item => 
        item.CODIGO.toLowerCase().includes(search) ||
        item.DESCRIPCION.toLowerCase().includes(search) ||
        item.UNIDAD.toLowerCase().includes(search) ||
        String(item.VALOR).includes(search)
      );
    }
    
    // Finalmente, ordenar
    if (sortConfig.key) {
      filteredItems = [...filteredItems].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredItems;
  }, [items, searchTerm, sortConfig, selectedCategory]); // Añadir selectedCategory a las dependencias
  
  // Calcular la cantidad total de páginas
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  
  // Obtener los items de la página actual
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedItems, currentPage, itemsPerPage]);
  
  // Reset a la primera página cuando cambia el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortConfig, selectedCategory]); // Añadir selectedCategory a las dependencias
  
  const selectedItemCodes = new Set(selectedItems.map(item => item.CODIGO));
  
  const formatCurrency = (value) =>
    Number(value).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    });
  
  // Función para mostrar el icono de ordenamiento
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };
  
  if (isLoading)
    return (
      <div className="text-center p-8 text-mauve-11 font-medium bg-white border border-mauve-5 rounded-md shadow-md">
        Cargando items...
      </div>
    );

  if (!items || items.length === 0)
    return (
      <div className="text-center p-8 text-mauve-11 font-medium bg-white border border-mauve-5 rounded-md shadow-md">
        No se encontraron items.
      </div>
    );

  return (
    <div className="item-table-container">
      <div className="overflow-x-auto bg-white rounded-lg shadow-xl border border-mauve-6">
        {/* Título de la tabla con botón de cierre */}
        <div className="bg-mauve-4 p-4 border-b border-mauve-6 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-mauve-12">
            Buscar APUs por descripción
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-mauve-6 transition-colors"
            title="Cerrar"
          >
            <X size={18} className="text-mauve-12" />
          </button>
        </div>
        
        {/* 4. Barra de búsqueda y controles (UI actualizada) */}
        <div className="p-4 bg-white border-b border-mauve-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Contenedor para Dropdown de Capítulo y Búsqueda */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {/* Dropdown para filtrar por capítulo */}
            <select 
              className="w-full sm:w-64 text-sm border border-mauve-6 rounded-lg p-2 bg-white text-mauve-12 focus:ring-violet-6 focus:border-violet-6"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filtrar por capítulo"
            >
              {allCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Barra de búsqueda */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-mauve-9" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input 
                type="search" 
                className="block w-full p-2 pl-10 text-sm text-mauve-12 border border-mauve-6 rounded-lg bg-white focus:ring-violet-6 focus:border-violet-6" 
                placeholder="Buscar en items..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Controles de paginación y selección */}
          <div className="flex items-center space-x-2">
            <select 
              className="text-sm border border-mauve-6 rounded-lg p-2 bg-white text-mauve-12 focus:ring-violet-6 focus:border-violet-6" 
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
            </select>
            <span className="text-sm text-mauve-11">
              {selectedItems.length} seleccionados
            </span>
          </div>
        </div>
        
        {/* Header container con fondo distintivo */}
        <div className="bg-mauve-4 sticky top-0 z-10 border-b border-mauve-6">
          <table className="w-full text-sm text-left text-mauve-12">
            <thead className="text-xs text-mauve-12 uppercase font-semibold">
              <tr>
                {/* Encabezados centrados con relación a su contenido */}
                <th className="p-4 w-[60px] text-center">
                  <span className="sr-only">Seleccionar</span>
                </th>
                <th 
                  className="px-6 py-4 w-[120px] cursor-pointer select-none text-center"
                  onClick={() => requestSort('CODIGO')}
                >
                  <div className="flex items-center justify-center">
                    Código <span className="ml-1">{getSortIcon('CODIGO')}</span>
                  </div>
                </th>
                <th 
                  className="px-6 py-4 cursor-pointer select-none text-center"
                  onClick={() => requestSort('DESCRIPCION')}
                >
                  <div className="flex items-center justify-center">
                    Descripción <span className="ml-1">{getSortIcon('DESCRIPCION')}</span>
                  </div>
                </th>
                <th 
                  className="px-6 py-4 w-[100px] cursor-pointer select-none text-center"
                  onClick={() => requestSort('UNIDAD')}
                >
                  <div className="flex items-center justify-center">
                    Unidad <span className="ml-1">{getSortIcon('UNIDAD')}</span>
                  </div>
                </th>
                <th 
                  className="px-6 py-4 w-[120px] cursor-pointer select-none text-center"
                  onClick={() => requestSort('VALOR')}
                >
                  <div className="flex items-center justify-center">
                    Valor <span className="ml-1">{getSortIcon('VALOR')}</span>
                  </div>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        
        {/* Tabla de datos con scroll independiente */}
        <div className="overflow-y-auto" style={{maxHeight: "calc(80vh - 230px)"}}>
          <table className="w-full text-sm text-left text-mauve-12 ItemTable">
            <tbody>
              {currentItems.map((item) => {
                const isSelected = selectedItemCodes.has(item.CODIGO);
                return (
                  <tr
                    key={item.CODIGO}
                    className={`border-b border-mauve-5 cursor-pointer ${isSelected ? 'bg-violet-4 hover:bg-violet-5' : 'bg-white hover:bg-mauve-2'}`}
                    onClick={() => onToggleItem(item)}
                  >
                    {/* Checkbox con tamaño más grande y visible */}
                    <td className="w-[60px] p-4 text-center">
                      <div className="flex items-center justify-center">
                        <input
                          id={`checkbox-table-${item.CODIGO}`}
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Controlado por el onClick en la fila
                          className="w-6 h-6 bg-white border border-mauve-8 rounded text-violet-9 focus:ring-2 focus:ring-violet-6 cursor-pointer accent-violet-9"
                          style={{ transform: 'scale(1.2)' }} // Aplica un escalado adicional
                        />
                        <label htmlFor={`checkbox-table-${item.CODIGO}`} className="sr-only">checkbox</label>
                      </div>
                    </td>
                    {/* Alineación de contenido acorde a su contexto */}
                    <td className="px-6 py-4 w-[120px] font-mono font-medium text-center">{item.CODIGO}</td>
                    <th scope="row" className="px-6 py-4 font-medium">{item.DESCRIPCION}</th>
                    <td className="px-6 py-4 w-[100px] font-medium text-center">{item.UNIDAD}</td>
                    <td className="px-6 py-4 w-[120px] text-center font-mono font-medium">{formatCurrency(item.VALOR)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Footer con botón de añadir y paginación separados en dos filas */}
        <div className="bg-white border-t border-mauve-5">
          {/* Fila 1: Botón de añadir items alineado a la izquierda */}
          <div className="p-3 border-b border-mauve-5">
            <div className="flex items-center">
              <button
                onClick={() => onAddItems(selectedItems)}
                className="p-3 bg-violet-9 hover:bg-violet-10 text-white rounded-full shadow-sm flex items-center justify-center transition-all"
                disabled={selectedItems.length === 0}
                title={`Añadir ${selectedItems.length} items seleccionados`}
              >
                <PlusCircle size={20} />
                {selectedItems.length > 0 && (
                  <span className="ml-2 text-sm font-medium">{selectedItems.length}</span>
                )}
              </button>
              {selectedItems.length > 0 && (
                <span className="ml-3 text-sm text-mauve-11">
                  {selectedItems.length} items seleccionados
                </span>
              )}
            </div>
          </div>
          
          {/* Fila 2: Controles de paginación centrados */}
          <div className="p-3 flex justify-center sm:justify-end">
            <div className="flex items-center space-x-1">
              <span className="text-sm text-mauve-11 mr-2">
                {filteredAndSortedItems.length > 0 ? 
                  `Mostrando ${Math.min(filteredAndSortedItems.length, (currentPage - 1) * itemsPerPage + 1)} a ${Math.min(currentPage * itemsPerPage, filteredAndSortedItems.length)} de ${filteredAndSortedItems.length}` : 
                  'No hay items'}
              </span>
              <button
                className="px-3 py-1 border border-mauve-6 rounded-md bg-white hover:bg-mauve-3 text-mauve-12 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1 || totalPages === 0}
              >
                «
              </button>
              <button
                className="px-3 py-1 border border-mauve-6 rounded-md bg-white hover:bg-mauve-3 text-mauve-12 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1 || totalPages === 0}
              >
                ‹
              </button>
              
              <span className="text-sm px-2">
                {totalPages > 0 ? `${currentPage}/${totalPages}` : '0/0'}
              </span>
              
              <button
                className="px-3 py-1 border border-mauve-6 rounded-md bg-white hover:bg-mauve-3 text-mauve-12 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                ›
              </button>
              <button
                className="px-3 py-1 border border-mauve-6 rounded-md bg-white hover:bg-mauve-3 text-mauve-12 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}