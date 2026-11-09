import React, { useState } from 'react';
import Swal from 'sweetalert2';

interface LoginFormProps {
  onLoginSuccess: () => void;
  onBackToWelcome?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onBackToWelcome }) => {
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Criterio de aceptación 3: Impedir envío si hay campos vacíos
    if (!formData.correo || !formData.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor diligencia todos los campos.',
        confirmButtonColor: '#123B63'
      });
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Credenciales incorrectas');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user.nombreCompleto);

      // Criterio de aceptación 1: Credenciales correctas -> Alerta y redirección
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido de nuevo!',
        text: 'Inicio de sesión exitoso.',
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#123B63',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          onLoginSuccess();
        }
      });

    } catch (err: any) {
      // Criterio de aceptación 2: Credenciales incorrectas -> Mensaje de error
      Swal.fire({
        icon: 'error',
        title: 'Error de acceso',
        text: err.message || 'Correo o contraseña incorrectos.',
        confirmButtonColor: '#123B63'
      });
    }
  };

  return (
    <div className="register-card">
      <h2 className="register-title">Iniciar sesión</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Correo UPB</label>
          <input
            type="email"
            name="correo"
            placeholder="nombre@upb.edu.co"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="Ingresa tu contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">Ingresar</button>

        {onBackToWelcome && (
          <p className="terms-text" style={{ textAlign: 'center', marginTop: '10px' }}>
            ¿No tienes cuenta?{' '}
            <span className="link" onClick={onBackToWelcome}>
              Regístrate aquí
            </span>
          </p>
        )}
      </form>
    </div>
  );
};