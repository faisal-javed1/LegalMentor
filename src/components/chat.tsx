import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you with your legal questions today?", sender: "bot", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showActions, setShowActions] = useState(null);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage = { text: input, sender: "user", timestamp: new Date() };
      setMessages([...messages, newMessage]);
      setInput('');
      setIsTyping(true);
      
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, {
          text: "Thank you for your question. I'm processing your request and will respond shortly.",
          sender: "bot",
          timestamp: new Date()
        }]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <nav className="bg-black border-b border-[#D3D3D3]">
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="p-2 rounded-full hover:bg-[#D3D3D3] hover:bg-opacity-10 transition-colors"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <span className="font-semibold text-white text-lg">LegalMentor</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            onMouseEnter={() => setShowActions(index)}
            onMouseLeave={() => setShowActions(null)}
          >
            <div className={`relative max-w-xs lg:max-w-md p-4 rounded-2xl shadow-lg
              ${message.sender === 'user' 
                ? 'bg-white text-black ml-12' 
                : 'bg-[#D3D3D3] text-black mr-12'}`}>
              <ReactMarkdown
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {message.text}
              </ReactMarkdown>
              <p className="text-xs mt-1 text-black text-opacity-60">
                {formatTime(message.timestamp)}
              </p>
              
              {/* Message Actions - Only Copy button now */}
              {showActions === index && message.sender === 'bot' && (
                <div className="absolute -right-16 top-0">
                  <button 
                    onClick={() => copyToClipboard(message.text)}
                    className="p-2 bg-[#D3D3D3] rounded-full hover:bg-opacity-80 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-black" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#D3D3D3] text-black p-4 rounded-2xl shadow-lg mr-12">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-black bg-opacity-40 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-black bg-opacity-40 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-black bg-opacity-40 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input form - Simplified */}
      <form onSubmit={handleSubmit} className="bg-black border-t border-[#D3D3D3] px-4 py-4">
        <div className="max-w-6xl mx-auto flex space-x-4">
          <div className="flex-1 flex items-center px-4 py-2 bg-[#D3D3D3] rounded-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 bg-transparent text-black placeholder-black placeholder-opacity-60
                focus:outline-none"
            />
          </div>
          <button 
            type="submit" 
            className="px-6 py-2 bg-white text-black rounded-full hover:bg-opacity-90
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2
              focus:ring-offset-black transition-all duration-200 
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
