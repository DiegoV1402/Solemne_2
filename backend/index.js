import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}));
app.use(express.json()); // Permite al servidor entender JSON
app.use(cookieParser()); 

// Rutas
app.use('/api/auth', authRoutes); 

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('🟢 Conectado a MongoDB (Demon Threshold DB)');
  })
  .catch((error) => {
    console.error('🔴 Error al conectar a MongoDB:', error);
  });

// Ruta base de prueba
app.get('/api/status', (req, res) => {
  res.json({ status: 'API funcionando correctamente' });
});

// Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Backend corriendo en el puerto ${PORT}`);
});