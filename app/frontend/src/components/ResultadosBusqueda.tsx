import React, { useState } from 'react';
import './ResultadosBusqueda.css';
import { obtenerViajesActualizados } from '../data/viajesData';

interface ResultadosBusquedaProps {
  origen?: string;   // <--- Agrégalo aquí
  destino?: string;  // <--- Agrégalo aquí
  onNavigate?: (tab: string) => void;
  onSelectTrip?: (tripId: string) => void;
}

export const ResultadosBusqueda: React.FC<ResultadosBusquedaProps> = ({ 
  origen = '', 
  destino = '', 
  onNavigate, 
  onSelectTrip 
}) => {
  // Filtra usando el mock centralizado
  // Obtener los viajes más recientes (incluyendo los publicados por el conductor)
  const todosLosViajes = obtenerViajesActualizados();

  // Filtro flexible para asegurar coincidencia
  const viajesFiltrados = todosLosViajes.filter((viaje) => {
    const orgViaje = viaje.origen.toLowerCase().trim();
    const orgBusqueda = origen.toLowerCase().trim();
    const destViaje = viaje.destino.toLowerCase().trim();
    const destBusqueda = destino.toLowerCase().trim();

    const coincideOrigen = orgBusqueda === '' || orgViaje.includes(orgBusqueda) || orgBusqueda.includes(orgViaje);
    const coincideDestino = destBusqueda === '' || destViaje.includes(destBusqueda) || destBusqueda.includes(destViaje);

    return coincideOrigen && coincideDestino;
  });

  return (
    <div className="resultados-container">
      {/* Cabecera */}
      <div className="resultados-header">
        <button 
          className="btn-back" 
          onClick={() => onNavigate && onNavigate('buscar')}
          type="button"
        >
          &#8249;
        </button>
        <h1 className="resultados-main-title">Viajes disponibles</h1>
      </div>

      {/* Filtro de ruta seleccionada y selector de orden */}
      <div className="filtros-resumen-bar">
        <div className="badge-ruta">
            <span className="dot-origen"></span> {origen || 'Origen'} → {destino || 'Destino'} &nbsp;•&nbsp; <strong>Hoy</strong>
        </div>
      </div>

      <div style={{ margin: '12px 0 16px 4px' }}>
        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
          {viajesFiltrados.length === 1 
            ? '1 viaje disponible' 
            : `${viajesFiltrados.length} viajes disponibles`}
        </span>
      </div>

      {/* Listado de tarjetas de resultados */}
      <div className="tarjetas-lista" style={{ marginTop: '16px' }}>
        {viajesFiltrados.length === 0 ? (
          <div className="no-viajes-container" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>🚗</span>
            <h3 style={{ margin: '0 0 6px 0', color: '#1e293b', fontSize: '1.1rem' }}>No hay viajes disponibles</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              No encontramos conductores para la ruta <strong>{origen} → {destino}</strong> hoy.
            </p>
          </div>
        ) : (
          viajesFiltrados.map((viaje) => (
            <div key={viaje.id} className="trip-card">
              {/* Cabecera de la tarjeta: Conductor e Indicadores */}
              <div className="card-header-conductor">
                <div className="conductor-info-left">
                  <div className="conductor-avatar">{viaje.conductor.avatar}</div>
                  <div className="conductor-textos">
                    <h3>{viaje.conductor.nombre}</h3>
                    <p>{viaje.conductor.vehiculo}</p>
                  </div>
                </div>
                <div className="conductor-info-right">
                  <div className="rating-badge">
                    ⭐ {viaje.conductor.calificacion} <span className="resenas-count">({viaje.conductor.resenas})</span>
                  </div>
                  <div className="cupos-badge">
                    {viaje.cuposDisponibles} cupos
                  </div>
                </div>
              </div>

              {/* Resumen de ruta, fecha y hora */}
              <div className="card-body-detalles">
                <div className="horario-ruta">
                  <span className="hora-text">{viaje.horaSalida}</span>
                  <span className="ruta-trayecto">{viaje.origen} ➔ {viaje.destino}</span>
                </div>
                <div className="punto-encuentro">
                  <span className="pin-icon">📍</span> {viaje.puntoEncuentro}
                </div>
              </div>

              {/* Botón de acción */}
              <button 
                className="btn-ver-detalle"
                onClick={() => onSelectTrip && onSelectTrip(viaje.id)}
              >
                Ver detalle
              </button>
            </div>
          ))
        )}
      </div>

      <nav className="bottom-navbar">
        <button className="nav-item active" onClick={() => onNavigate?.('dashboard')}>
          <span className="nav-icon">🏠</span>
          <span>Inicio</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate?.('buscar')}>
          <span className="nav-icon">🔍</span>
          <span>Buscar</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate?.('mis-viajes')}>
          <span className="nav-icon">📅</span>
          <span>Mis viajes</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate?.('perfil')}>
          <span className="nav-icon">👤</span>
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default ResultadosBusqueda;