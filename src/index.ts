import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
