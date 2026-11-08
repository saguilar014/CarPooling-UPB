import React from 'react';
import './WelcomeView.css';

interface WelcomeViewProps {
  onNavigateToRegister: () => void;
  onNavigateToLogin: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onNavigateToRegister,
  onNavigateToLogin,
}) => {
  return (
    <div className="welcome-container">
      <div className="welcome-overlay">
        <header className="welcome-header">
          <h1 className="brand-title">CarPooling UPB</h1>
          <p className="brand-subtitle">
            Conecta con la comunidad universitaria, comparte viajes y muévete fácil.
          </p>
        </header>

        <div className="welcome-actions">
          <button className="btn-primary" onClick={onNavigateToLogin}>
            Iniciar sesión
          </button>

          <div className="register-prompt">
            <span>¿No tienes una cuenta?</span>
            <button className="btn-link" onClick={onNavigateToRegister}>
              Regístrate aquí
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};