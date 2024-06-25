import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { generateText } from './geminiApi.js';
import { Worker, isMainThread, workerData } from 'worker_threads';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});
app.use(cors());

// Endpoint de saúde para monitoramento
app.get('/health', (req, res) => {
    res.json({ status: 'UP', port: workerData.port });
});

const users = new Map();

io.on('connection', (socket) => {
    console.log(`Conexão estabelecida no servidor da porta ${workerData.port}`);
    
    socket.on('registerUser', (username) => {
        users.set(socket.id, username);
        io.emit('userConnected', `Usuário ${username} entrou no chat`);
        console.log('Usuário conectado: ' + username);
    });

    socket.on('sendMessage', ({ text, user }) => {
        const messageId = Date.now();
        io.emit('messageReceived', { text, user, messageId });
        console.log(`Mensagem recebida no servidor da porta ${workerData.port}: ${text}`);
    });

    socket.on('sendGeminiMessage', async ({ text, user }) => {
        try {
            const messageId = Date.now();
            const userMessage = { text: text.slice(1), user, messageId };
            io.emit('messageReceived', userMessage);
    
            const generatedText = await generateText(text.slice(1));
            const responseText = `${generatedText}`;
            io.emit('messageReceived', { text: responseText, user: "Gemini", originalMessageId: messageId });
        } catch (error) {
            console.error(`Erro ao gerar texto no servidor da porta ${workerData.port}:`, error);
            socket.emit('error', 'Erro ao gerar texto');
        }
    });    

    socket.on('disconnect', () => {
        if (users.has(socket.id)) {
            const username = users.get(socket.id);
            users.delete(socket.id);
            io.emit('userDisconnected', `Usuário ${username} saiu do chat`);
            console.log('Usuário desconectado: ' + username);
        }
    });
});

if (isMainThread) {
    const servers = [1000, 1001, 1002];  // Lista de portas para servidores
    servers.forEach(port => {
        new Worker(new URL(import.meta.url), { workerData: { port } });
    });
} else {
    server.listen(workerData.port, () => {
        console.log(`Servidor ouvindo na porta ${workerData.port}`);
    });
}
