import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you with your legal questions today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      // Here you would typically send the message to your backend
      // and get a response. For now, we'll just simulate a response.
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { 
          text: "Thank you for your question. I'm processing your request and will respond shortly.", 
          sender: "bot" 
        }]);
      }, 1000);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div>
                <a href="#" className="flex items-center py-4 px-2">
                  <span className="font-semibold text-gray-500 text-lg">LegalMentor Chat</span>
                </a>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <Link to="/dashboard" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-blue-500 hover:text-white transition duration-300">Back to Dashboard</Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="bg-white border-t-2 border-gray-200 px-4 py-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="ml-4 bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;

