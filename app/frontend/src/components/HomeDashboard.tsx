import React from 'react';
import { useEffect, useState } from 'react';

export type ActiveView = 'welcome' | 'register' | 'login' | 'dashboard' | 'buscar' | 'publicar' | 'mis-viajes' | 'perfil';

interface HomeDashboardProps {
  userName?: string;
  onNavigate: (view: ActiveView) => void;
}

interface UserProfileData {
  nombre_completo: string;
  viajes_realizados: number;
  km_compartidos: number;
  calificacion: number;
  rol_activo?: string;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate }) => {
  const userName = localStorage.getItem('userName') || 'Usuario UPB';
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

    // 1. Consultar datos reales de la API al montar el componente
  useEffect(() => {
    console.log("🚀 El useEffect del HomeDashboard se disparó");
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
        } else {
          console.error('No se pudo obtener el perfil');
        }
      } catch (error) {
        console.error('Error de conexión con el servidor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // 2. Valores por defecto mientras carga o si falla
  const displayName = userData?.nombre_completo || localStorage.getItem('userName') || 'Usuario UPB';
  const viajes = userData?.viajes_realizados ?? 0;
  const km = userData?.km_compartidos ?? 0;
  const rating = userData?.calificacion ?? 0.0;

  return (
    <div className="dashboard-container">

        <div className="dashboard-content-scroll">
            {/* 1. Header / Navbar Superior */}
            <header className="top-navbar">
                <div className="brand-logo">
                <span className="logo-icon">🚗</span>
                <h1>CarPooling <span>UPB</span></h1>
                </div>
                <button className="profile-avatar-btn" onClick={() => onNavigate('perfil')}>
                <div className="avatar-icon">👤</div>
                </button>
            </header>

            {/* 2. Saludo y Roles */}
            <section className="user-greeting-section">
                <div className="greeting-header">
                <div>
                    <span className="greeting-subtitle">Bienvenido de nuevo 👋</span>
                    <h2 className="user-name">{loading ? 'Cargando...' : displayName}</h2>
                </div>
                <div className="user-role-badge">
                    <span>Conductor · Pasajero</span>
                    <span className="rating-star">★ 4.8</span>
                </div>
                </div>
            </section>

            {/* 3. Grid de Tarjetas Principales */}
            <section className="main-actions-grid">
                <div className="action-card card-blue" onClick={() => onNavigate('buscar')}>
                <div className="card-icon">🔍</div>
                <h3>Buscar viaje</h3>
                <p>Encuentra un cupo disponible</p>
                </div>

                <div className="action-card card-green" onClick={() => onNavigate('publicar')}>
                <div className="card-icon">➕</div>
                <h3>Publicar viaje</h3>
                <p>Ofrece cupos en tu ruta</p>
                </div>

                <div className="action-card card-purple" onClick={() => onNavigate('mis-viajes')}>
                <div className="card-icon">📅</div>
                <h3>Mis viajes</h3>
                <p>Reservas y publicaciones</p>
                </div>

                <div className="action-card card-orange" onClick={() => onNavigate('perfil')}>
                <div className="card-icon">👤</div>
                <h3>Mi perfil</h3>
                <p>Datos y calificaciones</p>
                </div>
            </section>

            {/* 4. Métricas de Usuario */}
            <section className="user-stats-container">
                <div className="stat-box">
                <span className="stat-number">{loading ? '...' : viajes}</span>
                <span className="stat-label">Viajes realizados</span>
                </div>
                <div className="stat-box">
                <span className="stat-number">{loading ? '...' : km}</span>
                <span className="stat-label">Km compartidos</span>
                </div>
                <div className="stat-box">
                <span className="stat-number">{loading ? '...' : `${rating} ★`}</span>
                <span className="stat-label">Calificación</span>
                </div>
            </section>

            {/* 5. Viajes Recientes */}
            <section className="recent-trips-section">
                <div className="section-header">
                <h3>Viajes recientes</h3>
                <button className="link-btn">Ver todos</button>
                </div>
                <div className="trip-card-item">
                <div className="trip-info">
                    <span className="trip-route">Laureles ➔ UPB Medellín</span>
                    <span className="trip-time">Hoy 7:30 AM</span>
                </div>
                <span className="available-badge">2 cupos</span>
                </div>
            </section>
        </div>

      {/* 6. Navigation Bar Inferior */}
      <nav className="bottom-navbar">
        <button className="nav-item active" onClick={() => onNavigate('dashboard')}>
          <span className="nav-icon">🏠</span>
          <span>Inicio</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate('buscar')}>
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