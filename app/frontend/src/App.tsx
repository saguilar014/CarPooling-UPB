import { useState, useEffect } from 'react';
import { WelcomeView } from './components/WelcomeView';
import { RegisterForm } from './components/RegisterForm';
import { LoginForm } from './components/LoginForm';
import { HomeDashboard } from './components/HomeDashboard';
import './components/HomeDashboard.css';
import Perfil from './components/Perfil';

type ViewType = 'welcome' | 'register' | 'login' | 'dashboard' | 'buscar' | 'publicar' | 'mis-viajes' | 'perfil';

export function App() {

  const [currentView, setCurrentView] = useState<ViewType>('welcome');

  // Sincronizar con el historial del navegador al presionar "atrás" o "adelante"
  useEffect(() => {

    // 1. Validar sesión al cargar la app por primera vez o recargar la página (F5)
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentView('dashboard');
    } else if (currentView === 'dashboard') {
      setCurrentView('welcome');
    }

  // 2. Manejar la navegación con los botones del navegador (atrás/adelante)
  const handlePopState = (event: PopStateEvent) => {
    const currentToken = localStorage.getItem('token');

    if (event.state && event.state.view) {
      // Si intenta ir a dashboard sin token, lo enviamos a login
      if (event.state.view === 'dashboard' && !currentToken) {
        setCurrentView('login');
      } else {
        setCurrentView(event.state.view);
      }
    } else {
      // Si no hay estado en el historial, decidimos según si está logueado o no
      setCurrentView(currentToken ? 'dashboard' : 'welcome');
    }
  };

  window.addEventListener('popstate', handlePopState);

  // Limpieza del listener al desmontar el componente
  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}, []);

  // Función para cambiar de vista y registrarla en el historial del navegador
  const changeView = (view: ViewType) => {

    // Si intenta ir al dashboard pero no tiene token guardado, lo mandamos a login
    if (view === 'dashboard' && !localStorage.getItem('token')) {
      setCurrentView('login');
      return;
    }

    setCurrentView(view);
    window.history.pushState({ view }, '', `#${view}`);
  };

  return (
    <main style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0
    }}>
      {currentView === 'welcome' && (
        <WelcomeView
          onNavigateToRegister={() => changeView('register')}
          onNavigateToLogin={() => changeView('login')}
        />
      )}

      {currentView === 'register' && (
        <RegisterForm 
        onBackToWelcome={() => changeView('welcome')} 
        onNavigateToLogin={() => changeView('login')}
        />
      )}

      {currentView === 'login' && (
        <LoginForm 
          onLoginSuccess={() => changeView('dashboard')} 
          onBackToWelcome={() => changeView('register')} 
        />
      )}

      {currentView === 'dashboard' && (
        <HomeDashboard onNavigate={(view) => changeView(view)} />
      )}

      {currentView === 'perfil' && (
        <Perfil onNavigate={(view) => changeView(view)} />
      )}

    </main>
  );
}

export default App;