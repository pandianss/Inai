import React, { useState, useRef, useEffect } from 'react';
import '../styles/design-system.css';

/**
 * ChatInterface Component
 * Implements "Nostalgic Bharat Modernism" design with:
 * - Sari-border sender bubbles
 * - Sandalwood glass receiver bubbles
 * - Vernacular-first language display
 * - Haptic click feedback
 */

const ChatInterface = () => {
  const [view, setView] = useState('list'); // 'list' or 'chat'
  const [activeChat, setActiveChat] = useState(null);

  // Mock Data for Chat List
  const [chats, setChats] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      avatar: 'R',
      lastMessage: 'Yes, I need to buy some vegetables...',
      time: '04:46 pm',
      unread: 0,
      online: true
    },
    {
      id: 2,
      name: 'Priya Sharma',
      avatar: 'P',
      lastMessage: 'Can we meet tomorrow?',
      time: '02:30 pm',
      unread: 2,
      online: false
    },
    {
      id: 3,
      name: 'Amit Singh',
      avatar: 'A',
      lastMessage: 'Photo sent',
      time: 'Yesterday',
      unread: 0,
      online: true
    }
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Namaste! How are you?',
      sender: 'receiver',
      timestamp: new Date(Date.now() - 300000),
      language: 'en'
    },
    {
      id: 2,
      text: 'I am doing well, thanks! How about you?',
      sender: 'sender',
      timestamp: new Date(Date.now() - 240000),
      language: 'en'
    },
    {
      id: 3,
      text: 'Are you going to the market tomorrow?',
      sender: 'receiver',
      timestamp: new Date(Date.now() - 180000),
      language: 'en'
    },
    {
      id: 4,
      text: 'Yes, I need to buy some vegetables. Do you need anything?',
      sender: 'sender',
      timestamp: new Date(Date.now() - 120000),
      language: 'en'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (view === 'chat') {
      scrollToBottom();
    }
  }, [messages, view]);

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    setView('chat');
  };

  const handleBack = () => {
    setView('list');
    setActiveChat(null);
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'sender',
      timestamp: new Date(),
      language: 'hi'
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate receiver typing
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responses = ['Great!', 'Okay, I understand.', 'Thank you!', 'Yes, absolutely.'];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: randomResponse,
          sender: 'receiver',
          timestamp: new Date(),
          language: 'en'
        }]);
      }, 1500);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('hi-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (view === 'list') {
    return (
      <div className="chat-list-container">
        <div className="background-rangoli rangoli-pattern"></div>

        <header className="chat-list-header glass-panel">
          <div className="header-content">
            <h2 className="text-devanagari">Chats</h2>
            <div className="header-actions">
              <button className="icon-btn">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="icon-btn">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <div className="chat-list">
          {chats.map(chat => (
            <div
              key={chat.id}
              className="chat-item glass-panel-light haptic-click"
              onClick={() => handleChatSelect(chat)}
            >
              <div className="avatar-container">
                <div className="avatar-circle">{chat.avatar}</div>
                {chat.online && <div className="online-indicator"></div>}
              </div>
              <div className="chat-info">
                <div className="chat-header-row">
                  <h3 className="text-devanagari">{chat.name}</h3>
                  <span className="timestamp">{chat.time}</span>
                </div>
                <div className="chat-preview-row">
                  <p className="last-message">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="unread-badge">{chat.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="fab-new-chat haptic-click">
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <style jsx>{`
          .chat-list-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            position: relative;
            padding-bottom: 80px; /* For bottom nav */
          }

          .chat-list-header {
            padding: var(--space-md) var(--space-lg);
            background: var(--gradient-primary);
            color: white;
            z-index: 10;
          }

          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .header-actions {
            display: flex;
            gap: var(--space-md);
          }

          .chat-list {
            padding: var(--space-md);
            display: flex;
            flex-direction: column;
            gap: var(--space-md);
            overflow-y: auto;
          }

          .chat-item {
            display: flex;
            align-items: center;
            gap: var(--space-md);
            padding: var(--space-md);
            transition: transform 0.2s;
            cursor: pointer;
          }

          .chat-item:active {
            transform: scale(0.98);
          }

          .avatar-container {
            position: relative;
          }

          .avatar-circle {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--gradient-accent);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: var(--font-size-lg);
          }

          .online-indicator {
            position: absolute;
            bottom: 2px;
            right: 2px;
            width: 12px;
            height: 12px;
            background: var(--accent-neem);
            border: 2px solid white;
            border-radius: 50%;
          }

          .chat-info {
            flex: 1;
            min-width: 0;
          }

          .chat-header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
          }

          .chat-header-row h3 {
            font-size: var(--font-size-base);
            color: var(--primary-dark);
            margin: 0;
          }

          .timestamp {
            font-size: var(--font-size-xs);
            color: rgba(0,0,0,0.5);
          }

          .chat-preview-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .last-message {
            margin: 0;
            font-size: var(--font-size-sm);
            color: rgba(0,0,0,0.6);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 200px;
          }

          .unread-badge {
            background: var(--accent-marigold);
            color: white;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 10px;
            min-width: 16px;
            text-align: center;
          }

          .fab-new-chat {
            position: fixed;
            bottom: 90px;
            right: var(--space-lg);
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: var(--gradient-accent);
            color: white;
            border: none;
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 20;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="background-rangoli rangoli-pattern"></div>

      {/* Header */}
      <header className="chat-header glass-panel">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-md">
            <button className="icon-btn" onClick={handleBack}>
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="avatar-circle">
              {activeChat ? activeChat.avatar : 'R'}
            </div>
            <div>
              <h2 className="text-devanagari" style={{ color: 'white', fontSize: 'var(--font-size-lg)' }}>
                {activeChat ? activeChat.name : 'Rajesh Kumar'}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--font-size-xs)', margin: 0 }}>
                Online
              </p>
            </div>
          </div>
          <div className="flex gap-md">
            <button className="icon-btn haptic-click">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button className="icon-btn haptic-click">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="icon-btn haptic-click">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </header>



      {/* Messages Container */}
      <div className="messages-container">
        <div className="messages-list">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-wrapper ${message.sender === 'sender' ? 'message-sent' : 'message-received'}`}
            >
              <div className={`chat-bubble chat-bubble-${message.sender} text-devanagari`}>
                <p className="message-text">{message.text}</p>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message-wrapper message-received">
              <div className="chat-bubble chat-bubble-receiver">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="chat-input-container glass-panel-light">
        <button className="icon-btn haptic-click" aria-label="Attach File">
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        <input
          ref={inputRef}
          type="text"
          className="input chat-input text-devanagari"
          placeholder="Write a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <button className="icon-btn haptic-click" aria-label="Voice Message">
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

        <button
          className="btn btn-primary haptic-click send-btn"
          onClick={handleSend}
          disabled={inputText.trim() === ''}
        >
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 100vw;
          position: relative;
          overflow: hidden;
        }

        .chat-header {
          padding: var(--space-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          z-index: 10;
        }

        .avatar {
          position: relative;
        }

        .avatar-circle {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          background: var(--gradient-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: var(--font-size-lg);
          color: white;
        }

        .status-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid var(--primary-dark);
        }

        .status-online {
          background: var(--accent-neem);
          animation: pulse-status 2s ease-in-out infinite;
        }

        @keyframes pulse-status {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .status-text {
          font-size: var(--font-size-sm);
          color: rgba(255, 255, 255, 0.7);
        }

        .icon-btn {
          background: transparent;
          border: none;
          color: white;
          padding: var(--space-sm);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: background var(--transition-base);
        }

        .icon-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-lg);
          position: relative;
          z-index: 1;
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .message-wrapper {
          display: flex;
          width: 100%;
        }

        .message-sent {
          justify-content: flex-end;
        }

        .message-received {
          justify-content: flex-start;
        }

        .message-text {
          margin: 0 0 var(--space-xs) 0;
          font-size: var(--font-size-base);
        }

        .message-time {
          font-size: var(--font-size-xs);
          opacity: 0.7;
          float: right;
          margin-left: var(--space-md);
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: var(--space-sm) 0;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary-dark);
          opacity: 0.4;
          animation: typing-bounce 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }

        .chat-input-container {
          padding: var(--space-lg);
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          z-index: 10;
        }

        .chat-input {
          flex: 1;
          margin: 0;
        }

        .send-btn {
          padding: var(--space-md);
          min-width: auto;
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Scrollbar Styling */
        .messages-container::-webkit-scrollbar {
          width: 8px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: rgba(26, 35, 126, 0.1);
          border-radius: var(--radius-sm);
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: var(--accent-marigold);
          border-radius: var(--radius-sm);
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: #FF8800;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .chat-header {
            padding: var(--space-md);
          }

          .chat-input-container {
            padding: var(--space-md);
            gap: var(--space-xs);
          }

          .messages-container {
            padding: var(--space-md);
          }
        }

        @media (max-width: 480px) {
          .avatar-circle {
            width: 40px;
            height: 40px;
            font-size: var(--font-size-base);
          }

          .chat-bubble {
            max-width: 85%;
          }

          .icon-btn {
            padding: var(--space-xs);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
