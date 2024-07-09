-- CreateTable
CREATE TABLE "Agendamento" (
    "idAgendamento" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeDoPaciente" TEXT NOT NULL,
    "dataNascimentoPaciente" DATETIME NOT NULL,
    "dataHoraAgendamento" DATETIME NOT NULL,
    "estadoDoAgendamento" BOOLEAN NOT NULL DEFAULT false,
    "conclusaoDoAgendamento" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE INDEX "Agendamento_dataHoraAgendamento_idx" ON "Agendamento"("dataHoraAgendamento");
