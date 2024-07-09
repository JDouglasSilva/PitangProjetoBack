import { Request, Response } from 'express';
import agendamentoService from '../services/agendamentoService';

class AgendamentoController {
  async create(req: Request, res: Response): Promise<Response> {
    const { nomeDoPaciente, dataNascimentoPaciente, dataHoraAgendamento } = req.body;
    const novoAgendamento = await agendamentoService.create({ nomeDoPaciente, dataNascimentoPaciente: new Date(dataNascimentoPaciente), dataHoraAgendamento: new Date(dataHoraAgendamento) });
    return res.status(201).json(novoAgendamento);
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const agendamentos = await agendamentoService.getAll();
    return res.status(200).json(agendamentos);
  }

  async getMonthlyCount(req: Request, res: Response): Promise<Response> {
    const { year } = req.params;
    const counts = await agendamentoService.getMonthlyCount(Number(year));
    return res.status(200).json(counts);
  }

  async getDailyCount(req: Request, res: Response): Promise<Response> {
    const { year, month } = req.params;
    const counts = await agendamentoService.getDailyCount(Number(year), Number(month));
    return res.status(200).json(counts);
  }

  async getByDay(req: Request, res: Response): Promise<Response> {
    const { year, month, day } = req.params;
    const consultas = await agendamentoService.getByDay(Number(year), Number(month), Number(day));
    return res.status(200).json(consultas);
  }

  async updateStatus(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { estadoDoAgendamento, conclusaoDoAgendamento } = req.body;
    const agendamentoAtualizado = await agendamentoService.updateStatus(Number(id), estadoDoAgendamento, conclusaoDoAgendamento);
    return res.status(200).json(agendamentoAtualizado);
  }
}

export default new AgendamentoController();
