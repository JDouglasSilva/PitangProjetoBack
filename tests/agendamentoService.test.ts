import agendamentoService from '../src/services/agendamentoService';
import agendamentoRepository from '../src/repositories/agendamentoRepository';
import AppError from '../src/errors/AppError';

jest.mock('../src/repositories/agendamentoRepository');

describe('Agendamento Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um novo agendamento', async () => {
    const agendamentoData = {
      nomeDoPaciente: 'John Doe',
      dataNascimentoPaciente: new Date('1990-01-01'),
      dataHoraAgendamento: new Date('2024-07-20T10:00:00.000Z')
    };

    (agendamentoRepository.findManyByDay as jest.Mock).mockResolvedValue([]);
    (agendamentoRepository.findByDate as jest.Mock).mockResolvedValue([]);
    (agendamentoRepository.create as jest.Mock).mockResolvedValue(agendamentoData);

    const result = await agendamentoService.create(agendamentoData);

    expect(result).toEqual(agendamentoData);
    expect(agendamentoRepository.findManyByDay).toHaveBeenCalled();
    expect(agendamentoRepository.findByDate).toHaveBeenCalled();
    expect(agendamentoRepository.create).toHaveBeenCalledWith(agendamentoData);
  });

  it('deve lançar um erro se não houver vagas disponíveis', async () => {
    const agendamentoData = {
      nomeDoPaciente: 'John Doe',
      dataNascimentoPaciente: new Date('1990-01-01'),
      dataHoraAgendamento: new Date('2024-07-20T10:00:00.000Z')
    };

    (agendamentoRepository.findManyByDay as jest.Mock).mockResolvedValue(new Array(20));

    await expect(agendamentoService.create(agendamentoData)).rejects.toThrow('Não há vagas disponíveis para este dia');
    expect(agendamentoRepository.findManyByDay).toHaveBeenCalledWith(expect.any(Date), expect.any(Date));
  });

  it('deve lançar um erro se o horário já estiver cheio', async () => {
    const agendamentoData = {
      nomeDoPaciente: 'John Doe',
      dataNascimentoPaciente: new Date('1990-01-01'),
      dataHoraAgendamento: new Date('2024-07-20T10:00:00.000Z')
    };

    (agendamentoRepository.findManyByDay as jest.Mock).mockResolvedValue([]);
    (agendamentoRepository.findByDate as jest.Mock).mockResolvedValue(new Array(2));

    await expect(agendamentoService.create(agendamentoData)).rejects.toThrow('Horário já está cheio');
    expect(agendamentoRepository.findByDate).toHaveBeenCalledWith(expect.any(Date));
  });

  it('deve criar um agendamento se houver apenas um agendamento no horário', async () => {
    const agendamentoData = {
      nomeDoPaciente: 'John Doe',
      dataNascimentoPaciente: new Date('1990-01-01'),
      dataHoraAgendamento: new Date('2024-07-20T10:00:00.000Z')
    };

    (agendamentoRepository.findManyByDay as jest.Mock).mockResolvedValue([]);
    (agendamentoRepository.findByDate as jest.Mock).mockResolvedValue([agendamentoData]);
    (agendamentoRepository.create as jest.Mock).mockResolvedValue(agendamentoData);

    const result = await agendamentoService.create(agendamentoData);

    expect(result).toEqual(agendamentoData);
    expect(agendamentoRepository.findByDate).toHaveBeenCalled();
    expect(agendamentoRepository.create).toHaveBeenCalledWith(agendamentoData);
  });

  it('deve lançar um erro se houver agendamentos próximos', async () => {
    const agendamentoData = {
      nomeDoPaciente: 'John Doe',
      dataNascimentoPaciente: new Date('1990-01-01'),
      dataHoraAgendamento: new Date('2024-07-20T10:00:00.000Z')
    };

    (agendamentoRepository.findManyByDay as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([agendamentoData]);
    (agendamentoRepository.findByDate as jest.Mock).mockResolvedValue([]);

    await expect(agendamentoService.create(agendamentoData)).rejects.toThrow('Horário indisponível devido a agendamentos próximos');
    expect(agendamentoRepository.findManyByDay).toHaveBeenCalledTimes(2);
  });

  it('deve retornar todos os agendamentos', async () => {
    const agendamentos = [{ idAgendamento: 1, nomeDoPaciente: 'John Doe' }];

    (agendamentoRepository.findAll as jest.Mock).mockResolvedValue(agendamentos);

    const result = await agendamentoService.getAll();

    expect(result).toEqual(agendamentos);
    expect(agendamentoRepository.findAll).toHaveBeenCalled();
  });

  it('deve lançar um erro ao atualizar o status de um agendamento inválido', async () => {
    const id = 1;
    const estadoDoAgendamento = false;
    const conclusaoDoAgendamento = true;

    await expect(agendamentoService.updateStatus(id, estadoDoAgendamento, conclusaoDoAgendamento)).rejects.toThrow('Não é possível concluir um agendamento que não foi realizado');
  });

  it('deve atualizar o status de um agendamento', async () => {
    const id = 1;
    const estadoDoAgendamento = true;
    const conclusaoDoAgendamento = true;
    const agendamentoAtualizado = { idAgendamento: 1, estadoDoAgendamento, conclusaoDoAgendamento };

    (agendamentoRepository.updateStatus as jest.Mock).mockResolvedValue(agendamentoAtualizado);

    const result = await agendamentoService.updateStatus(id, estadoDoAgendamento, conclusaoDoAgendamento);

    expect(result).toEqual(agendamentoAtualizado);
    expect(agendamentoRepository.updateStatus).toHaveBeenCalledWith(id, estadoDoAgendamento, conclusaoDoAgendamento);
  });

  it('deve retornar consultas por dia', async () => {
    const consultas = [{ idAgendamento: 1, nomeDoPaciente: 'John Doe' }];
    const year = 2024;
    const month = 7;
    const day = 20;

    (agendamentoRepository.findManyByDay as jest.Mock).mockResolvedValue(consultas);

    const result = await agendamentoService.getConsultasPorDia(year, month, day);

    expect(result).toEqual(consultas);
    expect(agendamentoRepository.findManyByDay).toHaveBeenCalled();
  });
});
