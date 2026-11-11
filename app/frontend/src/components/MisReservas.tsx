import React, { useState, useEffect } from 'react';
import './MisReservas.css';
import { ActiveView } from './HomeDashboard';
import { obtenerReservasGuardadas, Reserva } from '../data/viajesData';

interface MisReservasProps {
  onNavigate?: (view: ActiveView) => void;
  onSelectTrip?: (tripId: string) => void;
}

export const MisReservas: React.FC<MisReservasProps> = ({ onNavigate, onSelectTrip }) => {
  const [tabActiva, setTabActiva] = useState<'reservas' | 'publicados'>('reservas');
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [viajesPublicados, setViajesPublicados] = useState<any[]>([]);

  useEffect(() => {
    // 1. Cargar reservas del pasajero desde localStorage
    const reservasGuardadas = obtenerReservasGuardadas();
    setReservas(reservasGuardadas);

    // 2. Cargar viajes publicados (si los guardas en localStorage o backend)
    const publicadosGuardados = JSON.parse(localStorage.getItem('mis_viajes_publicados') || '[]');
    setViajesPublicados(publicadosGuardados);
  }, []);

  return (
    <div className="resultados-container">
      {/* Cabecera */}
      <div className="resultados-header">
        <button 
          className="btn-back" 
          onClick={() => onNavigate && onNavigate('dashboard')}
          type="button"
        >
          &#8249;
        </button>
        <h1 className="resultados-main-title">Mis Viajes</h1>
      </div>

      {/* Pestañas de Intercambio (Tabs) */}
      <div className="tabs-container" style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: '#e2e8f0', padding: '4px', borderRadius: '12px' }}>
        <button
          type="button"
          onClick={() => setTabActiva('reservas')}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            background: tabActiva === 'reservas' ? '#ffffff' : 'transparent',
            color: tabActiva === 'reservas' ? '#1e3a8a' : '#64748b',
            boxShadow: tabActiva === 'reservas' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
          }}
        >
          🎫 Mis Reservas
        </button>
        <button
          type="button"
          onClick={() => setTabActiva('publicados')}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            background: tabActiva === 'publicados' ? '#ffffff' : 'transparent',
            color: tabActiva === 'publicados' ? '#1e3a8a' : '#64748b',
            boxShadow: tabActiva === 'publicados' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
          }}
        >
          🚗 Viajes Publicados
        </button>
      </div>

      {/* Contenido según la pestaña activa */}
      <div className="tarjetas-lista">
        {tabActiva === 'reservas' ? (
          /* --- VISTA DE RESERVAS --- */
          reservas.length === 0 ? (
            <div className="no-viajes-container" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>🎫</span>
              <h3 style={{ margin: '0 0 6px 0', color: '#1e293b', fontSize: '1.1rem' }}>No tienes viajes reservados</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Explora los viajes disponibles y reserva tu próximo trayecto.</p>
            </div>
          ) : (
            reservas.map((reserva) => (
              <div key={reserva.idReserva} className="trip-card">
                <div className="card-header-conductor">
                  <div className="conductor-info-left">
                    <div className="conductor-avatar">{reserva.viaje.conductor.avatar}</div>
                    <div className="conductor-textos">
                      <h3>{reserva.viaje.conductor.nombre}</h3>
                      <p>{reserva.viaje.conductor.vehiculo}</p>
                    </div>
                  </div>
                  <div className="badge-estado" style={{ background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {reserva.estado}
                  </div>
                </div>

                <div className="card-body-detalles">
                  <div className="horario-ruta">
                    <span className="hora-text">{reserva.viaje.horaSalida}</span>
                    <span className="ruta-trayecto">{reserva.viaje.origen} ➔ {reserva.viaje.destino}</span>
                  </div>
                  <div className="punto-encuentro">
                    <span className="pin-icon">📍</span> {reserva.viaje.puntoEncuentro}
                  </div>
                </div>

                <button 
                  className="btn-ver-detalle"
                  onClick={() => onSelectTrip && onSelectTrip(reserva.viaje.id)}
                >
                  Ver detalle
                </button>
              </div>
            ))
          )
        ) : (
          /* --- VISTA DE VIAJES PUBLICADOS --- */
          viajesPublicados.length === 0 ? (
            <div className="no-viajes-container" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>🚗</span>
              <h3 style={{ margin: '0 0 6px 0', color: '#1e293b', fontSize: '1.1rem' }}>No has publicado viajes</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Comparte tu ruta y publica asientos vacíos para otros pasajeros.</p>
            </div>
          ) : (
            viajesPublicados.map((pub, index) => (
              <div key={index} className="trip-card">
                <div className="card-header-conductor">
                  <div className="conductor-info-left">
                    <div className="conductor-avatar">UPB</div>
                    <div className="conductor-textos">
                      <h3>Mi publicación</h3>
                      <p>{pub.cuposDisponibles || 'N/A'} cupos disponibles</p>
                    </div>
                  </div>
                  <div className="badge-estado" style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                    Activo
                  </div>
                </div>

                <div className="card-body-detalles">
                  <div className="horario-ruta">
                    <span className="hora-text">{pub.horaSalida || 'Hora por definir'}</span>
                    <span className="ruta-trayecto">{pub.origen} ➔ {pub.destino}</span>
                  </div>
                  <div className="punto-encuentro">
                    <span className="pin-icon">📍</span> {pub.puntoEncuentro || 'Punto acordado'}
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>

      {/* Navbar Inferior */}
      <nav className="bottom-navbar">
        <button className="nav-item" onClick={() => onNavigate?.('dashboard')} type="button">
          <span className="nav-icon">🏠</span>
          <span>Inicio</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate?.('buscar')} type="button">
          <span className="nav-icon">🔍</span>
          <span>Buscar</span>
        </button>
        <button className="nav-item active" onClick={() => onNavigate?.('mis-viajes')} type="button">
          <span className="nav-icon">📅</span>
          <span>Mis viajes</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate?.('perfil')} type="button">
          <span className="nav-icon">👤</span>
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default MisReservas;