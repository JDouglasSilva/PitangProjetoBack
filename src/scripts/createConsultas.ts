// PitangProjeto\backend\src\scripts\createConsultas.ts

import axios from 'axios';
import { addDays, differenceInDays } from 'date-fns';
import dotenv from 'dotenv';

dotenv.config();
const nomes = [
    'Ana', 'Carlos', 'Daniel', 'Eduarda', 'Fernando', 'Gabriela', 'Henrique', 'Isabela', 'João', 'Laura', 
    'Marcos', 'Julia', 'Pedro', 'Alice', 'Lucas', 'Sofia', 'Rafael', 'Beatriz', 'Thiago', 'Manuela', 
    'Rodrigo', 'Valentina', 'Gustavo', 'Mariana', 'Ricardo', 'Letícia', 'Felipe', 'Lara', 'Renato', 'Luana',
    'Bruno', 'Camila', 'Diego', 'Evelyn', 'Fábio', 'Guilherme', 'Heitor', 'Ivana', 'Jorge', 'Karla', 
    'Leandro', 'Márcia', 'Nathalia', 'Otávio', 'Paula', 'Quintino', 'Rafaela', 'Simone', 'Tadeu', 'Úrsula',
    'Vítor', 'Wagner', 'Xavier', 'Yara', 'Zuleica', 'Adriana', 'Bernardo', 'Clara', 'Davi', 'Eliana',
    'Flávia', 'Giovana', 'Hugo', 'Ingrid', 'José', 'Karen', 'Leonardo', 'Marta', 'Nicolas', 'Olga', 
    'Patrícia', 'Quirino', 'Raimundo', 'Sabrina', 'Tânia', 'Ulisses', 'Vanessa', 'Wesley', 'Ximena', 'Yuri', 'Zeca'
  ];
  const sobrenomes = [
    'Silva', 'Souza', 'Oliveira', 'Santos', 'Pereira', 'Costa', 'Rodrigues', 'Almeida', 'Nascimento', 'Lima', 
    'Gomes', 'Martins', 'Barbosa', 'Rocha', 'Melo', 'Cavalcanti', 'Ribeiro', 'Teixeira', 'Fernandes', 'Araujo', 
    'Castro', 'Campos', 'Cardoso', 'Leal', 'Reis', 'Cunha', 'Dias', 'Freitas', 'Vieira', 'Moura', 
    'Gonçalves', 'Fonseca', 'Carvalho', 'Macedo', 'Pinto', 'Moura', 'Duarte', 'Tavares', 'Peixoto', 'Farias',
    'Santana', 'Monteiro', 'Neves', 'Alves', 'Sousa', 'Pacheco', 'Correia', 'Amaral', 'Lopes', 'Ferreira',
    'Nogueira', 'Mendes', 'Machado', 'Moreira', 'Figueiredo', 'Borges', 'Siqueira', 'Simões', 'Franco', 'Ramos',
    'Barros', 'Assis', 'Andrade', 'Vieira', 'Batista', 'Furtado', 'Brito', 'Matias', 'Paiva', 'Lacerda',
    'Rangel', 'Magalhães', 'Castanheira', 'Guimarães', 'Marques', 'Viana', 'Souto', 'Xavier', 'Teles', 'Peixoto'
  ];
  

const randomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const randomDateOfBirth = () => {
  const start = new Date(1925, 0, 1);
  const end = new Date(2023, 0, 1);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Função para gerar uma data de agendamento aleatória dentro de um intervalo
const randomAgendamentoDateWithinDays = (startDay: number, endDay: number) => {
  const today = new Date();
  const daysInFuture = Math.floor(Math.random() * (endDay - startDay + 1)) + startDay;
  const futureDate = addDays(today, daysInFuture);
  const hour = Math.floor(Math.random() * 14) + 7;
  futureDate.setHours(hour, 0, 0, 0);
  return futureDate;
};

// Função principal para criar várias consultas seguindo as proporções especificadas
const main = async () => {
  const numConsultas = 100;

  // Distribuição dos agendamentos dando preferencia para escolher dias proximos.
  const consultasPrimeiros30Dias = Math.floor(numConsultas * 2 / 3);
  const consultasProximos30Dias = Math.floor((numConsultas - consultasPrimeiros30Dias) * 2 / 3);
  const consultasUltimos30Dias = numConsultas - consultasPrimeiros30Dias - consultasProximos30Dias;

  for (let i = 0; i < consultasPrimeiros30Dias; i++) {
    await createAgendamentoWithinRange(0, 29);
  }
  for (let i = 0; i < consultasProximos30Dias; i++) {
    await createAgendamentoWithinRange(30, 59);
  }
  for (let i = 0; i < consultasUltimos30Dias; i++) {
    await createAgendamentoWithinRange(60, 89);
  }
};

const createAgendamentoWithinRange = async (startDay: number, endDay: number) => {
  const nomeDoPaciente = `${randomElement(nomes)} ${randomElement(sobrenomes)} ${randomElement(sobrenomes)}`;
  const dataNascimentoPaciente = randomDateOfBirth();
  const dataHoraAgendamento = randomAgendamentoDateWithinDays(startDay, endDay);

  try {
    console.log(`Criando agendamento para ${nomeDoPaciente} em ${dataHoraAgendamento.toISOString()}`);
    const response = await axios.post(`${process.env.BASE_URL}/agendamentos`, {
      nomeDoPaciente,
      dataNascimentoPaciente: dataNascimentoPaciente.toISOString(),
      dataHoraAgendamento: dataHoraAgendamento.toISOString(),
    });
    console.log(`Agendamento criado: ${response.data.idAgendamento}`);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Erro ao criar agendamento:', err.response?.data || err.message);
    } else {
      console.error('Erro ao criar agendamento:', err);
    }
  }
};

main();
