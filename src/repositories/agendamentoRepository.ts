import { PrismaClient, Agendamento } from '@prisma/client';

const prisma = new PrismaClient();

class AgendamentoRepository {
  async create(data: Omit<Agendamento, 'id' | 'realizado'>): Promise<Agendamento> {
    return prisma.agendamento.create({ data });
  }

  async findByDate(dataHora: Date): Promise<Agendamento[]> {
    return prisma.agendamento.findMany({ where: { dataHora } });
  }

  async findManyByDay(start: Date, end: Date): Promise<Agendamento[]> {
    return prisma.agendamento.findMany({ where: { dataHora: { gte: start, lt: end } } });
  }

  async findAll(): Promise<Agendamento[]> {
    return prisma.agendamento.findMany();
  }
}

export default new AgendamentoRepository();
