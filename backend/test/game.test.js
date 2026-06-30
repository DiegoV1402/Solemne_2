import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import gameRoutes from '../routes/gameRoutes.js';
import User from '../models/User.js';

vi.mock('../models/User.js', () => ({
  default: {
    find: vi.fn()
  }
}));

const app = express();
app.use(express.json());
app.use('/api/games', gameRoutes);

describe('GET /api/games/leaderboard', () => {
  it('devuelve los mejores puntajes ordenados', async () => {
    User.find.mockReturnValue({
      sort: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue([
            { username: 'Heroe', highScore: 500 }
          ])
        })
      })
    });

    const response = await request(app).get('/api/games/leaderboard');

    expect(response.status).toBe(200);
    expect(response.body[0]).toEqual({
      id: undefined,
      username: 'Heroe',
      score: 500,
      rank: 1
    });
  });
});
