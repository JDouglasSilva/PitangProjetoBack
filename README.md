# Projeto Pitang - Back-End

## Descrição

Este é o back-end do projeto de agendamento de vacinas para COVID-19. Ele fornece uma API para gerenciar agendamentos, incluindo a criação, atualização e consulta de agendamentos.

## Tecnologias Utilizadas

- Node.js
- Express.js
- Prisma ORM
- SQLite
- TypeScript
- Jest (para testes)

## Configuração do Ambiente

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm

### Endpoints Principais

- `POST /agendamentos`: Cria um novo agendamento.
- `GET /agendamentos`: Retorna todos os agendamentos.
- `GET /agendamentos/:year/:month?/:day?`: Retorna agendamentos por data.
- `PATCH /agendamentos/:id`: Atualiza o status de um agendamento.
- `GET /agendamentos/disponibilidade-hora/:year/:month/:day`: Retorna a disponibilidade de horários por dia.

### Estrutura do Projeto

- `src/app.ts`: Configuração do aplicativo Express.
- `src/server.ts`: Inicialização do servidor.
- `src/controllers/`: Controladores que lidam com as requisições.
- `src/services/`: Serviços que contêm a lógica de negócios.
- `src/repositories/`: Repositórios que interagem com o banco de dados.
- `src/middlewares/`: Middlewares para tratamento de erros.
- `src/errors/`: Classe personalizada para tratamento de erros.
- `src/routes/`: Definição das rotas da API.
- `prisma/schema.prisma`: Definição do schema do banco de dados.

### Testes

Para rodar os testes, utilize o comando:
```sh
npm test
```

Adiciona 100 agendamentos ao banco de dados, dando preferência a dias próximos. Este script pode ser executado várias vezes para simular dias mais lotados e é útil para verificar como o sistema de agendamento ou exibição das consultas reage a dias lotados.
```sh
npm run create
```
