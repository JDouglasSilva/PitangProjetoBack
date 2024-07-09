import { PrismaClient, Agendamento } from '@prisma/client';

const prisma = new PrismaClient();

interface CriarAgendamentoDTO {
  nomeDoPaciente: string;
  dataNascimentoPaciente: Date;
  dataHoraAgendamento: Date;
  estadoDoAgendamento?: boolean;
  conclusaoDoAgendamento?: boolean;
}

class AgendamentoRepository {
  async create(data: CriarAgendamentoDTO): Promise<Agendamento> {
    return prisma.agendamento.create({ data });
  }

  async findByDate(dataHoraAgendamento: Date): Promise<Agendamento[]> {
    return prisma.agendamento.findMany({ where: { dataHoraAgendamento } });
  }

  async findManyByDay(start: Date, end: Date): Promise<Agendamento[]> {
    return prisma.agendamento.findMany({ where: { dataHoraAgendamento: { gte: start, lt: end } } });
  }

  async findAll(): Promise<Agendamento[]> {
    return prisma.agendamento.findMany();
  }

  async updateStatus(id: number, estadoDoAgendamento: boolean, conclusaoDoAgendamento: boolean): Promise<Agendamento> {
    return prisma.agendamento.update({
      where: { idAgendamento: id },
      data: { estadoDoAgendamento, conclusaoDoAgendamento },
    });
  }
}

export default new AgendamentoRepository();
