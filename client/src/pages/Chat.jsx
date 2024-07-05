import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import io from 'socket.io-client';
import Image from 'next/image';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const servers = ['http://localhost:1000', 'http://localhost:1001', 'http://localhost:1002'];
let currentServerIndex = 0;

function connectSocket() {
  const socket = io(servers[currentServerIndex]);

  socket.on('connect_error', (err) => {
    console.log(`Conexão falhou no ${servers[currentServerIndex]}, tentando outro servidor.`);
    currentServerIndex = (currentServerIndex + 1) % servers.length;
    connectSocket();
  });

  return socket;
}

const socket = connectSocket();


export default function Chat() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [highlightedMessage, setHighlightedMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const messageRefs = useRef({});
  const [toggle, setToggle] = useState(false); // Estado temporário para forçar atualização

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsLoggedIn(true);
      socket.emit('registerUser', storedUsername);
    }

    socket.on('messageReceived', (msg) => {
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    socket.on('userConnected', (msg) => {
      setMessages(prevMessages => [...prevMessages, { text: msg, user: "Sistema", isSystem: true }]);
    });

    socket.on('userDisconnected', (msg) => {
      setMessages(prevMessages => [...prevMessages, { text: msg, user: "Sistema", isSystem: true }]);
    });

    return () => {
      socket.off('messageReceived');
      socket.off('userConnected');
      socket.off('userDisconnected');
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (highlightedMessage && messageRefs.current[highlightedMessage]) {
      const messageElement = messageRefs.current[highlightedMessage];
      let count = 0;
      const interval = setInterval(() => {
        messageElement.classList.toggle('highlight');
        count++;
        if (count >= 3) {
          clearInterval(interval);
          messageElement.classList.remove('highlight');
        }
      }, 500);
      messageElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [highlightedMessage, toggle]); // Forçar atualização

  const sendMessage = () => {
    if (message) {
      if (message.startsWith('#')) {
        socket.emit('sendGeminiMessage', { text: message, user: username });
      } else {
        socket.emit('sendMessage', { text: message, user: username });
      }
      setMessage('');
    }
  };  

  const handleLogin = () => {
    if (username.trim()) {
      setIsLoggedIn(true);
      localStorage.setItem('username', username);
      socket.emit('registerUser', username);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    socket.disconnect(true);
    window.location.reload();
  };

  const handleHighlightMessage = (messageId) => {
    setHighlightedMessage(messageId);
    setToggle(prev => !prev); // Alterna o valor para forçar a atualização
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#181a1b]">
        <Link href={"/Dashboard"} className='top-20 left-20 absolute'>
          <FontAwesomeIcon icon={faArrowLeft} className="cursor-pointer mr-2 text-white" onClick={() => router.back()} />
        </Link>
        <Image src={"/primebank.svg"} width={200} height={88} className='mb-6'></Image>
        <div className="text-xl font-bold mb-4 text-white">Digite seu nome de usuário</div>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' ? handleLogin() : null}
          className="mb-4 w-2/4 text-white"
        />
        <Button onClick={handleLogin} className="text-black bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg">Entrar no Chat</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#161616]">
      <header className="p-4 shadow text-white flex flex-col md:flex-row items-center justify-between border-b border-[#373c3e]">
        <h1 className="text-2xl font-bold mb-2 md:mb-0">Sala de bate papo</h1>
        <div className="flex items-center space-x-4">
          <p className="text-lg whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">Bem-vindo, <span className="font-bold">{username}</span></p>
          <Button onClick={handleLogout} className="text-black bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg">Sair</Button>
        </div>
      </header>
      <main className="flex-grow overflow-y-auto p-4 bg-[#181a1b]">
        <div className="flex flex-col space-y-2">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              ref={el => messageRefs.current[msg.messageId] = el} 
              className={`${msg.user === "Sistema" ? 'text-gray-500' : msg.user === username ? 'self-end bg-yellow-500' : msg.user === 'Gemini' ? 'self-start bg-gradient-to-r from-[#217bfe] to-[#ee4d5d]' : 'self-start bg-gray-500'} text-white p-2 rounded-lg max-w-xs relative`}
            >
              <div className="font-semibold">{msg.user}</div>
              {msg.originalMessageId && (
                <div className="text-sm text-gray-300">
                  <div className="border-l-4 border-green-500 pl-2 mb-2 cursor-pointer" onClick={() => handleHighlightMessage(msg.originalMessageId)}>
                    <strong>{messages.find(m => m.messageId === msg.originalMessageId)?.user}:</strong> {messages.find(m => m.messageId === msg.originalMessageId)?.text}
                  </div>
                </div>
              )}
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <footer className="p-4 border-t border-[#373c3e]">
        <div className="flex space-x-2">
          <Input 
            placeholder="Digite sua mensagem..." 
            className="flex-grow text-white" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' ? sendMessage() : null}
          />
          <Button variant="slim" onClick={sendMessage} className="text-white">Enviar</Button>
        </div>
      </footer>
    </div>
  );
}
