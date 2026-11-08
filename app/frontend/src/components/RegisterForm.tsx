import React, { useState } from 'react';
import './RegisterForm.css';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    correo: '',
    password: '',
    confirmPassword: ''
  });

  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeError(null);

    if (!formData.correo.endsWith('@upb.edu.co')) {
      setMensajeError('Debe ingresar un correo institucional válido (@upb.edu.co)');
      return;
    }

    if (formData.password.length < 8) {
      setMensajeError('La contraseña debe tener mínimo 8 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMensajeError('Las contraseñas no coinciden');
      return;
    }

    console.log('Enviando registro:', formData);
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
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
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
      </form>
    </div>
  );
};