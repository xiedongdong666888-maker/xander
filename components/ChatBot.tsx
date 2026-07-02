
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { chatWithPortfolioAI } from '../services/geminiService';
import { PageState } from '../types';

interface ChatBotProps {
  currentPage: PageState;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: '你好！我是谢东东的数字分身。对我的作品或设计理念有什么好奇的吗？' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Author Avatar URL (cached from About page)
  const avatarUrl = "https://i.postimg.cc/Xqzhcyb2/wei-xin-tu-pian-20260208184723-504-10.jpg";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await chatWithPortfolioAI(userMsg, `用户正在浏览 ${currentPage} 页面。`);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-rajdhani">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_25px_rgba(41,151,255,0.3)] border border-white/20 overflow-hidden group
          ${isOpen ? 'bg-black scale-90' : 'bg-black hover:scale-105'}
        `}
      >
        {isOpen ? (
          <X size={24} className="text-neon-cyan" />
        ) : (
          <>
            <img 
              src={avatarUrl} 
              alt="Chat" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            {/* Online Status Dot */}
            <span className="absolute bottom-1 right-3 w-3 h-3 bg-green-500 border-2 border-black rounded-full animate-pulse"></span>
            
            {/* Hover Text */}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] font-orbitron text-white">CHAT</span>
            </div>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 h-[550px] bg-[#050508]/95 backdrop-blur-xl rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-5 duration-300 origin-bottom-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 p-4 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30 relative">
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="block font-orbitron text-sm font-bold text-white tracking-wider">谢东东</span>
                <span className="flex items-center gap-1 text-[10px] text-neon-cyan font-orbitron">
                  <Sparkles size={8} /> AI DIGITAL CLONE
                </span>
              </div>
            </div>
            <div className="flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-[pulse_2s_infinite]"></span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Name Label */}
                  <span className="text-[10px] text-gray-500 font-orbitron mb-1 px-1">
                    {msg.role === 'user' ? 'VISITOR' : 'XIE DONGDONG'}
                  </span>
                  
                  {/* Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm ${
                      msg.role === 'user'
                        ? 'bg-neon-cyan text-black rounded-tr-none font-medium'
                        : 'bg-white/10 text-gray-100 border border-white/5 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                 <div className="flex flex-col items-start max-w-[85%]">
                    <span className="text-[10px] text-gray-500 font-orbitron mb-1 px-1">XIE DONGDONG</span>
                    <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center h-10 border border-white/5">
                      <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-[bounce_1s_infinite_0ms]"></span>
                      <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-[bounce_1s_infinite_200ms]"></span>
                      <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-[bounce_1s_infinite_400ms]"></span>
                    </div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl focus-within:border-neon-cyan/50 focus-within:bg-white/10 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="发送消息..."
                className="flex-1 bg-transparent px-4 py-3 text-sm text-white focus:outline-none placeholder-gray-500 font-rajdhani"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 mr-2 text-neon-cyan hover:text-white hover:bg-neon-cyan/20 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
