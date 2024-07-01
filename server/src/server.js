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

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

const SECRET_KEY = process.env.SECRET_KEY || "paodepadaria";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/api", userRoutes);
app.use("/api", cardRoutes);
app.use("/api", transactionRoutes);

// Endpoint de saúde para monitoramento
app.get("/health", (req, res) => {
  res.json({ status: "UP", port: workerData.port });
});

// Configuração do chat
chatHandler(io, workerData);

// Iniciar o servidor
if (isMainThread) {
  const servers = [1000, 1001, 1002]; // Lista de portas para servidores
  servers.forEach((port) => {
    new Worker(new URL(import.meta.url), { workerData: { port } });
  });
} else {
  server.listen(workerData.port, () => {
    console.log(`Servidor ouvindo na porta ${workerData.port}`);
  });
}
