import React, { useState } from 'react';
import './DetalleViaje.css';
import { obtenerViajesActualizados, realizarReserva, estaReservadoPorUsuario, Reserva } from '../data/viajesData';

interface DetalleViajeProps {
  tripId?: string | null;
  onNavigate?: (view: string) => void;
  onReservaExitosa?: (reserva: Reserva) => void;
}

export const DetalleViaje: React.FC<DetalleViajeProps> = ({ tripId, onNavigate, onReservaExitosa }) => {
  
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Buscar el viaje según el id recibido
  // Obtener los viajes actualizados desde el localStorage para incluir los publicados
  const todosLosViajes = obtenerViajesActualizados();
  const viaje = todosLosViajes.find((v) => String(v.id) === String(tripId));
  const yaReservado = tripId ? estaReservadoPorUsuario(tripId) : false;


  // Manejo de error si el viaje no existe (Criterio HU-09)
  if (!viaje) {
    return (
      <div className="resultados-container" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <button 
          className="btn-back" 
          onClick={() => onNavigate && onNavigate('resultados')}
          type="button"
          style={{ float: 'left' }}
        >
          &#8249;
        </button>
        <h2 style={{ marginTop: '20px', color: '#1e293b' }}>Viaje no encontrado</h2>
        <p style={{ color: '#64748b' }}>El viaje que intentas consultar no existe o fue despublicado.</p>
        <button 
          className="btn-ver-detalle" 
          style={{ marginTop: '20px', width: 'auto', padding: '10px 20px' }}
          onClick={() => onNavigate && onNavigate('resultados')}
        >
          Volver a resultados
        </button>
      </div>
    );
  }

  const handleReservar = () => {
    setErrorMsg(null);
    setCargando(true);

    // Simular pequeña latencia de servidor
    setTimeout(() => {
      const resultado = realizarReserva(viaje.id);
      setCargando(false);

      if (resultado.exito && resultado.reserva) {
        // --- SINCRONIZACIÓN DE CUPOS PARA EL CONDUCTOR (HU-17) ---
        try {
          // Identificar al conductor del viaje de forma segura con tipado flexible
          const viajeAny = viaje as any;
          const conductorEmail = viajeAny.conductor?.email || viajeAny.conductorEmail || viajeAny.conductor?.nombre || 'conductor_general';
          const storageKey = `mis_viajes_publicados_${conductorEmail}`;
          
          // Obtener los viajes publicados de ese conductor
          let viajesPublicados = JSON.parse(localStorage.getItem(storageKey) || '[]');
          
          // Descontar 1 cupo al viaje correspondiente
          viajesPublicados = viajesPublicados.map((pub: any) => {
            if (String(pub.id) === String(viaje.id)) {
              const cuposActuales = Number(pub.cuposDisponibles) ?? 1;
              return {
                ...pub,
                cuposDisponibles: Math.max(0, cuposActuales - 1)
              };
            }
            return pub;
          });

          // Guardar de nuevo la lista actualizada en el storage del conductor
          localStorage.setItem(storageKey, JSON.stringify(viajesPublicados));
        } catch (err) {
          console.error("Error al sincronizar cupos del conductor:", err);
        }
        // ---------------------------------------------------------

        if (onReservaExitosa) {
          onReservaExitosa(resultado.reserva);
        }
      } else {
        setErrorMsg(resultado.mensaje);
      }
    }, 600);
  };

  return (
    <div className="resultados-container">
      {/* Header con botón atrás */}
      <div className="resultados-header">
        <button 
          className="btn-back" 
          onClick={() => onNavigate && onNavigate('resultados')}
          type="button"
        >
          &#8249;
        </button>
        <h1 className="resultados-main-title">Detalle del viaje</h1>
      </div>

      <div className="detalle-content">
        {/* Tarjeta del Conductor */}
        <div className="card-conductor-detalle">
          <div className="conductor-header-row">
            <div className="avatar-circle">{viaje.conductor.avatar}</div>
            
            <div className="conductor-main-info">
              <div className="nombre-verificado-row">
                <h2 className="conductor-nombre">{viaje.conductor.nombre || 'Conductor UPB'}</h2>
                {viaje.conductor.verificado && (
                  <span className="badge-verificado">Verificado</span>
                )}
              </div>
              <p className="conductor-carrera">
                {viaje.conductor.carrera} • {viaje.conductor.semestre}
              </p>
              <div className="rating-row">
                ⭐ <strong style={{ color: '#1e293b' }}>{viaje.conductor.calificacion}</strong> 
                <span className="resenas-text">({viaje.conductor.resenas} reseñas)</span>
              </div>
            </div>
          </div>

          <hr className="divider-line" />

          <div className="vehiculo-info">
            <span className="vehiculo-label">Vehículo</span>
            <p className="vehiculo-texto">
              🚘 {viaje.conductor.vehiculo}
            </p>
          </div>

          <div className="telefono-info" style={{ marginTop: '8px' }}>
            <span className="vehiculo-label">Contacto</span>
            <p className="vehiculo-texto">
              📞 {viaje.conductor.telefono}
            </p>
          </div>
        </div>

        {/* Tarjeta de Información del Viaje */}
        <div className="card-info-viaje">
          <h3 className="section-title">Información del viaje</h3>
          
          <div className="timeline-container">
            {/* Punto Origen */}
            <div className="timeline-item">
              <div className="dot-circle origen-dot"></div>
              <div className="timeline-textos">
                <span className="sub-label">Origen • {viaje.horaSalida}</span>
                <p className="lugar-nombre">{viaje.origen}</p>
              </div>
            </div>

            {/* Línea punteada conectora */}
            <div className="timeline-line"></div>

            {/* Punto Destino */}
            <div className="timeline-item">
              <div className="dot-circle destino-dot"></div>
              <div className="timeline-textos">
                <span className="sub-label">Destino</span>
                <p className="lugar-nombre">{viaje.destino}</p>
              </div>
            </div>
          </div>

          <div className="encuentro-box" style={{ marginTop: '16px', padding: '10px 12px', background: '#f1f5f9', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Punto de encuentro:</span>
            <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>
              📍 {viaje.puntoEncuentro}
            </p>
          </div>
        </div>

        {/* Botón de Reservar Cupo */}
        <button 
          className="btn-reservar-cupo" 
          type="button"
          onClick={handleReservar}
          disabled={cargando || yaReservado || viaje.cuposDisponibles <= 0}
          style={{
            backgroundColor: yaReservado ? '#64748b' : (viaje.cuposDisponibles <= 0 ? '#cbd5e1' : '#15803d'),
            cursor: (cargando || yaReservado || viaje.cuposDisponibles <= 0) ? 'not-allowed' : 'pointer',
            opacity: cargando ? 0.7 : 1
          }}
        >
          {cargando 
            ? 'Procesando reserva...' 
            : yaReservado 
              ? '✓ Ya tienes este viaje reservado' 
              : viaje.cuposDisponibles <= 0 
                ? 'Sin cupos disponibles' 
                : '✓ Reservar cupo'}
        </button>
      </div>

      {/* Navbar Inferior */}
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

export default DetalleViaje;