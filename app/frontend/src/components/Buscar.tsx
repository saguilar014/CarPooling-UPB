console.error("🚨 ARCHIVO BUSCAR.TSX CARGADO EN EL NAVEGADOR");

import React, { useState } from 'react';
import './Buscar.css';

interface BuscarProps {
  onNavigate?: (tab: string) => void; // Cambiado de ViewType a string genérico
  onSearchResults?: (results: any[]) => void;
}


export const Buscar: React.FC<BuscarProps> = ({ onNavigate, onSearchResults }) => {
  console.error("🚨 ESTOY EN EL ARCHIVO BUSCAR.TSX - SI VES ESTO, SÍ SE ESTÁ RENDERIZANDO");
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("¡El botón fue presionado con éxito!");

    // 🔴 Criterio 1: Se deben diligenciar ambos campos para ejecutar la búsqueda
    if (!origen.trim() || !destino.trim()) {
      setError('Por favor selecciona un origen y un destino para buscar.');
      return;
    }

    if (origen === destino) {
      setError('El origen y el destino no pueden ser iguales.');
      return;
    }

    setError(null);
    setLoading(true);

    try {

    const url = `/api/trips?origin=${encodeURIComponent(origen)}&destination=${encodeURIComponent(destino)}`;
    console.log("Consultando a:", url);    
      
    // 🛠️ Conexión al endpoint GET /api/trips?origin=...&destination=...
      const response = await fetch(
        `/api/trips?origin=${encodeURIComponent(origen)}&destination=${encodeURIComponent(destino)}`
      );

      if (!response.ok) {
        throw new Error('Error al consultar los viajes disponibles.');
      }

      const data = await response.json();
      
      console.log('Viajes encontrados:', data);

      if (onSearchResults) {
        onSearchResults(data);
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al realizar la búsqueda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buscar-container">
      <div className="buscar-header">
        <button 
          className="btn-back" 
          onClick={() => onNavigate && onNavigate('dashboard')}
          type="button"
        >
          &#8249;
        </button>
        <h1 className="buscar-main-title">Buscar viaje</h1>
      </div>

      <div className="buscar-card">
        <h2 className="buscar-card-title">¿Desde dónde hasta dónde?</h2>
        
        {error && <div className="buscar-error-msg">{error}</div>}

        <form onSubmit={handleSearchSubmit}>
          <div className="inputs-group">
            <div className="input-row">
              <span className="indicator-dot origin-dot"></span>
              <select 
                className="buscar-select" 
                value={origen} 
                onChange={(e) => {
                  setOrigen(e.target.value);
                  setError(null);
                }}
              >
                <option value="" disabled>Selecciona origen</option>
                <option value="UPB Medellín">UPB Medellín</option>
                <option value="El Poblado">El Poblado</option>
                <option value="Laureles">Laureles</option>
                <option value="Envigado">Envigado</option>
                <option value="Sabaneta">Sabaneta</option>
                <option value="Bello">Bello</option>
              </select>
            </div>

            <div className="input-row">
              <span className="indicator-dot destination-dot"></span>
              <select 
                className="buscar-select" 
                value={destino} 
                onChange={(e) => {
                  setDestino(e.target.value);
                  setError(null);
                }}
              >
                <option value="" disabled>Selecciona destino</option>
                <option value="Envigado">Envigado</option>
                <option value="UPB Medellín">UPB Medellín</option>
                <option value="El Poblado">El Poblado</option>
                <option value="Laureles">Laureles</option>
                <option value="Sabaneta">Sabaneta</option>
                <option value="Bello">Bello</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-buscar-submit" disabled={loading}>
            {loading ? 'Buscando...' : '🔍 Buscar viajes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Buscar;