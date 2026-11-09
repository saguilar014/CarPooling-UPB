import React, { useEffect, useState } from 'react';
import './Perfil.css';

interface UserProfile {
  nombreCompleto?: string;
  nombre_completo?: string;
  correo?: string;
  viajes_realizados?: number;
  roles?: 'pasajero' | 'conductor' | 'ambos';
  telefono?: string;
  programa?: string;
  semestre?: string | number;
  calificacion?: number;
}

interface PerfilProps {
  onNavigate?: (view: any) => void;
}

export default function Perfil({ onNavigate }: PerfilProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<'pasajero' | 'conductor' | 'ambos'>('pasajero');
  const [telefono, setTelefono] = useState<string>('');
  const [programa, setPrograma] = useState<string>('');
  const [semestre, setSemestre] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        const response = await fetch('/api/users/me', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        let resData;
        if (!response.ok) {
          const fallbackRes = await fetch('/api/users/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!fallbackRes.ok) throw new Error('No se pudo cargar la información del perfil');
          resData = await fallbackRes.json();
        } else {
          resData = await response.json();
        }

        const userData = resData.user || resData;

        if (isMounted) {
          setUser(userData);
          setSelectedRole(userData.roles || 'pasajero');
          setTelefono(userData.telefono || '');
          setPrograma(userData.programa || '');
          setSemestre(userData.semestre ? String(userData.semestre) : '');
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Error de conexión');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/me/roles', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          roles: selectedRole,
          telefono,
          programa,
          semestre
        })
      });

      if (!response.ok) throw new Error('No se pudo guardar la información');

      const data = await response.json();
      const updated = data.user || data;
      setUser(updated);
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || 'Error al actualizar');
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'UP';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const formatRoleText = (role?: string) => {
    if (role === 'conductor') return 'Conductor';
    if (role === 'pasajero') return 'Pasajero';
    if (role === 'ambos') return 'Conductor y Pasajero';
    return 'Pasajero';
  };

  const fullName = user?.nombreCompleto || user?.nombre_completo || 'Usuario UPB';

  return (
    <div className="dashboard-container" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div className="perfil-container" style={{ paddingBottom: '20px', flex: 1 }}>
        <div className="perfil-header">
          <h1 className="perfil-title">Mi perfil</h1>
          <button 
            className="btn-editar" 
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? 'Guardar' : '✏️ Editar'}
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e3a8a' }}>Cargando perfil...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#ef4444', marginBottom: '15px' }}>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{ padding: '10px 20px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              Reintentar
            </button>
          </div>
        ) : (
          <>
            <div className="card-main">
              <div className="avatar-circle">
                {getInitials(fullName)}
              </div>
              <h2 className="user-name">{fullName}</h2>
              <p className="user-email">{user?.correo || 'correo@upb.edu.co'}</p>

              {isEditing ? (
                <div style={{ width: '100%', marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Selecciona tu rol:</label>
                  <select 
                    className="select-role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as any)}
                  >
                    <option value="pasajero">Pasajero</option>
                    <option value="conductor">Conductor</option>
                    <option value="ambos">Conductor y Pasajero</option>
                  </select>
                </div>
              ) : (
                <div className="role-badge">
                  {formatRoleText(user?.roles)}
                </div>
              )}

              <div className="rating-container">
                ★ {user?.calificacion ? Number(user.calificacion).toFixed(1) : '5.0'} 
                <span className="rating-text">
                    ({user?.viajes_realizados ?? 0} {user?.viajes_realizados === 1 ? 'reseña' : 'reseñas'})
                </span>
              </div>
            </div>

            <div className="card-info">
              <div className="info-title">INFORMACIÓN PERSONAL</div>

              <div className="info-row">
                <span className="info-label">Teléfono</span>
                {isEditing ? (
                  <input 
                    className="input-field" 
                    value={telefono} 
                    onChange={(e) => setTelefono(e.target.value)} 
                    placeholder="Ej: 310 234 5678"
                  />
                ) : (
                  <span className="info-value">{user?.telefono || 'No registrado'}</span>
                )}
              </div>

              <div className="info-row">
                <span className="info-label">Programa</span>
                {isEditing ? (
                  <input 
                    className="input-field" 
                    value={programa} 
                    onChange={(e) => setPrograma(e.target.value)} 
                    placeholder="Ej: Ingeniería de Sistemas"
                  />
                ) : (
                  <span className="info-value">{user?.programa || 'No registrado'}</span>
                )}
              </div>

              <div className="info-row">
                <span className="info-label">Semestre</span>
                {isEditing ? (
                  <input 
                    className="input-field" 
                    value={semestre} 
                    onChange={(e) => setSemestre(e.target.value)} 
                    placeholder="Ej: 7"
                  />
                ) : (
                  <span className="info-value">{user?.semestre ? `${user.semestre}°` : 'No registrado'}</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 6. Navigation Bar Inferior Copiada Exactamente de HomeDashboard */}
      <nav className="bottom-navbar">
        <button className="nav-item" onClick={() => onNavigate && onNavigate('dashboard')}>
          <span className="nav-icon">🏠</span>
          <span>Inicio</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate && onNavigate('buscar')}>
          <span className="nav-icon">🔍</span>
          <span>Buscar</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate && onNavigate('mis-viajes')}>
          <span className="nav-icon">📅</span>
          <span>Mis viajes</span>
        </button>
        <button className="nav-item active" onClick={() => onNavigate && onNavigate('perfil')}>
          <span className="nav-icon">👤</span>
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
}