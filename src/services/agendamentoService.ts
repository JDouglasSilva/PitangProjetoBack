import { Agendamento } from '@prisma/client';
import agendamentoRepository from '../repositories/agendamentoRepository';
import AppError from '../errors/AppError';

const intervaloEntreAgendamentos = 3599999; // 59 minutos e 59 segundos e 999 milissegundos em milissegundos

interface CriarAgendamentoDTO {
  nomeDoPaciente: string;
  dataNascimentoPaciente: Date;
  dataHoraAgendamento: Date;
  estadoDoAgendamento?: boolean;
  conclusaoDoAgendamento?: boolean;
}

class AgendamentoService {
  async create({ nomeDoPaciente, dataNascimentoPaciente, dataHoraAgendamento }: CriarAgendamentoDTO): Promise<Agendamento> {
    const dataHora = new Date(dataHoraAgendamento);

    const inicioDoDia = new Date(dataHora);
    inicioDoDia.setHours(0, 0, 0, 0);

    const fimDoDia = new Date(dataHora);
    fimDoDia.setHours(23, 59, 59, 999);

    const agendamentosDoDia = await agendamentoRepository.findManyByDay(inicioDoDia, fimDoDia);
    
    if (agendamentosDoDia.length >= 20) {
      throw new AppError('Não há vagas disponíveis para este dia');
    }

    const agendamentosNoHorario = await agendamentoRepository.findByDate(dataHora);
    if (agendamentosNoHorario.length >= 2) {
      throw new AppError('Horário já está cheio');
    }

    if (agendamentosNoHorario.length === 1) {
      return agendamentoRepository.create({ nomeDoPaciente, dataNascimentoPaciente: new Date(dataNascimentoPaciente), dataHoraAgendamento: dataHora });
    }

    const agendamentosProximos = await agendamentoRepository.findManyByDay(
      new Date(dataHora.getTime() - intervaloEntreAgendamentos),
      new Date(dataHora.getTime() + intervaloEntreAgendamentos)
    );
    if (agendamentosProximos.length > 0) {
      throw new AppError('Horário indisponível devido a agendamentos próximos');
    }
    return agendamentoRepository.create({ nomeDoPaciente, dataNascimentoPaciente: new Date(dataNascimentoPaciente), dataHoraAgendamento: dataHora });
  }

  async getAll(): Promise<Agendamento[]> {
    return agendamentoRepository.findAll();
  }

  async getMonthlyCount(year: number): Promise<{ month: number, count: number }[]> {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    const agendamentos = await agendamentoRepository.findManyByDay(start, end);

    const monthlyCounts = Array(12).fill(0).map((_, index) => ({
      month: index + 1,
      count: 0,
    }));

    agendamentos.forEach(agendamento => {
      const month = agendamento.dataHoraAgendamento.getMonth();
      monthlyCounts[month].count += 1;
    });

    return monthlyCounts;
  }

  async getDailyCount(year: number, month: number): Promise<{ day: number, count: number }[]> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    const agendamentos = await agendamentoRepository.findManyByDay(start, end);

    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyCounts = Array(daysInMonth).fill(0).map((_, index) => ({
      day: index + 1,
      count: 0,
    }));

    agendamentos.forEach(agendamento => {
      const day = agendamento.dataHoraAgendamento.getDate();
      dailyCounts[day - 1].count += 1;
    });

    return dailyCounts;
  }

  async getByDay(year: number, month: number, day: number): Promise<Agendamento[]> {
    const start = new Date(year, month - 1, day);
    const end = new Date(year, month - 1, day, 23, 59, 59, 999);
    return agendamentoRepository.findManyByDay(start, end);
  }

  async updateStatus(id: number, estadoDoAgendamento: boolean, conclusaoDoAgendamento: boolean): Promise<Agendamento> {
    return agendamentoRepository.updateStatus(id, estadoDoAgendamento, conclusaoDoAgendamento);
  }
}

export default new AgendamentoService();
