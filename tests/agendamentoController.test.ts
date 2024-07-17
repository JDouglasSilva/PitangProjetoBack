import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let agendamentoId: number | null = null;

const generateFutureDate = (): string => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 10);
  date.setHours(12, 0, 0, 0);
  return date.toISOString();
};

describe('Agendamento Controller', () => {
  beforeAll(async () => {
    // A linha a seguir apaga os dados do banco de dados, usar com cuidado
    //await prisma.agendamento.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    if (agendamentoId) {
      await prisma.agendamento.delete({
        where: { idAgendamento: agendamentoId },
      });
      agendamentoId = null;
    }
  });

  it('deve criar um novo agendamento', async () => {
    const response = await request(app)
      .post('/agendamentos')
      .send({
        nomeDoPaciente: 'John Doe',
        dataNascimentoPaciente: '1990-01-01T00:00:00.000Z',
        dataHoraAgendamento: generateFutureDate()
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('idAgendamento');
    expect(response.body.nomeDoPaciente).toBe('John Doe');

    agendamentoId = response.body.idAgendamento;
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
        dataHoraAgendamento: generateFutureDate()
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

    // Define agendamentoId para excluir o agendamento criado no afterEach
    agendamentoId = novoAgendamento.body.idAgendamento;
  });

  it('deve retornar consultas por dia', async () => {
    const response = await request(app).get('/agendamentos/disponibilidade-hora/2024/07/20');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
