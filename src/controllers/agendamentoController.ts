import { Request, Response } from 'express';
import agendamentoService from '../services/agendamentoService';

class AgendamentoController {
  async create(req: Request, res: Response): Promise<Response> {
    const { nome, dataNascimento, dataHora } = req.body;
    const novoAgendamento = await agendamentoService.create({ nome, dataNascimento: new Date(dataNascimento), dataHora: new Date(dataHora) });
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
}

export default new AgendamentoController();
