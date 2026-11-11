import { useState, useEffect } from 'react';
import { WelcomeView } from './components/WelcomeView';
import { RegisterForm } from './components/RegisterForm';
import { LoginForm } from './components/LoginForm';
import { HomeDashboard } from './components/HomeDashboard';
import './components/HomeDashboard.css';
import Perfil from './components/Perfil';
import { Buscar } from './components/Buscar';
import ResultadosBusqueda from './components/ResultadosBusqueda'
import DetalleViaje from './components/DetalleViaje';;
import ReservaConfirmada from './components/ReservaConfirmada';
import { Reserva } from './data/viajesData';
import PublicarViaje from './components/PublicarViaje';

type ViewType = 'welcome' | 'register' | 'login' | 'dashboard' | 'buscar' | 'resultados' | 'detalle' | 'reserva-confirmada' |'publicar' | 'mis-viajes' | 'perfil';

export function App() {

  // Estado para guardar la ruta buscada
  const [searchParams, setSearchParams] = useState({ origen: '', destino: '' });
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [ultimaReserva, setUltimaReserva] = useState<Reserva | null>(null);
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

      {currentView === 'buscar' && (
        <Buscar onNavigate={(view) => changeView(view as ViewType)} 
        onSearchResults={(origen, destino) => {
            // Guardamos el origen y destino seleccionados
            setSearchParams({ origen, destino });
            changeView('resultados');
        }}
        />
      )}

      {currentView === 'resultados' && (
        <ResultadosBusqueda 
          origen={searchParams.origen || 'Origen'}
          destino={searchParams.destino || 'Destino'}
          onNavigate={(view) => changeView(view as ViewType)}
          onSelectTrip={(tripId) => {
            setSelectedTripId(tripId); // <--- GUARDAR EL ID
            changeView('detalle');     // <--- CAMBIAR A LA VISTA DETALLE
          }}
        />
      )}

      {currentView === 'detalle' && (
        <DetalleViaje 
          tripId={selectedTripId}
          onNavigate={(view) => changeView(view as ViewType)}
          onReservaExitosa={(reserva) => {
            setUltimaReserva(reserva);
            changeView('reserva-confirmada');
          }}
        />
      )}

      {currentView === 'reserva-confirmada' && (
        <ReservaConfirmada 
          reserva={ultimaReserva}
          onNavigate={(view) => changeView(view as ViewType)}
        />
      )}

      {currentView === 'publicar' && (
        <PublicarViaje 
          onNavigate={(view) => changeView(view as ViewType)}
        />
      )}
    </main>
  );
}

export default App;