import React, { useState } from 'react';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    correo: '',
    rol: 'Pasajero', // Valor por defecto
    password: '',
    confirmPassword: ''
  });

  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeError(null);

    // Validaciones del Frontend
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

    // Envío de datos al Backend
    console.log('Enviando registro:', formData);
  };

  return (
    <div className="register-container">
      <h2>Crear cuenta</h2>
      {mensajeError && <p className="error-alert">{mensajeError}</p>}
      
      <form onSubmit={handleSubmit}>
        <label>Nombre completo</label>
        <input 
          type="text" 
          placeholder="Juan García Pérez"
          value={formData.nombreCompleto}
          onChange={(e) => setFormData({...formData, nombreCompleto: e.target.value})}
          required 
        />

        <label>Correo UPB</label>
        <input 
          type="email" 
          placeholder="nombre@upb.edu.co"
          value={formData.correo}
          onChange={(e) => setFormData({...formData, correo: e.target.value})}
          required 
        />

        <label>Quiero registrarme como</label>
        <select 
          value={formData.rol}
          onChange={(e) => setFormData({...formData, rol: e.target.value})}
        >
          <option value="Pasajero">Pasajero</option>
          <option value="Conductor">Conductor</option>
        </select>

        <label>Contraseña</label>
        <input 
          type="password" 
          placeholder="Mínimo 8 caracteres"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required 
        />

        <label>Confirmar contraseña</label>
        <input 
          type="password" 
          placeholder="Repite tu contraseña"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          required 
        />

        <button type="submit">Crear cuenta</button>
      </form>
    </div>
  );
};
