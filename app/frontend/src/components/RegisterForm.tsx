import React, { useState } from 'react';
import './RegisterForm.css';
import Swal from 'sweetalert2'; // <--- Importar SweetAlert2

interface RegisterFormProps {
  onBackToWelcome: () => void; // <--- Prop para regresar al inicio
  onNavigateToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onBackToWelcome, onNavigateToLogin}) => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    correo: '',
    password: '',
    confirmPassword: ''
  });

  const [mensajeError, setMensajeError] = useState<string | null>(null);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeError(null);

    // Validación local de coincidencia de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setMensajeError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreCompleto: formData.nombreCompleto,
          correo: formData.correo,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensajeError(data.error || 'Error al intentar registrarse');
        return;
      }

      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Usuario creado correctamente.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#123B63',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          onBackToWelcome(); // <--- Redirecciona a la pantalla de inicio
        }
      });

    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message || 'Hubo un error al registrarse.',
        confirmButtonColor: '#123B63'
      });
    }
  };

  return (
    <div className="register-card">
      <h2 className="register-title">Crear cuenta</h2>
      {mensajeError && <div className="error-alert">{mensajeError}</div>}
      
      <form onSubmit={handleSubmit} className="register-form">
        <div className="input-group">
          <label>Nombre completo</label>
          <input 
            type="text" 
            placeholder="Juan García Pérez"
            value={formData.nombreCompleto}
            onChange={(e) => setFormData({...formData, nombreCompleto: e.target.value})}
            required 
          />
        </div>

        <div className="input-group">
          <label>Correo UPB</label>
          <input 
            type="email" 
            placeholder="nombre@upb.edu.co"
            value={formData.correo}
            onChange={(e) => setFormData({...formData, correo: e.target.value})}
            required 
          />
        </div>

        <div className="input-group">
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChange={handleChange}
            minLength={8} // <--- Fuerza al navegador a validar el mínimo
            required
          />
        </div>

        <div className="input-group">
          <label>Confirmar contraseña</label>
          <input 
            type="password" 
            placeholder="Repite tu contraseña"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required 
          />
        </div>

        <p className="terms-text">
          Al registrarte aceptas los <span className="link">términos de uso</span> de CarPooling UPB.
        </p>

        <button type="submit" className="submit-btn">Crear cuenta</button>

        <p className="terms-text" style={{ textAlign: 'center', marginTop: '15px' }}>
                  ¿Ya tienes una cuenta?{' '}
                  <span 
                    className="link" 
                    style={{ color: '#123B63', cursor: 'pointer', fontWeight: 'bold' }}
                    onClick={onNavigateToLogin}
                  >
                    Inicia sesión
          </span>
        </p>

      </form>
    </div>
  );
};