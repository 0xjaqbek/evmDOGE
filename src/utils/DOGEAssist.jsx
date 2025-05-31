// src/components/DOGEAssist.jsx
import React, { useState, useEffect, useRef } from 'react';
import './DOGEAssist.css';

const DOGEAssist = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [typingComplete, setTypingComplete] = useState({});

  const messagesEndRef = useRef(null);
  const chatContentRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Initial setup
  useEffect(() => {
    const openingMessage = {
      text: "🐕 Woof! I'm DOGEAssist, your friendly AI assistant for My Company D.O.G.E. platform. I can help you navigate the platform, answer questions about features, and provide guidance on blockchain concepts. How can I assist you today?",
      role: 'assistant',
      timestamp: new Date().toISOString(),
      id: 'intro-message'
    };
    setMessages([openingMessage]);
    setTypingComplete({ 'intro-message': true });
  }, []);

  const scrollToBottom = () => {
    if (chatContentRef.current) chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    const timeoutId = setTimeout(() => scrollToBottom(), 100);
    return () => clearTimeout(timeoutId);
  }, [messages, typingComplete]);

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen]);

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    const messageId = `msg-${Date.now()}`;
    const userMessage = {
      text: trimmedInput,
      role: 'user',
      timestamp: new Date().toISOString(),
      id: `user-${messageId}`
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);
    setTypingComplete(prev => ({ ...prev, [`user-${messageId}`]: true }));

    try {
      // In a real implementation, this would call your backend API
      // For now, we'll simulate a response
      setTimeout(() => {
        const mockResponses = {
          wallet: "You can connect your Solana wallet by clicking the 'Join Presale' button in the navigation. We support Phantom, Solflare, Torus, Ledger, Coinbase, Solong, MathWallet, and Coin98 wallets. After connecting, your wallet address will be visible in the navigation bar. 🐕",
          feature: "My Company D.O.G.E. offers several key features: AI-powered paperwork automation, decentralized cash flow tracking, blockchain-based trust and transparency, and smart contract integration. Which feature would you like to know more about? 📝",
          security: "Security is a top priority! All transactions occur on the Solana blockchain with cryptographic security. We never store your private keys or seed phrases, and all wallet interactions require your explicit approval. Your documents are stored securely with encryption and proper access controls. 🔒",
          automation: "Our AI automation analyzes documents, extracts key information, and completes paperwork automatically. It can transform hours of manual data entry into seconds of automated processing. This helps eliminate bureaucratic red tape and lets you focus on what matters most! ⚡️"
        };

        // Determine which mock response to use based on user input
        let responseText = "I'm here to help with questions about the My Company D.O.G.E. platform! You can ask about our blockchain features, wallet integration, paperwork automation, or any other platform functionality. If you have a specific technical issue, you can also email support@mycompanydoge.com for assistance. 🐕";
        
        const input = userMessage.text.toLowerCase();
        if (input.includes('wallet') || input.includes('connect') || input.includes('phantom') || input.includes('solflare')) {
          responseText = mockResponses.wallet;
        } else if (input.includes('feature') || input.includes('platform') || input.includes('offer') || input.includes('what can')) {
          responseText = mockResponses.feature;
        } else if (input.includes('security') || input.includes('secure') || input.includes('safe')) {
          responseText = mockResponses.security;
        } else if (input.includes('automation') || input.includes('ai') || input.includes('paperwork')) {
          responseText = mockResponses.automation;
        }

        const botMessage = {
          text: responseText,
          role: 'assistant',
          timestamp: new Date().toISOString(),
          id: `assistant-${messageId}`
        };

        setMessages(prev => [...prev, botMessage]);
        setTypingComplete(prev => ({ ...prev, [`assistant-${messageId}`]: false }));
        setIsLoading(false);
      }, 1000);

      // In a real implementation, you would make an API call like this:
      /*
      const response = await fetch('/api/doge-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text, history: messages.slice(-6) }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      const botMessage = {
        text: data.response,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        id: `assistant-${messageId}`
      };

      setMessages(prev => [...prev, botMessage]);
      setTypingComplete(prev => ({ ...prev, [`assistant-${messageId}`]: false }));
      setIsLoading(false);
      */
    } catch (err) {
      console.error('Error sending message:', err);
      if (err.name !== 'AbortError') {
        setError('Sorry, I encountered an error. Please try again.');
      }
      setIsLoading(false);
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      setError('Request canceled. How can I help you?');
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleTypingComplete = (messageId) => {
    setTypingComplete(prev => ({ ...prev, [messageId]: true }));
    setTimeout(scrollToBottom, 100);
  };

  const formatText = (text, messageId, isTyping) => {
    if (!text) return '';
    
    // For user messages or completed bot messages, render normally
    if (!isTyping) {
      return text.split('```').map((segment, index) => {
        if (index % 2 === 1) {
          const codeLines = segment.split('\n');
          const language = codeLines[0].trim();
          const code = codeLines.slice(1).join('\n');
          return <pre key={index}><code className={language ? `language-${language}` : ''}>{code}</code></pre>;
        } else {
          return <div key={index}>{segment.split('`').map((part, idx) => 
            idx % 2 === 1 ? <code key={idx}>{part}</code> : <span key={idx}>{part}</span>
          )}</div>;
        }
      });
    }
    
    // For bot messages that need typing animation
    return (
      <TypedText 
        text={text} 
        wordsPerChunk={Math.floor(Math.random() * 4) + 2} // Random 2-5 words per chunk
        typingSpeed={40} 
        onComplete={() => handleTypingComplete(messageId)}
      />
    );
  };

  // TypedText component embedded for simplicity
  const TypedText = ({ text, typingSpeed = 40, wordsPerChunk = 3, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
      setDisplayedText('');
      setIsComplete(false);
      
      if (!text) return;
      
      const words = text.split(' ');
      const chunks = [];
      
      for (let i = 0; i < words.length; i += wordsPerChunk) {
        const actualChunkSize = typeof wordsPerChunk === 'number' 
          ? wordsPerChunk 
          : Math.floor(Math.random() * 4) + 2;
        
        chunks.push(words.slice(i, i + actualChunkSize).join(' '));
      }
      
      let currentIndex = 0;
      const totalChunks = chunks.length;
      
      const calculatedDelay = Math.min(5000 / totalChunks, typingSpeed);

      const typingInterval = setInterval(() => {
        if (currentIndex < totalChunks) {
          setDisplayedText(prev => {
            const newText = prev ? prev + ' ' + chunks[currentIndex] : chunks[currentIndex];
            return newText.trim();
          });
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsComplete(true);
          if (onComplete) onComplete();
        }
      }, calculatedDelay);

      return () => clearInterval(typingInterval);
    }, [text, typingSpeed, wordsPerChunk, onComplete]);

    return (
      <div className="typed-text">
        {displayedText}
        {!isComplete && <span className="cursor">|</span>}
      </div>
    );
  };

  const chatContainerClass = `doge-chat-container ${isChatOpen ? 'open' : ''} ${isFullScreen ? 'fullscreen' : ''}`;

  return (
    <div className={chatContainerClass}>
      {!isChatOpen ? (
        <button className="doge-chat-button" onClick={toggleChat}>
          <span className="doge-chat-icon">🐕</span>
          <span className="doge-chat-label">DOGEAssist</span>
        </button>
      ) : (
        <div className="doge-chat-box">
          <div className="doge-chat-header">
            <h3>DOGEAssist</h3>
            <div className="doge-header-controls">
              <button className="doge-control-button" onClick={toggleFullScreen}>
                {isFullScreen ? '↙' : '↗'}
              </button>
              <button className="doge-control-button" onClick={toggleChat}>×</button>
            </div>
          </div>
          
          <div className="doge-chat-content" ref={chatContentRef}>
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`doge-message ${message.role === 'user' ? 'doge-user-message' : 'doge-assistant-message'}`}
              >
                <div className="doge-message-content">
                  {formatText(
                    message.text, 
                    message.id, 
                    message.role === 'assistant' && !typingComplete[message.id]
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="doge-message doge-assistant-message">
                <div className="doge-message-content">
                  <div className="doge-typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <button onClick={handleCancelRequest} className="doge-cancel-button">Cancel</button>
                </div>
              </div>
            )}

            {error && (
              <div className="doge-error-message">
                {error}
              </div>
            )}
            
            <div ref={messagesEndRef}></div>
          </div>
          
          <form onSubmit={handleSubmit} className="doge-input-area">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Ask DOGEAssist something..."
              className="doge-message-input"
              ref={inputRef}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="doge-send-button" 
              disabled={isLoading || !inputValue.trim()}
            >
              Send
            </button>
          </form>
          
          <div className="doge-chat-footer">
            <p>DOGEAssist by My Company D.O.G.E.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DOGEAssist;