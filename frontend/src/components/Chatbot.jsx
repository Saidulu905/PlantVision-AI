import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import aiService from '../services/aiService';
import { MessageSquare, X, Send, Leaf, Sparkles, AlertCircle, Compass, HelpCircle } from 'lucide-react';

const Chatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am your **PlantVision AI Botanical Assistant**. 🌿 How can I help you grow your perfect garden today?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Suggested questions / chips
  const suggestionChips = [
    { label: 'How to water Aloe Vera?', icon: Leaf },
    { label: 'Why are leaves turning yellow?', icon: AlertCircle },
    { label: 'English Lavender sun needs?', icon: Compass },
    { label: 'What is Snake Plant benefits?', icon: Sparkles }
  ];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Auto-focus input when opened
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen]);

  // If user is not authenticated, do not render chatbot at all
  if (!user) return null;

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Clear inputs and errors
    if (!textToSend) setInputText('');
    setError(null);

    // Append user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await aiService.chat(text);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.response,
        timestamp: new Date(response.timestamp)
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chatbot API request failed:', err);
      setError('Sorry, I lost my connection to the botanical brain. Please try again!');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Safe renderer to convert simple markdown format (**, *, \n\n) to structured bullet points and paragraphs
  const renderMessageContent = (content) => {
    // Process markdown highlights (e.g. **bold**)
    let htmlText = content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-400 font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-emerald-300 font-medium">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-900 px-1.5 py-0.5 rounded text-amber-400">$1</code>');

    // Split by paragraphs
    const paragraphs = htmlText.split('\n\n');

    return paragraphs.map((p, index) => {
      // Check if this paragraph is a list block
      if (p.trim().startsWith('*') || p.trim().startsWith('-')) {
        const listItems = p
          .split('\n')
          .map(item => item.replace(/^[\s*-]+/, '').trim())
          .filter(Boolean);
        
        return (
          <ul key={index} className="list-disc list-inside space-y-1 my-2 border-l border-emerald-900/50 pl-3">
            {listItems.map((li, i) => (
              <li key={i} className="text-sm text-slate-200" dangerouslySetInnerHTML={{ __html: li }} />
            ))}
          </ul>
        );
      }

      // Check if it's numbered items
      if (/^\d+\./.test(p.trim())) {
        const listItems = p
          .split('\n')
          .filter(Boolean);
        
        return (
          <ol key={index} className="list-decimal list-inside space-y-1.5 my-2 pl-2">
            {listItems.map((li, i) => {
              const cleanedLi = li.replace(/^\d+\.\s*/, '').trim();
              return (
                <li key={i} className="text-sm text-slate-200" dangerouslySetInnerHTML={{ __html: cleanedLi }} />
              );
            })}
          </ol>
        );
      }

      return (
        <p
          key={index}
          className="text-sm leading-relaxed text-slate-200"
          dangerouslySetInnerHTML={{ __html: p.replace(/\n/g, '<br />') }}
        />
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-inter">
      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="w-[360px] md:w-[420px] h-[550px] mb-4 flex flex-col rounded-2xl border border-slate-800 bg-slate-950/95 shadow-2xl backdrop-blur-md transition-all duration-300 transform scale-100 origin-bottom-right">
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-slate-800/80 bg-gradient-to-r from-emerald-950/45 to-slate-950 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 relative">
                <Leaf className="w-5 h-5 animate-pulse" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-md"></span>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-400 flex items-center gap-1.5 text-sm">
                  PlantVision Botanist <Sparkles className="w-3.5 h-3.5" />
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">Horticultural & Diagnostics Expert</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Onboarding suggestions / chips */}
          {messages.length === 1 && (
            <div className="p-3 bg-emerald-950/15 border-b border-slate-800/50">
              <p className="text-[11px] text-emerald-500 font-semibold mb-2 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" /> Quick suggestions:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestionChips.map((chip, i) => {
                  const ChipIcon = chip.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(chip.label)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-slate-900 hover:bg-emerald-950/40 text-slate-300 hover:text-emerald-400 border border-slate-800 hover:border-emerald-800/40 transition-all duration-300"
                    >
                      <ChipIcon className="w-3 h-3 text-emerald-500" />
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Message History Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div key={msg.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                    {isBot && (
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                        <Leaf className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl text-xs space-y-1.5 shadow-md ${
                        isBot
                          ? 'bg-slate-900/90 text-slate-200 border border-slate-800/80 rounded-tl-none'
                          : 'bg-emerald-600 text-white rounded-tr-none'
                      }`}
                    >
                      {isBot ? renderMessageContent(msg.text) : <p className="leading-relaxed">{msg.text}</p>}
                      <div
                        className={`text-[9px] text-right mt-1.5 ${
                          isBot ? 'text-slate-500' : 'text-emerald-200'
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Premium typing micro-animation */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Leaf className="w-3.5 h-3.5 animate-bounce" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 rounded-tl-none flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-[bounce_1.4s_infinite_0ms]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-[bounce_1.4s_infinite_200ms]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-[bounce_1.4s_infinite_400ms]"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/35 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Box */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-2.5 rounded-b-2xl">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about watering, care tips, plants..."
              disabled={isTyping}
              className="flex-grow px-4 py-2.5 text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none rounded-xl text-slate-100 placeholder-slate-500 transition-all disabled:opacity-50"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isTyping}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:text-slate-900 rounded-full flex items-center justify-center shadow-lg hover:shadow-emerald-500/25 relative group active:scale-95 transition-all duration-300"
      >
        <span className="absolute -inset-1 bg-emerald-400 rounded-full animate-ping opacity-[0.12] pointer-events-none"></span>
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default Chatbot;
