import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/authRoutes.js';
import User from '../models/User.js';

// 1. Configuramos un servidor de prueba rápido
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// 2. MOCK DE BCRYPT (Herramientas de encriptación)
vi.mock('bcryptjs', () => ({
  default: {
    genSalt: vi.fn().mockResolvedValue('fakesalt'),
    hash: vi.fn().mockResolvedValue('hashedpassword'),
    compare: vi.fn()
  }
}));

// 3. MOCK DE MONGOOSE (El modelo de Usuario corregido)
vi.mock('../models/User.js', () => {
  const MockUserModel = function(data) {
    return {
      ...data,
      save: vi.fn().mockResolvedValue(true)
    };
  };
 
  MockUserModel.findOne = vi.fn();
 
  return { default: MockUserModel };
});

describe('Pruebas Unitarias de Autenticación (Con Mocks)', () => {
 
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Debería registrar un usuario si NO existe previamente', async () => {
    // PREPARACIÓN
    User.findOne.mockResolvedValue(null);

    // ACCIÓN: Agregamos el campo email que faltaba
    const response = await request(app)
      .post('/api/auth/register')
      .send({ username: 'NuevoJugador', email: 'nuevo@correo.com', password: '123' });

    // VERIFICACIÓN
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Usuario registrado con éxito');
   
    // Corregido: La validación ahora coincide con el $or del controlador
    expect(User.findOne).toHaveBeenCalledWith({
      $or: [{ email: 'nuevo@correo.com' }, { username: 'NuevoJugador' }]
    });
  });

  it('Debería devolver error 400 si el usuario YA existe', async () => {
    // PREPARACIÓN
    User.findOne.mockResolvedValue({ username: 'JugadorExistente', email: 'existe@correo.com' });

    // ACCIÓN
    const response = await request(app)
      .post('/api/auth/register')
      .send({ username: 'JugadorExistente', email: 'existe@correo.com', password: '123' });

    // VERIFICACIÓN
    expect(response.status).toBe(400);
    // Corregido: El mensaje ahora es exactamente el que emite tu backend
    expect(response.body.message).toBe('El usuario o correo ya está registrado');
  });
});