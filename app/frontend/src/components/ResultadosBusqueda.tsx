import React, { useState } from 'react';
import './ResultadosBusqueda.css';

interface Viaje {
  id: string;
  conductor: {
    nombre: string;
    avatar: string;
    calificacion: number;
    resenas: number;
    vehiculo: string;
  };
  origen: string;
  destino: string;
  horaSalida: string;
  fecha: string;
  puntoEncuentro: string;
  cuposDisponibles: number;
}

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
  // Lista con los viajes de prueba (HU mockup)
  const [todosLosViajes] = useState<Viaje[]>([
    {
      id: '1',
      conductor: {
        nombre: 'Andrés Morales',
        avatar: 'AM',
        calificacion: 4.6,
        resenas: 9,
        vehiculo: 'Chevrolet Spark • Azul',
      },
      origen: 'Bello',
      destino: 'UPB Medellín',
      horaSalida: '6:30 AM',
      fecha: 'Hoy',
      puntoEncuentro: 'Estación del Metro de Bello',
      cuposDisponibles: 2,
    },
    {
      id: '2',
      conductor: {
        nombre: 'Mateo Restrepo',
        avatar: 'MR',
        calificacion: 4.8,
        resenas: 14,
        vehiculo: 'Mazda 2 • Gris',
      },
      origen: 'Bello',
      destino: 'UPB Medellín',
      horaSalida: '7:00 AM',
      fecha: 'Hoy',
      puntoEncuentro: 'Centro Comercial Puerta del Norte',
      cuposDisponibles: 3,
    },
    {
      id: '3',
      conductor: {
        nombre: 'Valentina Ríos',
        avatar: 'VR',
        calificacion: 5.0,
        resenas: 31,
        vehiculo: 'Toyota Yaris • Rojo',
      },
      origen: 'El Poblado',
      destino: 'UPB Medellín',
      horaSalida: '6:45 AM',
      fecha: 'Hoy',
      puntoEncuentro: "Parque El Poblado, frente a McDonald's",
      cuposDisponibles: 3,
    },
    {
      id: '4',
      conductor: {
        nombre: 'Camila Ospina',
        avatar: 'CO',
        calificacion: 4.9,
        resenas: 22,
        vehiculo: 'Kia Picanto • Blanco',
      },
      origen: 'UPB Medellín',
      destino: 'El Poblado',
      horaSalida: '12:15 PM',
      fecha: 'Hoy',
      puntoEncuentro: 'Portería Circular 1 (UPB)',
      cuposDisponibles: 1,
    },
    {
      id: '5',
      conductor: {
        nombre: 'Santiago Gómez',
        avatar: 'SG',
        calificacion: 4.7,
        resenas: 18,
        vehiculo: 'Renault Logan • Negro',
      },
      origen: 'UPB Medellín',
      destino: 'El Poblado',
      horaSalida: '4:30 PM',
      fecha: 'Hoy',
      puntoEncuentro: 'Portería Nutibara (UPB)',
      cuposDisponibles: 4,
    },
    {
      id: '6',
      conductor: {
        nombre: 'Daniela Calle',
        avatar: 'DC',
        calificacion: 4.9,
        resenas: 40,
        vehiculo: 'Nissan March • Rojo',
      },
      origen: 'Sabaneta',
      destino: 'UPB Medellín',
      horaSalida: '6:15 AM',
      fecha: 'Hoy',
      puntoEncuentro: 'Parque de Sabaneta',
      cuposDisponibles: 2,
    },
  ]);

  // Filtrado de viajes que coincidan estrictamente con el origen y destino seleccionados
  const viajesFiltrados = todosLosViajes.filter(
    (viaje) =>
      viaje.origen.toLowerCase() === origen.toLowerCase() &&
      viaje.destino.toLowerCase() === destino.toLowerCase()
  );

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