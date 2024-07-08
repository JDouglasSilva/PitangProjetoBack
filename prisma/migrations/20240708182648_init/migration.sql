-- CreateTable
CREATE TABLE "Agendamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "dataNascimento" DATETIME NOT NULL,
    "dataHora" DATETIME NOT NULL,
    "realizado" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE INDEX "Agendamento_dataHora_idx" ON "Agendamento"("dataHora");
