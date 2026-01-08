import React, { useState } from 'react';
import { getTranslation } from '../utils/translations';
import '../styles/design-system.css';

/**
 * MailInterface Component
 * Integrated Email Engine for Bharat Messenger
 * Features: Inbox, Sent, Drafts, Compose, Rich Text (simulated)
 */

const MailInterface = ({ userData }) => {
    const [view, setView] = useState('inbox'); // 'inbox', 'read', 'compose'
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [activeFolder, setActiveFolder] = useState('inbox');

    // Mock user data fallback
    const user = userData || { language: 'English' };
    const t = getTranslation(user.language);

    // Mock Email Data
    const [emails, setEmails] = useState([
        {
            id: 1,
            sender: 'Govt Notifications',
            senderEmail: 'noreply@india.gov.in',
            subject: 'Income Tax Return Filed Successfully',
            preview: 'Your ITR for AY 2025-26 has been successfully verified...',
            body: 'Dear Citizen,\n\nYour Income Tax Return for Assessment Year 2025-26 has been successfully verified. You can download the acknowledgement from the portal.\n\nThank you for contributing to nation building.\n\nJai Hind.',
            time: '10:30 AM',
            folder: 'inbox',
            read: false,
            avatar: (
                <svg className="icon" style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-3a1 1 0 011-1h2a1 1 0 011 1v3m-4 0h4" />
                </svg>
            )
        },
        {
            id: 2,
            sender: 'HDFC Bank',
            senderEmail: 'alerts@hdfcbank.com',
            subject: 'Statement for March 2025',
            preview: 'Your account statement for the period of March 2025 is ready.',
            body: 'Dear Customer,\n\nYour account statement for March 2025 is attached. Please use your Customer ID as the password to open the PDF.\n\nWarm Regards,\nHDFC Bank',
            time: 'Yesterday',
            folder: 'inbox',
            read: true,
            avatar: (
                <svg className="icon" style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
            )
        },
        {
            id: 3,
            sender: 'Ramesh Gupta',
            senderEmail: 'ramesh.g@bharat.mess',
            subject: 'Meeting Minutes',
            preview: 'Here are the minutes from our community meeting held yesterday.',
            body: 'Hi Everyone,\n\nPlease find below the summary of our community meeting:\n1. Park renovation approved\n2. New security guard to be hired\n3. Diwali festival planning committee formed.\n\nRegards,\nRamesh',
            time: '2 days ago',
            folder: 'inbox',
            read: true,
            avatar: 'R'
        }
    ]);

    const handleEmailClick = (email) => {
        setSelectedEmail(email);
        setView('read');
        // Mark as read
        setEmails(prev => prev.map(e => e.id === email.id ? { ...e, read: true } : e));
    };

    const handleBack = () => {
        setView('inbox');
        setSelectedEmail(null);
    };

    const handleCompose = () => {
        setView('compose');
    };

    const handleSend = (e) => {
        e.preventDefault();
        // Simulate sending
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        alert('Email Sent Successfully!');
        setView('inbox');
    };

    const RenderInbox = () => (
        <div className="mail-list-container">
            <div className="mail-list">
                {emails.filter(e => e.folder === activeFolder).map(email => (
                    <div
                        key={email.id}
                        className={`mail-item glass-panel-light haptic-click ${!email.read ? 'unread' : ''}`}
                        onClick={() => handleEmailClick(email)}
                    >
                        <div className="mail-avatar-container">
                            <div className="avatar-circle">{email.avatar}</div>
                        </div>
                        <div className="mail-info">
                            <div className="mail-header-row">
                                <h3 className="sender-name text-devanagari">{email.sender}</h3>
                                <span className="timestamp">{email.time}</span>
                            </div>
                            <h4 className="mail-subject">{email.subject}</h4>
                            <p className="mail-preview">{email.preview}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button className="fab-compose haptic-click" onClick={handleCompose}>
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            </button>
        </div>
    );

    const RenderReadView = () => (
        <div className="read-view-container glass-panel">
            <div className="read-header">
                <button className="icon-btn" onClick={handleBack}>
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="read-actions">
                    <button className="icon-btn haptic-click">
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                    </button>
                    <button className="icon-btn haptic-click">
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="mail-content-scroll">
                <h2 className="mail-subject-large">{selectedEmail.subject}</h2>

                <div className="sender-details">
                    <div className="avatar-circle">{selectedEmail.avatar}</div>
                    <div>
                        <h4 className="sender-name-large">{selectedEmail.sender}</h4>
                        <p className="sender-email">{selectedEmail.senderEmail}</p>
                    </div>
                    <span className="details-time">{selectedEmail.time}</span>
                </div>

                <div className="email-body-text">
                    {selectedEmail.body.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                </div>
            </div>
        </div>
    );

    const RenderComposeView = () => (
        <div className="compose-view-container glass-panel">
            <div className="compose-header">
                <button className="icon-btn" onClick={() => setView('inbox')}>
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h3 className="text-devanagari">{t.mail.compose}</h3>
                <button className="icon-btn haptic-click" onClick={handleSend}>
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>

            <form className="compose-form">
                <div className="form-group">
                    <label>{t.mail.to}</label>
                    <input type="email" placeholder="recipient@example.com" className="input-clean" />
                </div>
                <div className="form-group">
                    <label>{t.mail.subject}</label>
                    <input type="text" placeholder={t.mail.subject} className="input-clean" />
                </div>
                <div className="form-group flex-1">
                    <textarea placeholder={t.mail.placeholder} className="textarea-clean"></textarea>
                </div>
            </form>
        </div>
    );

    return (
        <div className="mail-container">
            <div className="background-rangoli rangoli-pattern"></div>

            {view === 'inbox' && (
                <header className="mail-header glass-panel">
                    <div className="flex items-center justify-between width-full">
                        <h2 className="text-devanagari header-title">{t.mail.header}</h2>
                        <div className="folder-tabs">
                            {/* Simplified tabs for demo */}
                            <span className={`tab ${activeFolder === 'inbox' ? 'active' : ''}`} onClick={() => setActiveFolder('inbox')}>{t.mail.inbox}</span>
                            <span className={`tab ${activeFolder === 'sent' ? 'active' : ''}`} onClick={() => setActiveFolder('sent')}>{t.mail.sent}</span>
                        </div>
                    </div>
                </header>
            )}

            <div className="mail-body">
                {view === 'inbox' && <RenderInbox />}
                {view === 'read' && selectedEmail && <RenderReadView />}
                {view === 'compose' && <RenderComposeView />}
            </div>

            <style jsx>{`
                .mail-container {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    padding-bottom: 80px; /* Bottom nav */
                }

                .mail-header {
                    padding: var(--space-md) var(--space-lg);
                    background: var(--gradient-primary);
                    color: white;
                    z-index: 10;
                }
                
                .header-title {
                    margin: 0;
                    font-size: var(--font-size-xl);
                }

                .width-full { width: 100%; }

                .folder-tabs {
                    display: flex;
                    gap: var(--space-md);
                }
                
                .tab {
                    font-size: var(--font-size-sm);
                    opacity: 0.7;
                    padding-bottom: 4px;
                }
                
                .tab.active {
                    opacity: 1;
                    border-bottom: 2px solid var(--accent-marigold);
                    font-weight: 600;
                }

                .mail-body {
                    flex: 1;
                    position: relative;
                }

                .mail-list {
                    padding: var(--space-md);
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-sm);
                }
                
                .mail-item {
                    display: flex;
                    gap: var(--space-md);
                    padding: var(--space-md);
                    cursor: pointer;
                    align-items: flex-start;
                    border-left: 3px solid transparent;
                }
                
                .mail-item.unread {
                    background: rgba(255, 255, 255, 0.95);
                    border-left-color: var(--accent-marigold);
                }
                
                .mail-item.unread .sender-name,
                .mail-item.unread .mail-subject {
                    font-weight: 700;
                    color: var(--primary-dark);
                }

                .avatar-circle {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: var(--glass-light);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    border: 1px solid rgba(0,0,0,0.1);
                }

                .mail-info {
                    flex: 1;
                    min-width: 0;
                }
                
                .mail-header-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 2px;
                }
                
                .sender-name {
                    margin: 0;
                    font-size: var(--font-size-base);
                    font-weight: 500;
                }
                
                .timestamp {
                    font-size: 10px;
                    color: rgba(0,0,0,0.5);
                }
                
                .mail-subject {
                    margin: 0 0 2px 0;
                    font-size: var(--font-size-sm);
                    color: var(--primary-dark);
                    font-weight: 500;
                }
                
                .mail-preview {
                    margin: 0;
                    font-size: 12px;
                    color: rgba(0,0,0,0.6);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .fab-compose {
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

                /* Read View Styles */
                .read-view-container, .compose-view-container {
                    margin: var(--space-md);
                    padding: var(--space-lg);
                    min-height: 80vh;
                    display: flex;
                    flex-direction: column;
                }
                
                .read-header, .compose-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--space-lg);
                    padding-bottom: var(--space-md);
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                }
                
                .read-actions { display: flex; gap: var(--space-sm); }

                .mail-subject-large {
                    margin: 0 0 var(--space-md) 0;
                    font-size: 20px;
                    color: var(--primary-dark);
                }

                .sender-details {
                    display: flex;
                     gap: var(--space-md);
                     align-items: center;
                     margin-bottom: var(--space-lg);
                }
                
                .sender-name-large { margin: 0; font-size: 16px; }
                .sender-email { margin: 0; font-size: 12px; opacity: 0.6; }
                .details-time { margin-left: auto; font-size: 12px; opacity: 0.5; }

                .email-body-text {
                    font-size: 15px;
                    line-height: 1.6;
                    color: var(--primary-dark);
                }
                .email-body-text p { margin-bottom: 1em; }

                /* Compose Styles */
                .compose-form {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-md);
                    flex: 1;
                }
                
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .form-group.flex-1 { flex: 1; }
                
                .form-group label {
                    font-size: 12px;
                    font-weight: 600;
                    color: rgba(0,0,0,0.5);
                }

                .input-clean {
                    background: transparent;
                    border: none;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    padding: 8px 0;
                    font-size: 16px;
                }
                .input-clean:focus { outline: none; border-color: var(--accent-marigold); }

                .textarea-clean {
                    width: 100%;
                    height: 100%;
                    resize: none;
                    background: transparent;
                    border: none;
                    font-size: 16px;
                    font-family: inherit;
                    padding: 8px 0;
                }
                .textarea-clean:focus { outline: none; }
            `}</style>
        </div>
    );
};

export default MailInterface;
