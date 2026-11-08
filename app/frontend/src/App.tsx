import React from 'react';
import { RegisterForm } from './components/RegisterForm';

function App() {
  return (
    <div style={{
      backgroundColor: '#123B63',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <RegisterForm />
    </div>
  );
}

export default App;