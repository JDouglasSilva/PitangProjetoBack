import request from 'supertest';
import express from 'express';
import errorMiddleware from '../src/middlewares/errorMiddleware';
import AppError from '../src/errors/AppError';

const app = express();

app.use(express.json()); // Adicione o uso do middleware json

app.get('/error', (req, res) => {
  throw new AppError('Test Error', 400);
});

app.get('/generic-error', (req, res) => {
  throw new Error('Generic Error');
});

app.use(errorMiddleware);

describe('Error Middleware', () => {
  it('deve lidar com AppError corretamente', async () => {
    const response = await request(app).get('/error');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Test Error');
  });

  it('deve lidar com erros genéricos corretamente', async () => {
    const response = await request(app).get('/generic-error');
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal Server Error');
  });
});
