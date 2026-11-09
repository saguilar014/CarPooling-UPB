import { Request, Response } from 'express';

// Diccionario / Arreglo JSON de ejemplo con diferentes escenarios de prueba
const mockTrips = [
  {
    id: 1,
    origen: 'UPB Medellín',
    destino: 'Envigado',
    estado: 'publicado',
    fecha_salida: new Date(Date.now() + 86400000 * 2).toISOString(), // Fecha en el futuro (Válido)
    cupos_disponibles: 3,
    conductor: 'Carlos Pérez'
  },
  {
    id: 2,
    origen: 'upb medellín', // Prueba de minúsculas (Debe matchear por normalización)
    destino: 'envigado',
    estado: 'publicado',
    fecha_salida: new Date(Date.now() + 86400000 * 3).toISOString(), // Fecha en el futuro (Válido)
    cupos_disponibles: 2,
    conductor: 'Ana Gómez'
  },
  {
    id: 3,
    origen: 'UPB Medellín',
    destino: 'Envigado',
    estado: 'borrador', // NO debe aparecer (no está publicado)
    fecha_salida: new Date(Date.now() + 86400000 * 2).toISOString(),
    cupos_disponibles: 3,
    conductor: 'Juan Ruiz'
  },
  {
    id: 4,
    origen: 'UPB Medellín',
    destino: 'Envigado',
    estado: 'publicado',
    fecha_salida: '2025-01-01T08:00:00.000Z', // Fecha pasada -> NO debe aparecer
    cupos_disponibles: 3,
    conductor: 'Pedro López'
  },
  {
    id: 5,
    origen: 'UPB Medellín',
    destino: 'Envigado',
    estado: 'publicado',
    fecha_salida: new Date(Date.now() + 86400000 * 2).toISOString(),
    cupos_disponibles: 0, // Sin cupos -> NO debe aparecer
    conductor: 'María Torres'
  },
  {
    id: 6,
    origen: 'Laureles',
    destino: 'El Poblado',
    estado: 'publicado',
    fecha_salida: new Date(Date.now() + 86400000 * 2).toISOString(),
    cupos_disponibles: 4,
    conductor: 'Sofía Castro' // Diferente ruta -> NO debe aparecer si buscas a Envigado
  }
];

export const searchTrips = async (req: Request, res: Response) => {
  try {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({ 
        error: 'Los parámetros origin y destination son obligatorios.' 
      });
    }

    // 1. Normalización estricta de espacios y minúsculas (TRIM y LOWER)
    const normalizedOrigin = (origin as string).trim().toLowerCase();
    const normalizedDestination = (destination as string).trim().toLowerCase();
    const now = new Date();

    // 2. Filtrar los viajes simulados cumpliendo con todos los criterios de la HU
    const filteredTrips = mockTrips.filter(trip => {
      const matchOrigin = trip.origen.trim().toLowerCase() === normalizedOrigin;
      const matchDestination = trip.destino.trim().toLowerCase() === normalizedDestination;
      const isPublished = trip.estado === 'publicado';
      const isFuture = new Date(trip.fecha_salida) > now;
      const hasSlots = trip.cupos_disponibles > 0;

      return matchOrigin && matchDestination && isPublished && isFuture && hasSlots;
    });

    // 3. Retorna los resultados (si no hay coincidencias, devolverá un arreglo vacío [])
    return res.status(200).json(filteredTrips);

  } catch (error) {
    console.error('Error al simular la búsqueda de viajes:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};