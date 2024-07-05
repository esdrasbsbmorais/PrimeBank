import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ChatModal = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input) {
      const newMessage = { text: input, user: "Você" };
      setMessages(prevMessages => [...prevMessages, newMessage]);

      const response = await fetch("http://localhost:1000/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      const botMessage = { text: data.message, user: "Bot" };

      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = newMessage;
        updatedMessages.push(botMessage);
        return updatedMessages;
      });

      setInput("");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#181a1b] bg-opacity-95 flex items-center justify-center z-50">
      <div className="bg-[#161616] p-4 rounded-lg w-1/2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">IA Assessora de investimentos</h2>
          <button onClick={onClose} className="text-red-500">Fechar</button>
        </div>
        <div className="h-64 overflow-y-auto my-4 bg-[#181a1b] p-4 rounded-lg">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`my-2 ${message.user === "Você" ? "self-start bg-yellow-500" : "self-end bg-gradient-to-r from-[#217bfe] to-[#ee4d5d]"} text-white p-2 rounded-lg max-w-xs`}
            >
              <div className="font-semibold">{message.user}</div>
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow text-white"
            placeholder="Digite sua mensagem..."
            onKeyPress={(e) => e.key === 'Enter' ? handleSendMessage() : null}
          />
          <Button onClick={handleSendMessage} className="text-black bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg ml-2">Enviar</Button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
