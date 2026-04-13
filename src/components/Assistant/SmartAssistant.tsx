import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { StadiumData } from '@/hooks/useStadiumData';

export function SmartAssistant({ stadiumContext }: { stadiumContext: StadiumData }) {
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([
    { role: 'bot', text: 'Hi! I am your Smart Stadium Assistant. Ask me anything about wait times, food, or washrooms!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg, stadiumContext }),
      });
      const data = await res.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: `Error: ${data.error} - ${data.details}` }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "Network error, please try again." }]);
    }
    setIsTyping(false);
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '400px', width: '100%' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Bot color="var(--primary)" />
        <h3 style={{ fontSize: '1.2rem', marginBottom: 0 }}>Smart Assistant</h3>
      </div>
      
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '0.5rem' }}>
            {m.role === 'bot' && <div style={{ background: 'var(--surface-hover)', padding: '0.5rem', borderRadius: '50%' }}><Bot size={16}/></div>}
            <div style={{
              background: m.role === 'user' ? 'var(--primary)' : 'var(--surface)',
              padding: '0.75rem 1rem',
              borderRadius: '1rem',
              borderBottomRightRadius: m.role === 'user' ? '0' : '1rem',
              borderBottomLeftRadius: m.role === 'bot' ? '0' : '1rem',
              maxWidth: '80%',
              fontSize: '0.9rem'
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: '0.5rem' }}>
             <div style={{ background: 'var(--surface-hover)', padding: '0.5rem', borderRadius: '50%' }}><Bot size={16}/></div>
             <div style={{ background: 'var(--surface)', padding: '0.75rem 1rem', borderRadius: '1rem', borderBottomLeftRadius: '0' }}><Loader2 className="animate-fade-in" size={20} /></div>
          </div>
        )}
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          aria-label="Chat input"
          style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}
          className="focus-ring"
        />
        <button 
          onClick={handleSend}
          disabled={isTyping}
          aria-label="Send message"
          className="focus-ring"
          style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--primary)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
