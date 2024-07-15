import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Agendamento Controller', () => {
  beforeAll(async () => {
    await prisma.agendamento.deleteMany(); // Limpa a tabela de agendamentos antes dos testes
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve criar um novo agendamento', async () => {
    const response = await request(app)
      .post('/agendamentos')
      .send({
        nomeDoPaciente: 'John Doe',
        dataNascimentoPaciente: '1990-01-01T00:00:00.000Z',
        dataHoraAgendamento: '2024-07-20T10:00:00.000Z'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('idAgendamento');
    expect(response.body.nomeDoPaciente).toBe('John Doe');
  });

  it('deve retornar todos os agendamentos', async () => {
    const response = await request(app).get('/agendamentos');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('deve retornar agendamentos por data', async () => {
    const response = await request(app).get('/agendamentos/2024/07/20');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('deve atualizar o status do agendamento', async () => {
    const novoAgendamento = await request(app)
      .post('/agendamentos')
      .send({
        nomeDoPaciente: 'Jane Doe',
        dataNascimentoPaciente: '1990-01-01T00:00:00.000Z',
        dataHoraAgendamento: '2024-07-21T10:00:00.000Z'
      });

    const response = await request(app)
      .patch(`/agendamentos/${novoAgendamento.body.idAgendamento}`)
      .send({
        estadoDoAgendamento: true,
        conclusaoDoAgendamento: true
      });

    expect(response.status).toBe(200);
    expect(response.body.estadoDoAgendamento).toBe(true);
    expect(response.body.conclusaoDoAgendamento).toBe(true);
  });

  it('deve retornar consultas por dia', async () => {
    const response = await request(app).get('/agendamentos/disponibilidade-hora/2024/07/20');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
