import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { promises as fs } from 'fs';

// Definir un tipo para la estructura de un item para mayor seguridad
type Item = {
  CODIGO: string;
  DESCRIPCION: string;
  UNIDAD: string;
  VALOR: number;
  CAPITULO: string;
};

// Definir un tipo para la respuesta de la API
type ApiResponse = {
  items: Item[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | { message: string }>
) {
  try {
    // Construir la ruta completa al archivo JSON
    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(path.join(jsonDirectory, 'items.json'), 'utf8');
    const allItems: Item[] = JSON.parse(fileContents);

    // Obtener parámetros de la query
    const {
      limit = '10',
      page = '1',
      search = '',
      category = 'Todos',
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const searchTerm = (search as string).toLowerCase();

    // Filtrar items basado en categoría y término de búsqueda
    let filteredItems = allItems;

    if (category && category !== 'Todos' && category !== 'Filtrar por Grupo de APU') {
      filteredItems = filteredItems.filter(
        (item) => item.CAPITULO === category
      );
    }

    if (searchTerm) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.CODIGO.toLowerCase().includes(searchTerm) ||
          item.DESCRIPCION.toLowerCase().includes(searchTerm) ||
          item.UNIDAD.toLowerCase().includes(searchTerm)
      );
    }

    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / limitNum);

    // Paginar los resultados
    const paginatedItems = filteredItems.slice(
      (pageNum - 1) * limitNum,
      pageNum * limitNum
    );

    // Enviar la respuesta exitosa
    res.status(200).json({
      items: paginatedItems,
      totalItems,
      totalPages,
      currentPage: pageNum,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al leer el archivo de datos' });
  }
}