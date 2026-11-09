import { useState, useEffect } from 'react';
import { WelcomeView } from './components/WelcomeView';
import { RegisterForm } from './components/RegisterForm';
import { LoginForm } from './components/LoginForm';

export function App() {
  const [currentView, setCurrentView] = useState<'welcome' | 'register' | 'login'>('welcome');

  // Sincronizar con el historial del navegador al presionar "atrás" o "adelante"
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
      } else {
        setCurrentView('welcome');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Función para cambiar de vista y registrarla en el historial del navegador
  const changeView = (view: 'welcome' | 'register' | 'login') => {
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
          onLoginSuccess={() => changeView('welcome')} 
          onBackToWelcome={() => changeView('register')} 
        />
      )}
    </main>
  );
}

export default App;