import React, { useState } from 'react';
import { FileText } from 'lucide-react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = ["Home", "Civilytics", "Contáctenos", "Pricing", "FAQ"];

  const NavLink = ({ href, children }) => (
    <a href={href} className="text-mauve-11 hover:text-mauve-12 transition-colors px-3 py-2 rounded-md text-sm font-medium">
      {children}
    </a>
  );

  const MobileNavLink = ({ href, children }) => (
    <a href={href} className="text-mauve-11 hover:text-mauve-12 block px-3 py-2 rounded-md text-base font-medium">
      {children}
    </a>
  );

  return (
    <nav className="bg-mauve-2 border-b border-mauve-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="text-indigo-400" />
            </div>
            <span className="font-bold text-xl ml-2 text-mauve-12">ConstructionWise</span>
            {/* Navegación para pantallas grandes */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map(link => (
                  <NavLink key={link} href="#">
                    {link}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <button className="Button violet">Exportar</button>
          </div>
          {/* Botón de menú para pantallas pequeñas */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-mauve-11 hover:text-mauve-12 hover:bg-mauve-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-mauve-3 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú desplegable para pantallas pequeñas */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
              <MobileNavLink key={link} href="#">
                {link}
              </MobileNavLink>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-mauve-6">
             <div className="px-2">
                <button className="Button violet w-full">Exportar</button>
             </div>
          </div>
        </div>
      )}
    </nav>
  );
}