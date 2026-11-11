import React from 'react';
import './PublicarViaje.css';

interface ViajePublicadoProps {
  viaje: {
    origen: string;
    destino: string;
    fecha: string;
    horaSalida: string;
    puntoEncuentro: string;
    cuposDisponibles: number;
    notas?: string;
  };
  onNavigate: (view: string) => void;
  onBuscarNavClick: () => void;
}

export const ViajePublicado: React.FC<ViajePublicadoProps> = ({ viaje, onNavigate, onBuscarNavClick }) => {
  return (
    <div className="resultados-container">
      {/* Header Superior */}
      <div className="resultados-header">
        <button 
          className="btn-back" 
          onClick={() => onNavigate('dashboard')}
          type="button"
        >
          &#8249;
        </button>
        <h1 className="resultados-main-title">Publicación exitosa</h1>
      </div>

      <div className="publicar-form-content" style={{ marginTop: '10px' }}>
        {/* Banner Verde de Confirmación */}
        <div className="success-card-banner">
          <div className="success-check-circle">✓</div>
          <h2 className="success-title">¡Viaje publicado!</h2>
          <p className="success-subtitle">Tu viaje ya está disponible para los pasajeros</p>
        </div>

        {/* Tarjeta Resumen del Viaje */}
        <div className="card-publicar-form">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="section-form-title" style={{ margin: 0 }}>Resumen del viaje</h3>
            <span className="badge-status-confirmado">Publicado</span>
          </div>

          <div className="resumen-detail-row">
            <span className="resumen-label">Ruta</span>
            <span className="resumen-value">{viaje.origen} → {viaje.destino}</span>
          </div>

          <div className="resumen-detail-row">
            <span className="resumen-label">Fecha</span>
            <span className="resumen-value">{viaje.fecha}</span>
          </div>

          <div className="resumen-detail-row">
            <span className="resumen-label">Hora de salida</span>
            <span className="resumen-value">{viaje.horaSalida}</span>
          </div>

          <div className="resumen-detail-row">
            <span className="resumen-label">Punto de encuentro</span>
            <span className="resumen-value">{viaje.puntoEncuentro}</span>
          </div>

          <div className="resumen-detail-row">
            <span className="resumen-label">Cupos</span>
            <span className="resumen-value">{viaje.cuposDisponibles} ofertados</span>
          </div>

          {viaje.notas && (
            <div className="resumen-detail-row" style={{ borderBottom: 'none' }}>
              <span className="resumen-label">Notas</span>
              <span className="resumen-value">{viaje.notas}</span>
            </div>
          )}
        </div>

        <button 
          type="button" 
          className="btn-publicar-verde"
          onClick={() => onNavigate('dashboard')}
        >
          Volver al inicio
        </button>
      </div>

      {/* Navbar Inferior */}
      <nav className="bottom-navbar">
        <button className="nav-item" onClick={() => onNavigate('dashboard')}>
          <span className="nav-icon">🏠</span>
          <span>Inicio</span>
        </button>
        <button className="nav-item" onClick={onBuscarNavClick}>
          <span className="nav-icon">🔍</span>
          <span>Buscar</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate('mis-viajes')}>
          <span className="nav-icon">📅</span>
          <span>Mis viajes</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate('perfil')}>
          <span className="nav-icon">👤</span>
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default ViajePublicado;