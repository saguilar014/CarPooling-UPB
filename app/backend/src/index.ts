import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/userRoutes';
import tripRoutes from './routes/trip.Routes';

const app = express();
const PORT = process.env.PORT || 4000;

// Permitir peticiones desde el frontend y parsear JSON
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});