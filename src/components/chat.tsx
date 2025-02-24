import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Copy, 
  Send,
  Upload,
  Settings,
  Trash2,
  MessageSquare,
  X,
  Search,
  Download,
  Pencil,
  File,
  User,
  Moon,
  Sun,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'mentor';
  timestamp: Date;
  editable: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
}

const Chat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showActions, setShowActions] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/50',
    bio: 'A brief bio about the user.'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    // Initialize with a default session
    if (sessions.length === 0) {
      const defaultSession: ChatSession = {
        id: Date.now().toString(),
        title: 'New Chat',
        lastMessage: 'Hello! How can I assist you today?',
        timestamp: new Date(),
        messages: [{
          id: Date.now().toString(),
          text: 'Hello! How can I assist you today?',
          sender: 'mentor',
          timestamp: new Date(),
          editable: false
        }]
      };
      setSessions([defaultSession]);
      setCurrentSession(defaultSession.id);
      setMessages(defaultSession.messages);
    }
  }, [sessions.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [messages, input]);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: prompt("Enter a title for the new chat session:", "New Chat") || "New Chat",
      lastMessage: 'Hello! How can I assist you today?',
      timestamp: new Date(),
      messages: [{
        id: Date.now().toString(),
        text: 'Hello! How can I assist you today?',
        sender: 'mentor',
        timestamp: new Date(),
        editable: false
      }]
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession.id);
    setMessages(newSession.messages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: input,
        sender: 'user',
        timestamp: new Date(),
        editable: true
      };
      
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInput('');
      setIsTyping(true);

      // Update session
      setSessions(prev => prev.map(session => 
        session.id === currentSession
          ? {
              ...session,
              lastMessage: input,
              timestamp: new Date(),
              messages: updatedMessages
            }
          : session
      ));

      setTimeout(() => {
        const mentorResponse: Message = {
          id: Date.now().toString(),
          text: "I'm processing your request and will respond shortly.",
          sender: 'mentor',
          timestamp: new Date(),
          editable: false
        };
        const finalMessages = [...updatedMessages, mentorResponse];
        setMessages(finalMessages);
        setSessions(prev => prev.map(session => 
          session.id === currentSession
            ? {
                ...session,
                lastMessage: mentorResponse.text,
                messages: finalMessages
              }
            : session
        ));
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    if (currentSession === sessionId) {
      const remainingSessions = sessions.filter(session => session.id !== sessionId);
      if (remainingSessions.length > 0) {
        setCurrentSession(remainingSessions[0].id);
        setMessages(remainingSessions[0].messages);
      } else {
        createNewSession();
      }
    }
  };

  const filteredSessions = sessions.filter(session => 
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditMessage = (messageId: string, newText: string) => {
    setMessages(prevMessages => prevMessages.map(message =>
      message.id === messageId ? { ...message, text: newText } : message
    ));
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prevMessages => prevMessages.filter(message => message.id !== messageId));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        const newMessage: Message = {
          id: Date.now().toString(),
          text: fileContent,
          sender: 'user',
          timestamp: new Date(),
          editable: true
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
      };
      reader.readAsText(file);
    }
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-[#111111] border-r border-[#333333] flex flex-col`}>
        <div className="p-4 border-b border-[#333333]">
          <button
            onClick={createNewSession}
            className="w-full bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1A1A1A] text-white placeholder-gray-400 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20"
            />
          </div>

          <div className="space-y-2">
            {filteredSessions.map(session => (
              <div
                key={session.id}
                className={`group rounded-lg p-3 cursor-pointer transition-colors ${
                  currentSession === session.id
                    ? 'bg-white bg-opacity-10'
                    : 'hover:bg-white hover:bg-opacity-5'
                }`}
                onClick={() => {
                  setCurrentSession(session.id);
                  setMessages(session.messages);
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{session.title}</h3>
                    <p className="text-gray-400 text-sm truncate">{session.lastMessage}</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="p-1 hover:bg-white hover:bg-opacity-10 rounded-full"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-500 text-xs mt-1">{formatDate(session.timestamp)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-[#333333]">
          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-2 px-4 py-2 text-white hover:bg-white hover:bg-opacity-5 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <nav className="bg-black border-b border-[#333333] sticky top-0 z-10">
          <div className="px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-full hover:bg-[#D3D3D3] hover:bg-opacity-20 transition-colors"
                >
                  {isSidebarOpen ? <X className="w-5 h-5 text-white" /> : <MessageSquare className="w-5 h-5 text-white" />}
                </button>
                <Link to="/dashboard" className="flex items-center">
                  <ArrowLeft className="w-5 h-5 text-white mr-2" />
                  <span className="font-semibold text-white text-lg">LegalMentor</span>
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                  onClick={() => {/* Handle download chat */}}
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
                <button
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex-1 flex flex-col gap-6 p-6">
          <div className="flex-1 bg-[#111111] rounded-xl shadow-xl border border-[#333333] flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  onMouseEnter={() => setShowActions(parseInt(message.id))}
                  onMouseLeave={() => setShowActions(null)}
                >
                  <div className={`relative max-w-[80%] p-4 shadow-lg
                    ${message.sender === 'user' 
                      ? 'bg-white text-black ml-12 rounded-xl rounded-tr-sm' 
                      : 'bg-[#D3D3D3] text-black mr-12 rounded-xl rounded-tl-sm'}`}
                  >
                    {message.editable ? (
                      <textarea
                        value={message.text}
                        onChange={(e) => handleEditMessage(message.id, e.target.value)}
                        onBlur={() => setMessages(prevMessages => prevMessages.map(msg => msg.id === message.id ? { ...msg, editable: false } : msg))}
                        className="w-full bg-transparent text-black resize-none focus:outline-none"
                      />
                    ) : (
                      <ReactMarkdown
                        components={{
                          code: ({ node, inline, className, children, ...props }: CodeProps) => {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={oneDark as { [key: string]: React.CSSProperties }}
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
                            );
                          }
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <p className={`text-xs ${
                        message.sender === 'mentor' 
                          ? 'text-gray-600' 
                          : 'text-black text-opacity-60'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                      {showActions === parseInt(message.id) && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => copyToClipboard(message.text)}
                            className="p-1.5 hover:bg-black hover:bg-opacity-20 rounded-full transition-colors"
                            aria-label="Copy message"
                          >
                            <Copy className="w-4 h-4 text-black" />
                          </button>
                          {message.sender === 'user' && (
                            <>
                              <button 
                                onClick={() => setMessages(prevMessages => prevMessages.map(msg => msg.id === message.id ? { ...msg, editable: true } : msg))}
                                className="p-1.5 hover:bg-black hover:bg-opacity-20 rounded-full transition-colors"
                                aria-label="Edit message"
                              >
                                <Pencil className="w-4 h-4 text-black" />
                              </button>
                              <button 
                                onClick={() => handleDeleteMessage(message.id)}
                                className="p-1.5 hover:bg-black hover:bg-opacity-20 rounded-full transition-colors"
                                aria-label="Delete message"
                              >
                                <Trash2 className="w-4 h-4 text-black" />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#D3D3D3] p-4 rounded-xl shadow-lg mr-12 max-w-[80%]">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-black bg-opacity-40 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-black bg-opacity-40 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-black bg-opacity-40 rounded-full animate-bounce delay-150"></div>
                      </div>
                      <span>Mentor is typing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="bg-[#111111] rounded-xl shadow-xl border border-[#333333] p-4">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                  aria-label="Upload file"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="w-5 h-5 text-white" />
                </button>
                <input
                  type="file"
                  id="file-upload"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <div className="flex-1 flex items-center bg-[#1A1A1A] rounded-xl px-4 py-2">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    rows={1}
                    className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none overflow-hidden focus:outline-none"
                    style={{ minHeight: '40px' }}
                  />
                  <button 
                    type="submit"
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    aria-label="Send message"
                    disabled={!input.trim()}
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#111111] rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Theme Settings */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
                  className="w-full bg-[#1A1A1A] text-white rounded-lg p-2 border border-[#333333] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>

              {/* User Profile */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Profile</label>
                <div className="flex items-center space-x-2">
                  <img src={userProfile.avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-white">{userProfile.name}</p>
                    <p className="text-gray-400">{userProfile.bio}</p>
                  </div>
                </div>
              </div>

              {/* Message Sound */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">Message Sound</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-[#333333] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Export Data */}
              <div>
                <button className="w-full bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg py-2 px-4 transition-colors">
                  Export Chat History
                </button>
              </div>

              {/* Clear Data */}
              <div>
                <button className="w-full bg-red-500 bg-opacity-10 hover:bg-opacity-20 text-red-500 rounded-lg py-2 px-4 transition-colors">
                  Clear All Chats
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#333333]">
              <button
                onClick={() => setShowSettings(false)}
                className="w-full bg-white text-black rounded-lg py-2 px-4 hover:bg-opacity-90 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
