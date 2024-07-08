import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = 3000;
const prisma = new PrismaClient();
const intervaloEntreAgendamentos = 3599999; // 59 minutos e 59 segundos e 999 milisegundos em milissegundos(Para permitir uma consulta as 8 e outra as 9)
                                   
app.use(cors());
app.use(express.json());

app.post('/agendar', async (req, res) => {
  const { nome, dataNascimento, dataHora } = req.body;
  const dataHoraAgendamento = new Date(dataHora);

  try {
    // Verificar se já existem mais de 20 consultas no dia
    const inicioDoDia = new Date(dataHoraAgendamento);
    inicioDoDia.setHours(0, 0, 0, 0);

    const fimDoDia = new Date(dataHoraAgendamento);
    fimDoDia.setHours(23, 59, 59, 999);

    const agendamentosDoDia = await prisma.agendamento.findMany({
      where: {
        dataHora: {
          gte: inicioDoDia,
          lt: fimDoDia,
        },
      },
    });

    if (agendamentosDoDia.length >= 20) {
      return res.status(400).json({ error: 'Não há vagas disponíveis para este dia' });
    }

    // Verificar quantos agendamentos existem para o horário escolhido
    const agendamentosNoHorario = await prisma.agendamento.findMany({
      where: { dataHora: dataHoraAgendamento },
    });

    if (agendamentosNoHorario.length >= 2) {
      return res.status(400).json({ error: 'Horário já está cheio' });
    }

    if (agendamentosNoHorario.length === 1) {
      // Permitir um segundo agendamento para o mesmo horário
      const novoAgendamento = await prisma.agendamento.create({
        data: {
          nome,
          dataNascimento: new Date(dataNascimento),
          dataHora: dataHoraAgendamento,
        },
      });
      return res.status(201).json(novoAgendamento);
    }

    // Verificar se existe algum agendamento marcado para 3599 segundos antes ou depois do horário escolhido
    const agendamentosProximos = await prisma.agendamento.findMany({
      where: {
        dataHora: {
          gte: new Date(dataHoraAgendamento.getTime() - intervaloEntreAgendamentos),
          lt: new Date(dataHoraAgendamento.getTime() + intervaloEntreAgendamentos),
        },
      },
    });

    if (agendamentosProximos.length > 0) {
      return res.status(400).json({ error: 'Horário indisponível devido a agendamentos próximos' });
    }

    // Criar um novo agendamento
    const novoAgendamento = await prisma.agendamento.create({
      data: {
        nome,
        dataNascimento: new Date(dataNascimento),
        dataHora: dataHoraAgendamento,
      },
    });

    res.status(201).json(novoAgendamento);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o agendamento' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
