import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { PrismaClient } from '@prisma/client';
import agendamentoRoutes from './routes/agendamentoRoutes';
import errorMiddleware from './middlewares/errorMiddleware';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/agendamentos', agendamentoRoutes);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
