import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite al servidor entender JSON

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