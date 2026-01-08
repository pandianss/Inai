import React, { useState, useRef, useEffect } from 'react';
import PollComponent, { CreatePollModal } from './PollComponent';
import FormComponent, { CreateFormModal } from './FormComponent';
import '../styles/design-system.css';

/**
 * GroupChatInterface Component
 * Group chat with time-based message controls
 * Supports official groups with off-hours restrictions
 */

const GroupChatInterface = ({ group, userData, onLeaveGroup }) => {
  // Use userData for current user identity, fallback to 'current_user' if not provided
  const currentUserId = userData?.id || 'current_user';
  const currentUserName = userData?.name || 'You';

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello everyone! Today\'s meeting is at 3 PM.',
      sender: { id: 'user1', name: 'Rajesh Kumar' },
      timestamp: new Date(Date.now() - 3600000),
      language: 'en'
    },
    {
      id: 2,
      text: 'Thanks! I will be on time.',
      sender: { id: 'user2', name: 'Priya Sharma' },
      timestamp: new Date(Date.now() - 3000000),
      language: 'en'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [isMessagingAllowed, setIsMessagingAllowed] = useState(true);
  const [timeUntilOpen, setTimeUntilOpen] = useState(null);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [userVotes, setUserVotes] = useState({}); // { pollId: optionId }
  const [userResponses, setUserResponses] = useState({}); // { formId: responseData }
  const messagesEndRef = useRef(null);

  // Check if messaging is currently allowed based on time controls
  useEffect(() => {
    if (!group.timeControls?.enabled) {
      setIsMessagingAllowed(true);
      return;
    }

    const checkMessagingStatus = () => {
      const now = new Date();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
      const currentTime = now.toTimeString().substring(0, 5); // HH:MM

      const isDayAllowed = group.timeControls.days.includes(currentDay);
      const isTimeAllowed = currentTime >= group.timeControls.startTime &&
        currentTime <= group.timeControls.endTime;

      const allowed = isDayAllowed && isTimeAllowed;
      setIsMessagingAllowed(allowed);

      if (!allowed) {
        calculateTimeUntilOpen(now, group.timeControls);
      }
    };

    checkMessagingStatus();
    const interval = setInterval(checkMessagingStatus, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [group.timeControls]);

  const calculateTimeUntilOpen = (now, controls) => {
    // Calculate next available time
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMin] = controls.startTime.split(':').map(Number);
    const startTimeMinutes = startHour * 60 + startMin;

    // If today is allowed and we're before start time
    const todayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    if (controls.days.includes(todayName) && currentTime < startTimeMinutes) {
      const minutesUntil = startTimeMinutes - currentTime;
      setTimeUntilOpen({
        hours: Math.floor(minutesUntil / 60),
        minutes: minutesUntil % 60,
        message: `Group opens at ${controls.startTime} today`
      });
    } else {
      // Find next allowed day
      setTimeUntilOpen({
        hours: 0,
        minutes: 0,
        message: `Group opens on next working day at ${controls.startTime}`
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    // Check for emergency keywords
    const emergencyKeywords = ['emergency', 'urgent', 'critical', 'danger', 'help'];
    const isEmergency = emergencyKeywords.some(keyword =>
      inputText.toLowerCase().includes(keyword)
    );

    if (!isMessagingAllowed && !isEmergency) {
      // Save as draft
      setDraftMessage(inputText);
      alert('Messages are currently disabled. Your message has been saved as a draft and will be sent when the group reopens.');
      setInputText('');
      return;
    }

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: { id: currentUserId, name: currentUserName },
      timestamp: new Date(),
      language: 'en',
      isEmergency
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    setDraftMessage('');
  };

  const handleCreatePoll = (pollData) => {
    const newPoll = {
      id: `poll-${Date.now()}`,
      type: 'poll',
      question: pollData.question,
      options: pollData.options.map((opt, i) => ({ id: i, text: opt, votes: 0 })),
      status: 'active',
      sender: { id: currentUserId, name: currentUserName },
      timestamp: new Date()
    };
    setMessages([...messages, newPoll]);
    setShowPollModal(false);
  };

  const handleVote = (pollId, optionId) => {
    // Optimistic update
    setMessages(msgs => msgs.map(msg => {
      if (msg.id === pollId) {
        return {
          ...msg,
          options: msg.options.map(opt => ({
            ...opt,
            votes: opt.id === optionId ? opt.votes + 1 : opt.votes
          }))
        };
      }
      return msg;
    }));
    setUserVotes({ ...userVotes, [pollId]: optionId });
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const handleLeaveGroupClick = () => {
    // Check governance rules for Official groups
    if (group.type === 'official') {
      const isAdmin = group.admins?.includes(currentUserId);
      const adminCount = group.admins?.length || 0;

      if (isAdmin && adminCount === 1) {
        alert('Governance Restriction: You are the only admin of this Official Group. You must assign another admin before leaving.');
        return;
      }
    }

    if (window.confirm('Are you sure you want to leave this group?')) {
      onLeaveGroup();
    }
  };

  const handleCreateForm = (formData) => {
    const newForm = {
      id: `form-${Date.now()}`,
      type: 'form',
      title: formData.title,
      description: formData.description,
      fields: formData.fields,
      responseCount: 0,
      sender: { id: currentUserId, name: currentUserName },
      timestamp: new Date()
    };
    setMessages([...messages, newForm]);
    setShowFormModal(false);
  };

  const handleFormSubmit = (formId, responseData) => {
    // Optimistic update
    setMessages(msgs => msgs.map(msg => {
      if (msg.id === formId) {
        return { ...msg, responseCount: msg.responseCount + 1 };
      }
      return msg;
    }));
    setUserResponses({ ...userResponses, [formId]: responseData });
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

  const loadDraft = () => {
    setInputText(draftMessage);
    setDraftMessage('');
  };

  return (
    <div className="group-chat-container">
      <div className="background-rangoli rangoli-pattern"></div>

      {/* Group Header */}
      <header className="group-header glass-panel">
        <div className="flex items-center gap-md">
          <div className="group-avatar">
            <span className="group-icon">{group.icon || '👥'}</span>
            {!isMessagingAllowed && (
              <div className="status-indicator status-disabled">🌙</div>
            )}
          </div>
          <div className="flex-col">
            <h3 className="text-devanagari">{group.name}</h3>
            <span className="group-meta">
              {group.memberCount} members • {group.type}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-sm">
          <button className="icon-btn haptic-click" aria-label="Group Info" onClick={handleLeaveGroupClick} title="Leave Group">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Time Control Banner */}
      {!isMessagingAllowed && (
        <div className="time-control-banner">
          <div className="banner-content">
            <svg className="icon icon-lg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
            </svg>
            <div>
              <strong className="text-devanagari">Messages are disabled</strong>
              <p>{timeUntilOpen?.message}</p>
              {timeUntilOpen && timeUntilOpen.hours > 0 && (
                <div className="countdown">
                  ⏰ Opens in {timeUntilOpen.hours}h {timeUntilOpen.minutes}m
                </div>
              )}
            </div>
          </div>
          <div className="banner-schedule">
            <small>
              Active: {group.timeControls.days.map(d => d.substring(0, 3)).join(', ')} •
              {group.timeControls.startTime} - {group.timeControls.endTime}
            </small>
          </div>
        </div>
      )}

      {/* Draft Message Banner */}
      {draftMessage && (
        <div className="draft-banner">
          <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.99 8c0-.72-.37-1.35-.94-1.7L12 1 2.95 6.3C2.38 6.65 2 7.28 2 8v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-10zM12 13L3.74 7.84 12 3l8.26 4.84L12 13z" />
          </svg>
          <span className="text-devanagari">Draft saved: "{draftMessage.substring(0, 30)}..."</span>
          <button className="btn-link haptic-click" onClick={loadDraft}>
            Load Draft
          </button>
        </div>
      )}

      {/* Messages Container */}
      <div className="messages-container">
        <div className="messages-list">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-wrapper ${message.sender.id === currentUserId ? 'message-sent' : 'message-received'}`}
            >
              {message.sender.id !== currentUserId && (
                <div className="sender-name text-devanagari">
                  {message.sender.name}
                  {group.admins?.includes(message.sender.id) && (
                    <span className="admin-badge">Admin</span>
                  )}
                </div>
              )}
              <div className={`chat-bubble chat-bubble-${message.sender.id === currentUserId ? 'sender' : 'receiver'} text-devanagari`}>
                {message.isEmergency && (
                  <div className="emergency-badge">
                    🚨 EMERGENCY
                  </div>
                )}
                {message.type === 'poll' ? (
                  <PollComponent
                    poll={message}
                    onVote={handleVote}
                    userVotedOption={userVotes[message.id]}
                  />
                ) : message.type === 'form' ? (
                  <FormComponent
                    form={message}
                    onSubmit={handleFormSubmit}
                    userResponse={userResponses[message.id]}
                  />
                ) : (
                  <>
                    <p className="message-text">{message.text}</p>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  </>
                )}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className={`chat-input-container glass-panel-light ${!isMessagingAllowed ? 'disabled' : ''}`}>
        {isMessagingAllowed ? (
          <>
            <button className="icon-btn haptic-click" aria-label="Attach File">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>

            <button className="icon-btn haptic-click" onClick={() => setShowPollModal(true)} aria-label="Create Poll">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>

            <button className="icon-btn haptic-click" onClick={() => setShowFormModal(true)} aria-label="Create Form">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>

            <input
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
          </>
        ) : (
          <div className="disabled-input-message">
            <svg className="icon icon-lg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <div>
              <strong className="text-devanagari">Messages cannot be sent right now</strong>
              <p>You can still type and save drafts. Use emergency keywords for urgent messages.</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .group-chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .group-header {
          padding: var(--space-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          z-index: 10;
        }

        .group-avatar {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          background: var(--gradient-accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .group-icon {
          font-size: 24px;
        }

        .status-disabled {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--primary-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          border: 2px solid var(--primary-dark);
        }

        .group-meta {
          font-size: var(--font-size-sm);
          color: rgba(255, 255, 255, 0.7);
        }

        .time-control-banner {
          background: linear-gradient(135deg, #1A237E 0%, #283593 100%);
          color: white;
          padding: var(--space-lg);
          border-bottom: 2px solid var(--accent-marigold);
          animation: slide-down 0.3s ease-out;
        }

        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .banner-content {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-bottom: var(--space-sm);
        }

        .banner-content .icon {
          color: var(--accent-marigold);
        }

        .banner-content strong {
          display: block;
          margin-bottom: var(--space-xs);
        }

        .banner-content p {
          margin: 0;
          font-size: var(--font-size-sm);
          opacity: 0.9;
        }

        .countdown {
          margin-top: var(--space-xs);
          padding: var(--space-xs) var(--space-sm);
          background: rgba(255, 153, 51, 0.2);
          border-radius: var(--radius-sm);
          display: inline-block;
          font-size: var(--font-size-sm);
          font-weight: 600;
        }

        .banner-schedule {
          opacity: 0.7;
          font-size: var(--font-size-xs);
        }

        .draft-banner {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md) var(--space-lg);
          background: rgba(255, 153, 51, 0.1);
          border-bottom: 1px solid rgba(255, 153, 51, 0.3);
        }

        .draft-banner .icon {
          color: var(--accent-marigold);
        }

        .btn-link {
          background: none;
          border: none;
          color: var(--accent-marigold);
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
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
          gap: var(--space-md);
        }

        .message-wrapper {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .message-sent {
          align-items: flex-end;
        }

        .message-received {
          align-items: flex-start;
        }

        .sender-name {
          font-size: var(--font-size-xs);
          opacity: 0.7;
          margin-bottom: var(--space-xs);
          margin-left: var(--space-sm);
        }

        .emergency-badge {
          background: var(--neutral-terracotta);
          color: white;
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          font-weight: 700;
          margin-bottom: var(--space-xs);
          animation: pulse-alert 2s ease-in-out infinite;
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

        .chat-input-container {
          padding: var(--space-lg);
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          z-index: 10;
          transition: opacity var(--transition-base);
        }

        .chat-input-container.disabled {
          opacity: 0.6;
          pointer-events: none;
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

        .disabled-input-message {
          flex: 1;
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md);
          background: rgba(26, 35, 126, 0.05);
          border-radius: var(--radius-md);
          pointer-events: auto;
        }

        .disabled-input-message .icon {
          color: var(--primary-dark);
          opacity: 0.5;
        }

        .disabled-input-message strong {
          display: block;
          color: var(--primary-dark);
          margin-bottom: var(--space-xs);
        }

        .disabled-input-message p {
          margin: 0;
          font-size: var(--font-size-sm);
          opacity: 0.7;
        }

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

        .admin-badge {
            background: var(--primary-dark);
            color: white;
            font-size: 9px;
            padding: 2px 6px;
            border-radius: 4px;
            margin-left: 6px;
            text-transform: uppercase;
            font-weight: 700;
            vertical-align: middle;
            opacity: 1 !important;
        }
      `}</style>

      {
        showPollModal && (
          <CreatePollModal
            onClose={() => setShowPollModal(false)}
            onSubmit={handleCreatePoll}
          />
        )
      }

      {showFormModal && (
        <CreateFormModal
          onClose={() => setShowFormModal(false)}
          onSubmit={handleCreateForm}
        />
      )}
    </div >
  );
};

export default GroupChatInterface;
