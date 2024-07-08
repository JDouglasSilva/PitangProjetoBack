import { Agendamento } from '@prisma/client';
import agendamentoRepository from '../repositories/agendamentoRepository';
import AppError from '../errors/AppError';

const intervaloEntreAgendamentos = 3599999; // 59 minutos e 59 segundos e 999 milissegundos em milissegundos

//Interface para facilitarr o envio e uso destes dados, permitindo mudaçna no futuro de forma simples
interface CriarAgendamentoDTO {//DTO = Objeto de Transferência de Dados
  nome: string;
  dataNascimento: Date;
  dataHora: Date;
}

class AgendamentoService {
  async create({ nome, dataNascimento, dataHora }: CriarAgendamentoDTO): Promise<Agendamento> {
    const dataHoraAgendamento = new Date(dataHora);

    const inicioDoDia = new Date(dataHoraAgendamento);
    inicioDoDia.setHours(0, 0, 0, 0);

    const fimDoDia = new Date(dataHoraAgendamento);
    fimDoDia.setHours(23, 59, 59, 999);

    // Verifica se tem mais de 20 agendamentos no dia
    const agendamentosDoDia = await agendamentoRepository.findManyByDay(inicioDoDia, fimDoDia);
    
    if (agendamentosDoDia.length >= 20) {
      throw new AppError('Não há vagas disponíveis para este dia');
    }
    // Verifica quantos agendamentos existem para o horário X, se existir 2, retorna erro, se existir um, permite cadastro
    // Se não existir agendamento ele verifica se tem algum marcado no intervalo de tempo de 1 hora, que impeça a criação de um novo
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

  async getMonthlyCount(year: number): Promise<{ month: number, count: number }[]> {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    const agendamentos = await agendamentoRepository.findManyByDay(start, end);

    const monthlyCounts = Array(12).fill(0).map((_, index) => ({
      month: index + 1,
      count: 0,
    }));

    agendamentos.forEach(agendamento => {
      const month = agendamento.dataHora.getMonth();
      monthlyCounts[month].count += 1;
    });

    return monthlyCounts;
  }
}

export default new AgendamentoService();
