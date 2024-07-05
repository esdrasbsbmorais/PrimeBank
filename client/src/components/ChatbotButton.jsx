import { useState } from "react";

const ChatbotButton = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-4 right-4 bg-yellow-500 text-white p-4 rounded-full shadow-lg z-50"
    >
      Chatbot
    </button>
  );
};

export default ChatbotButton;