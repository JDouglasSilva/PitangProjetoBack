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

  async getAgendamentos(req: Request, res: Response): Promise<Response> {
    const { year, month, day } = req.params;
    const agendamentos = await agendamentoService.getAgendamentos(Number(year), month ? Number(month) : undefined, day ? Number(day) : undefined);
    return res.status(200).json(agendamentos);
  }

  async updateStatus(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { estadoDoAgendamento, conclusaoDoAgendamento } = req.body;
    const agendamentoAtualizado = await agendamentoService.updateStatus(Number(id), estadoDoAgendamento, conclusaoDoAgendamento);
    return res.status(200).json(agendamentoAtualizado);
  }
}

export default new AgendamentoController();
