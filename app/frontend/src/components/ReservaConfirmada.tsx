import React from 'react';
import './ReservaConfirmada.css';
import { Reserva } from '../data/viajesData';

interface ReservaConfirmadaProps {
  reserva?: Reserva | null;
  onNavigate?: (view: string) => void;
}

export const ReservaConfirmada: React.FC<ReservaConfirmadaProps> = ({ reserva, onNavigate }) => {
  if (!reserva) {
    return (
      <div className="resultados-container" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h2>No hay detalles de reserva</h2>
        <button 
          className="btn-ver-detalle" 
          onClick={() => onNavigate && onNavigate('dashboard')}
          style={{ marginTop: '20px' }}
        >
          Ir al Inicio
        </button>
      </div>
    );
  }

  const { viaje } = reserva;

  return (
    <div className="resultados-container">
      {/* Header superior de marca UPB */}
      <div className="top-brand-bar">
        <div className="brand-title-rc">
          <span className="car-icon">🚗</span> CarPooling <strong>UPB</strong>
        </div>
      </div>

      <div className="reserva-confirmada-content">
        {/* Banner Verde de Confirmación */}
        <div className="banner-exito">
          <div className="check-circle">
            <span>✓</span>
          </div>
          <h2>¡Reserva confirmada!</h2>
          <p>Tu cupo está asegurado</p>
        </div>

        {/* Tarjeta de Resumen del viaje */}
        <div className="card-resumen-confirmacion">
          <div className="card-resumen-header">
            <h3>Resumen del viaje</h3>
            <span className="badge-confirmado">Confirmado</span>
          </div>

          <div className="resumen-row">
            <span className="row-label">Ruta</span>
            <span className="row-value bold-text">{viaje.origen} → {viaje.destino}</span>
          </div>

          <div className="resumen-row">
            <span className="row-label">Fecha</span>
            <span className="row-value bold-text">
              {reserva.fechaReserva || 'Martes 20 de mayo, 2025'}
            </span>
          </div>

          <div className="resumen-row">
            <span className="row-label">Hora de salida</span>
            <span className="row-value bold-text">{viaje.horaSalida}</span>
          </div>

          <div className="resumen-row">
            <span className="row-label">Punto de encuentro</span>
            <span className="row-value bold-text">{viaje.puntoEncuentro}</span>
          </div>

          <div className="resumen-row">
            <span className="row-label">Cupos</span>
            <span className="row-value bold-text">1 reservado</span>
          </div>
        </div>
      </div>

      {/* Navbar Inferior */}
      <nav className="bottom-navbar">
        <button className="nav-item" onClick={() => onNavigate?.('dashboard')}>
          <span className="nav-icon">🏠</span>
          <span>Inicio</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate?.('buscar')}>
          <span className="nav-icon">🔍</span>
          <span>Buscar</span>
        </button>
        <button className="nav-item active" onClick={() => onNavigate?.('mis-viajes')}>
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

export default ReservaConfirmada;