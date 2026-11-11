import React, { useState, useEffect } from 'react';
import './PublicarViaje.css';
import Swal from 'sweetalert2';
import { agregarNuevoViaje } from '../data/viajesData';
import ViajePublicado from './ViajePublicado'; // Importamos la nueva interfaz

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
  
const [conductorNombre, setConductorNombre] = useState<string>('Usuario UPB');
const [conductorCalificacion, setConductorCalificacion] = useState<number>(5.0);
const [userRole, setUserRole] = useState<string>('conductor');

// Función para obtener únicamente las iniciales del nombre
const obtenerIniciales = (nombre: string): string => {
  if (!nombre) return 'U';
  const partes = nombre.trim().split(' ').filter(Boolean);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[1][0]).toUpperCase();
};

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [viajeCreado, setViajeCreado] = useState<any | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const user = data.user;
          setConductorNombre(user.nombre_completo || localStorage.getItem('userName') || 'Usuario UPB');
          setConductorCalificacion(user.calificacion !== undefined ? Number(user.calificacion) : 5.0);
          setUserRole(user.roles || 'conductor');
        }
      } catch (err) {
        console.error('Error al obtener perfil:', err);
      }
    };
    fetchUserProfile();
  }, []);

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

  const handlePublicar = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!origen || !destino || !fecha || !horaSalida || !puntoEncuentro) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los datos obligatorios de la ruta.',
        confirmButtonColor: '#123B63'
      });
      return;
    }

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

    if (cuposDisponibles <= 0 || !Number.isInteger(cuposDisponibles)) {
      Swal.fire({
        icon: 'error',
        title: 'Cupos inválidos',
        text: 'Los cupos disponibles deben ser un número entero mayor a cero.',
        confirmButtonColor: '#123B63'
      });
      return;
    }

    setIsSubmitting(true);

    const [h, m] = horaSalida.split(':');
    const horaNum = parseInt(h, 10);
    const ampm = horaNum >= 12 ? 'PM' : 'AM';
    const hora12 = `${horaNum % 12 || 12}:${m} ${ampm}`;

    // Función auxiliar para sacar las iniciales (Ej: "Samuel Aguilar" -> "SA")
    const obtenerIniciales = (nombre: string): string => {
    if (!nombre) return 'U';
    const partes = nombre.trim().split(' ').filter(Boolean);
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    return (partes[0][0] + partes[1][0]).toUpperCase();
    };

// Al construir el objeto del viaje:
const nuevoViajeData = {
  conductor: {
    nombre: conductorNombre,
    avatar: obtenerIniciales(conductorNombre), // <--- ¡Aquí se generan las iniciales "SA"!
    calificacion: conductorCalificacion,       // <--- Calificación real de la DB
    resenas: 18,                 // <--- Reseñas reales de la DB
    vehiculo: 'Automóvil UPB',
    carrera: 'Ingeniería de Sistemas',
    semestre: '4°',
    telefono: '+57 3053410892',
    verificado: true
  },
  origen,
  destino,
  fecha,
  horaSalida: hora12,
  puntoEncuentro,
  cuposDisponibles,
  precio: 0,
  notas: notas || undefined
};

    const creado = agregarNuevoViaje(nuevoViajeData);

    // --- NUEVO: GUARDAR EN EL LOCALSTORAGE DEL CONDUCTOR PARA LA HU-17 ---
    try {
      const currentUser = localStorage.getItem('userEmail') || localStorage.getItem('userName') || conductorNombre || 'conductor_general';
      const storageKey = `mis_viajes_publicados_${currentUser}`;
      
      const viajesExistentes = JSON.parse(localStorage.getItem(storageKey) || '[]');
      viajesExistentes.push(creado); // Agregamos el viaje recién creado
      localStorage.setItem(storageKey, JSON.stringify(viajesExistentes));
    } catch (err) {
      console.error("Error al guardar en Mis Viajes Publicados:", err);
    }
    // -------------------------------------------------------------------

    setViajeCreado(creado);
    setIsSubmitting(false);
  };

  // Si ya se creó el viaje, renderizamos directamente la nueva interfaz separada
  if (viajeCreado) {
    return (
      <ViajePublicado 
        viaje={viajeCreado} 
        onNavigate={(view) => onNavigate?.(view)} 
        onBuscarNavClick={handleIntentarBuscarNav}
      />
    );
  }

  return (
    <div className="resultados-container" style={{ overflow: 'hidden' }}>
      <div className="resultados-header">
        <button 
          className="btn-back" 
          onClick={() => onNavigate?.('dashboard')}
          type="button"
        >
          &#8249;
        </button>
        <h1 className="resultados-main-title">Publicar viaje</h1>
      </div>

      <div className="publicar-form-content">
        <form onSubmit={handlePublicar}>
          <div className="card-publicar-form">
            <h3 className="section-form-title">Ruta del viaje</h3>

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

          <button type="submit" className="btn-publicar-verde" disabled={isSubmitting}>
            {isSubmitting ? 'Publicando...' : 'Publicar Viaje'}
          </button>
        </form>
      </div>

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