import { Request, Response } from 'express';

import agendamentoService from '../services/agendamentoService';

class AgendamentoController {
  async create(req: Request, res: Response): Promise<Response> {
    const { nome, dataNascimento, dataHora } = req.body;
    const novoAgendamento = await agendamentoService.create({ nome, dataNascimento, dataHora });
    return res.status(201).json(novoAgendamento);
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const agendamentos = await agendamentoService.getAll();
    return res.status(200).json(agendamentos);
  }
}

export default new AgendamentoController();
