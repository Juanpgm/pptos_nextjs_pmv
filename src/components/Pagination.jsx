import React from 'react';

export function Pagination({ currentPage, totalPages, totalItems, onPageChange }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm">
      <span className="text-mauve-11">
        Mostrando página {currentPage} de {totalPages} ({totalItems} items)
      </span>
      
      <div className="flex items-center space-x-1">
        <button
          className="px-3 py-1 border border-mauve-6 rounded-md bg-white hover:bg-mauve-3 text-mauve-12 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          «
        </button>
        <button
          className="px-3 py-1 border border-mauve-6 rounded-md bg-white hover:bg-mauve-3 text-mauve-12 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </button>
        
        <span className="px-3 py-1">
          {currentPage} / {totalPages}
        </span>
        
        <button
          className="px-3 py-1 border border-mauve-6 rounded-md bg-white hover:bg-mauve-3 text-mauve-12 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ›
        </button>
        <button
          className="px-3 py-1 border border-mauve-6 rounded-md bg-white hover:bg-mauve-3 text-mauve-12 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    </div>
  );
}