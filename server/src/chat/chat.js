import { generateText } from '../geminiApi.js';

const users = new Map();

export const chatHandler = (io, workerData) => {
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
};
