import { Router } from 'express';
import agendamentoController from '../controllers/agendamentoController';

const router = Router();

router.post('/', agendamentoController.create);
router.get('/', agendamentoController.getAll);
router.get('/:year/:month?/:day?', agendamentoController.getAgendamentos);
router.get('/disponibilidade-hora/:year/:month/:day', agendamentoController.getConsultasPorDia);
router.patch('/:id', agendamentoController.updateStatus);

export default router;
