import React, { useState, useEffect, useRef, useContext} from "react";
import { X, Send, Sparkles, BotIcon, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ShopContext } from "../../Context/ShopContext.jsx";

const {API_BASE_URL} = useContext(ShopContext);


const ProductBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! ✨ I'm your **Atelier** assistant. Looking for a Ring, Earings, or Bracelets? Ask me anything!" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "⚠️ Trouble connecting to server." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-0 z-[9999] font-sans flex items-end justify-end">
      {isOpen ? (
        <div className="mr-6 bg-white w-[350px] h-[500px] shadow-2xl rounded-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-700 to-red-500 p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg"><Sparkles className="w-5 h-5" /></div>
              <div>
                <p className="font-bold text-sm leading-none">Atelier AI</p>
                <p className="text-[10px] text-red-100 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setMessages([{ role: "bot", text: "Chat cleared! ✨" }])} className="hover:bg-white/10 p-2 rounded-full transition-all active:scale-90">
                <RotateCcw className="w-4 h-4 text-red-100" />
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
          
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl shadow-sm text-sm max-w-[85%] ${m.role === 'user' ? 'bg-red-600 text-white rounded-tr-none' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'}`}>
                  <div className="prose prose-sm max-w-none prose-p:leading-relaxed">
                    <ReactMarkdown components={{ strong: ({...props}) => <span className="font-bold text-red-800" {...props} /> }}>
                      {m.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && <div className="flex gap-1 p-3 bg-white w-12 rounded-full shadow-sm"><span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span></div>}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t">
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-xl focus-within:ring-2 focus-within:ring-red-500/20">
              <input className="flex-1 bg-transparent outline-none text-sm px-2" placeholder="Ask about rings..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} />
              <button onClick={handleSend} disabled={!input.trim()} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      ) : (
        /* Slide-out Sidebar Button */
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-20 h-16 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-l-2xl shadow-2xl transition-all duration-500 transform translate-x-12 hover:translate-x-0 active:scale-95 pl-2"
        >
          <div className="absolute top-2 left-2 flex h-3 w-3"><span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative h-3 w-3 rounded-full bg-green-500 border border-white"></span></div>
          <div className="flex items-center gap-2 transition-transform duration-300 group-hover:-translate-x-2">
            <BotIcon className="w-8 h-8 fill-white/10" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-xs font-bold opacity-0 group-hover:opacity-100">Chat AI</span>
          </div>
          {/* Tooltip */}
          <span className="absolute right-full mr-4 px-4 py-2 bg-gradient-to-r from-red-900 to-red-700 text-white text-[11px] font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-xl min-w-max border border-white/10">
            Need Help! 🎁
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2.5 h-2.5 bg-red-700 rotate-45"></div>
          </span>
        </button>
      )}
    </div>
  );
};

export default ProductBot;