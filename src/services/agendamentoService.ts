import { Agendamento } from '@prisma/client';
import agendamentoRepository from '../repositories/agendamentoRepository';
import AppError from '../errors/AppError';

const intervaloEntreAgendamentos = 3599999; // 59 minutos e 59 segundos e 999 milissegundos em milissegundos

class AgendamentoService {
  async create({ nome, dataNascimento, dataHora }: Omit<Agendamento, 'id' | 'realizado'>): Promise<Agendamento> {
    const dataHoraAgendamento = new Date(dataHora);

    const inicioDoDia = new Date(dataHoraAgendamento);
    inicioDoDia.setHours(0, 0, 0, 0);

    const fimDoDia = new Date(dataHoraAgendamento);
    fimDoDia.setHours(23, 59, 59, 999);

    const agendamentosDoDia = await agendamentoRepository.findManyByDay(inicioDoDia, fimDoDia);
    if (agendamentosDoDia.length >= 20) {
      throw new AppError('Não há vagas disponíveis para este dia');
    }

    const agendamentosNoHorario = await agendamentoRepository.findByDate(dataHoraAgendamento);
    if (agendamentosNoHorario.length >= 2) {
      throw new AppError('Horário já está cheio');
    }

    if (agendamentosNoHorario.length === 1) {
      return agendamentoRepository.create({ nome, dataNascimento: new Date(dataNascimento), dataHora: dataHoraAgendamento });
    }

    const agendamentosProximos = await agendamentoRepository.findManyByDay(
      new Date(dataHoraAgendamento.getTime() - intervaloEntreAgendamentos),
      new Date(dataHoraAgendamento.getTime() + intervaloEntreAgendamentos)
    );
    if (agendamentosProximos.length > 0) {
      throw new AppError('Horário indisponível devido a agendamentos próximos');
    }

    return agendamentoRepository.create({ nome, dataNascimento: new Date(dataNascimento), dataHora: dataHoraAgendamento });
  }

  async getAll(): Promise<Agendamento[]> {
    return agendamentoRepository.findAll();
  }
}

export default new AgendamentoService();
