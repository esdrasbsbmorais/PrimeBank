import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { Worker, isMainThread, workerData } from "worker_threads";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import pool from './config/db.js';

import userRoutes from "./routes/userRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import { chatHandler } from "./chat/chat.js";
import { generateText } from "./geminiApi.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/api", userRoutes);
app.use("/api", cardRoutes);
app.use("/api", transactionRoutes);

// Endpoint para o chatbot Gemini
app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await generateText(`"Sou um consultor de investimentos especializado. Posso responder suas perguntas sobre investimentos em até um parágrafo. Por favor, limite suas perguntas ao tema de investimentos. Se a pergunta estiver fora desse contexto, peço desculpas, mas só posso responder a perguntas relacionadas a investimentos. Minha pergunta: "${prompt}`);
    res.json({ message: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint de saúde para monitoramento
app.get("/health", (req, res) => {
  res.json({ status: "UP", port: workerData.port });
});

// Configuração do chat
chatHandler(io, workerData);

// Iniciar o servidor
if (isMainThread) {
  const servers = [1000, 1001, 1002];
  servers.forEach((port) => {
    new Worker(new URL(import.meta.url), { workerData: { port } });
  });
} else {
  server.listen(workerData.port, () => {
    console.log(`Servidor ouvindo na porta ${workerData.port}`);
  });
}