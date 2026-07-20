import { useState, useRef, useEffect } from 'react';
import axios from '../../api/axios.js';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I am RentMate AI Assistant!\n\nTell me your preferences and I will find the perfect room for you!\n\nFor example:\n• "Mujhe Bangalore mein 8000 budget mein room chahiye"\n• "AC wala PG dhundh do"\n• "Shared flat in Mumbai under 12000"'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await axios.post('/ai/chat', {
        message: userMessage,
        conversationHistory
      });

      // Add AI reply to UI
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.reply
      }]);

      // Update conversation history
      setConversationHistory(res.data.updatedHistory);

    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Sorry, AI service mein kuch problem hai. Please try again!'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    '🏠 Budget under ₹8000',
    '❄️ AC wala room',
    '📍 Bangalore mein',
    '🤝 Shared flat',
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #6C63FF, #4F46E5)',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(108,99,255,0.4)',
          fontSize: '1.5rem', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s'
        }}
        title="Chat with AI"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '100px', right: '24px',
          width: '380px', height: '560px',
          background: 'white', borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column',
          zIndex: 9998, overflow: 'hidden',
          border: '1px solid #E5E7EB'
        }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #6C63FF, #4F46E5)',
            padding: '1rem 1.2rem',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem'
            }}>🤖</div>
            <div>
              <p style={{ color: 'white', fontWeight: '600', margin: 0, fontSize: '0.95rem' }}>
                RentMate AI
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.78rem' }}>
                🟢 Online — Find your perfect room
              </p>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto',
            padding: '1rem', display: 'flex',
            flexDirection: 'column', gap: '12px'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: '#F5F3FF', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9rem', marginRight: '8px',
                    flexShrink: 0, marginTop: '4px'
                  }}>🤖</div>
                )}
                <div style={{
                  maxWidth: '75%',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #6C63FF, #4F46E5)'
                    : '#F8F9FA',
                  color: msg.role === 'user' ? 'white' : '#1a1a2e',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user'
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: '#F5F3FF', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem'
                }}>🤖</div>
                <div style={{
                  background: '#F8F9FA', padding: '10px 14px',
                  borderRadius: '18px 18px 18px 4px',
                  display: 'flex', gap: '4px', alignItems: 'center'
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: '#6C63FF',
                      animation: `bounce 1s infinite ${i * 0.2}s`
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div style={{
              padding: '0 1rem 0.5rem',
              display: 'flex', gap: '6px', flexWrap: 'wrap'
            }}>
              {quickQuestions.map((q, i) => (
                <button key={i} onClick={() => setInput(q)} style={{
                  background: '#F5F3FF', color: '#6C63FF',
                  border: '1px solid #DDD6FE', borderRadius: '20px',
                  padding: '4px 10px', fontSize: '0.78rem',
                  cursor: 'pointer', fontWeight: '500'
                }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid #F0F0F0',
            display: 'flex', gap: '8px'
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your preference..."
              disabled={loading}
              style={{
                flex: 1, padding: '10px 14px',
                borderRadius: '20px',
                border: '1.5px solid #E5E7EB',
                outline: 'none', fontSize: '0.875rem',
                color: '#1a1a2e', background: 'white',
                boxSizing: 'border-box'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: '42px', height: '42px',
                borderRadius: '50%',
                background: input.trim()
                  ? 'linear-gradient(135deg, #6C63FF, #4F46E5)'
                  : '#E5E7EB',
                border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
                fontSize: '1rem', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
};

export default AIChatbot;