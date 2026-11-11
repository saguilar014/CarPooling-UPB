import React, { useState, useEffect } from 'react';
import './PublicarViaje.css';
import Swal from 'sweetalert2';

interface PublicarViajeProps {
  onNavigate?: (view: string) => void;
}

export const PublicarViaje: React.FC<PublicarViajeProps> = ({ onNavigate }) => {
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('UPB Medellín (Campus principal)');
  const [fecha, setFecha] = useState('');
  const [horaSalida, setHoraSalida] = useState('');
  const [puntoEncuentro, setPuntoEncuentro] = useState('');
  const [cuposDisponibles, setCuposDisponibles] = useState<number>(3);
  const [notas, setNotas] = useState('');
  const [userRole, setUserRole] = useState<string>('pasajero');

  // Obtener rol del usuario para validar navegación en la navbar inferior
  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.user?.roles || 'pasajero');
        }
      } catch (err) {
        console.error('Error al obtener el rol:', err);
      }
    };
    fetchUserRole();
  }, []);

  // Función para restringir la búsqueda en la navbar si es solo conductor
  const handleIntentarBuscarNav = () => {
    if (userRole.toLowerCase() === 'conductor') {
      Swal.fire({
        icon: 'warning',
        title: 'Acceso restringido',
        text: 'Necesitas estar registrado como pasajero para acceder a esta función.',
        confirmButtonColor: '#123B63',
        confirmButtonText: 'Entendido'
      });
      return;
    }
    onNavigate?.('buscar');
  };

  // Validaciones según criterios de aceptación de HU-12
  const handlePublicar = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validar campos requeridos
    if (!origen || !destino || !fecha || !horaSalida || !puntoEncuentro) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los datos obligatorios de la ruta.',
        confirmButtonColor: '#123B63'
      });
      return;
    }

    // 2. Validar que la fecha no sea pasada
    const fechaSeleccionada = new Date(`${fecha}T${horaSalida || '00:00'}`);
    const ahora = new Date();
    if (fechaSeleccionada < ahora) {
      Swal.fire({
        icon: 'error',
        title: 'Fecha u hora inválida',
        text: 'No puedes publicar un viaje con una fecha u hora de salida pasada.',
        confirmButtonColor: '#123B63'
      });
      return;
    }

    // 3. Validar cupos positivos y no decimales
    if (cuposDisponibles <= 0 || !Number.isInteger(cuposDisponibles)) {
      Swal.fire({
        icon: 'error',
        title: 'Cupos inválidos',
        text: 'Los cupos disponibles deben ser un número entero mayor a cero.',
        confirmButtonColor: '#123B63'
      });
      return;
    }

    // Alerta temporal para el botón (diseño no funcional aún)
    Swal.fire({
      icon: 'info',
      title: 'Borrador / Publicación',
      text: 'Diseño completado. La persistencia se habilitará en la siguiente fase.',
      confirmButtonColor: '#123B63'
    });
  };

  return (
    <div className="resultados-container" style={{ overflow: 'hidden' }}>
      <div className="resultados-header">
        <button 
          className="btn-back" 
          onClick={() => onNavigate && onNavigate('dashboard')}
          type="button"
        >
          &#8249;
        </button>
        <h1 className="resultados-main-title">Publicar viaje</h1>
      </div>

      <div className="publicar-form-content">
        <form onSubmit={handlePublicar}>
          {/* Tarjeta Formulario de Ruta */}
          <div className="card-publicar-form">
            <h3 className="section-form-title">Ruta del viaje</h3>

            {/* Selector de Ruta con Conector Visual */}
            <div className="route-select-group">
              <div className="route-indicators">
                <div className="dot-circle origen-dot"></div>
                <div className="vertical-connector"></div>
                <div className="dot-circle destino-dot"></div>
              </div>

              <div className="route-inputs">
                <select 
                  className="input-select-form"
                  value={origen}
                  onChange={(e) => setOrigen(e.target.value)}
                >
                  <option value="" disabled>Punto de origen</option>
                  <option value="Laureles">Laureles</option>
                  <option value="Bello">Bello</option>
                  <option value="El Poblado">El Poblado</option>
                  <option value="Envigado">Envigado</option>
                  <option value="Sabaneta">Sabaneta</option>
                  <option value="Robledo">Robledo</option>
                  <option value="UPB Medellín (Campus principal)">UPB Medellín (Campus principal)</option>
                </select>

                <select 
                  className="input-select-form"
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                >
                  <option value="UPB Medellín (Campus principal)">UPB Medellín (Campus principal)</option>
                  <option value="Laureles">Laureles</option>
                  <option value="El Poblado">El Poblado</option>
                  <option value="Bello">Bello</option>
                  <option value="Envigado">Envigado</option>
                </select>
              </div>
            </div>

            {/* Fecha y Hora de salida en grid de 2 columnas */}
            <div className="form-row-2">
              <div className="form-group-item">
                <label className="form-label">Fecha</label>
                <input 
                  type="date" 
                  className="input-date-form"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>

              <div className="form-group-item">
                <label className="form-label">Hora de salida</label>
                <input 
                  type="time" 
                  className="input-time-form"
                  value={horaSalida}
                  onChange={(e) => setHoraSalida(e.target.value)}
                />
              </div>
            </div>

            {/* Punto de encuentro */}
            <div className="form-group-item" style={{ marginTop: '14px' }}>
              <label className="form-label">Punto de encuentro</label>
              <div className="input-with-icon">
                <span className="input-icon">📍</span>
                <input 
                  type="text" 
                  className="input-text-form"
                  placeholder="Ej: Portería principal UPB, frente al bloque 10"
                  value={puntoEncuentro}
                  onChange={(e) => setPuntoEncuentro(e.target.value)}
                />
              </div>
            </div>

            {/* Selector de Cupos */}
            <div className="form-group-item" style={{ marginTop: '14px' }}>
              <label className="form-label">Cupos disponibles</label>
              <div className="cupos-selector-grid">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    type="button"
                    key={num}
                    className={`cupo-btn ${cuposDisponibles === num ? 'selected' : ''}`}
                    onClick={() => setCuposDisponibles(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Notas Adicionales */}
            <div className="form-group-item" style={{ marginTop: '14px' }}>
              <label className="form-label">
                Notas adicionales <span className="optional-text">(opcional)</span>
              </label>
              <textarea 
                className="textarea-form"
                rows={3}
                placeholder="Ej: Solo llevo estudiantes de ingeniería, puedo esperar hasta 5 min"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
              />
            </div>
          </div>

          {/* Botón Verde de Publicar Viaje */}
          <button type="submit" className="btn-publicar-verde">
            Publicar Viaje
          </button>
        </form>
      </div>

      {/* Navbar Inferior */}
      <nav className="bottom-navbar">
        <button className="nav-item" onClick={() => onNavigate?.('dashboard')}>
          <span className="nav-icon">🏠</span>
          <span>Inicio</span>
        </button>
        <button className="nav-item" onClick={handleIntentarBuscarNav}>
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

export default PublicarViaje;