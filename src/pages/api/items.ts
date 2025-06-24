// filepath: src/pages/api/items.ts
import path from 'path';
import { promises as fs } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const searchTerm = (req.query.search as string || '').toLowerCase();
  const categoriesQuery = req.query.category as string || '';

  try {
    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(path.join(jsonDirectory, 'items.json'), 'utf8');
    let items = JSON.parse(fileContents);

    const selectedCategories = categoriesQuery ? categoriesQuery.split(',') : [];
    
    // Si "Todos" está en la lista o la lista está vacía, no filtramos por categoría.
    // Filtramos solo si hay categorías específicas seleccionadas.
    if (selectedCategories.length > 0 && !selectedCategories.includes('Todos')) {
      items = items.filter((item: any) => selectedCategories.includes(item.CAPITULO));
    }
    
    if (searchTerm) {
      items = items.filter((item: any) => item.DESCRIPCION.toLowerCase().includes(searchTerm));
    }

    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedItems = items.slice(startIndex, endIndex);

    res.status(200).json({
      items: paginatedItems,
      totalItems,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al leer los datos' });
  }
}