import React, { useState } from 'react';
import { getTranslation } from '../utils/translations';
import '../styles/design-system.css';

/**
 * ProfileInterface Component
 * User profile, settings, and identity management
 */

const ProfileInterface = ({ userData, onLogout, onUpdateProfile }) => { // Accept onUpdateProfile
    const [showLanguageModal, setShowLanguageModal] = useState(false); // Local state for modal
    const languages = [
        { code: 'hi', name: 'हिन्दी', native: 'Hindi' },
        { code: 'en', name: 'English', native: 'English' },
        { code: 'ta', name: 'தமிழ்', native: 'Tamil' },
        { code: 'bn', name: 'বাংলা', native: 'Bengali' },
        { code: 'kn', name: 'ಕನ್ನಡ', native: 'Kannada' }
    ];

    // Mock user data if not provided
    const user = userData || {
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        bharatId: 'rajesh.k@bharat.mess',
        language: 'Hindi', // Default
        bio: 'Jai Hind! 🇮🇳'
    };

    const handleLanguageChange = (langName) => {
        if (onUpdateProfile) {
            onUpdateProfile({ language: langName });
        }
        setShowLanguageModal(false);
    };

    const t = getTranslation(user.language);

    return (
        <div className="profile-container">
            <div className="background-rangoli rangoli-pattern"></div>

            <div className="profile-content">
                {/* Profile Card */}
                <div className="profile-card glass-panel">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <span className="avatar-text">{user.name.charAt(0)}</span>
                        </div>
                        <h2 className="profile-name text-devanagari">{user.name}</h2>
                        <p className="profile-id">{user.bharatId}</p>
                    </div>

                    <div className="qr-section">
                        <div className="qr-placeholder">
                            <svg className="icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zm-6 12v-2m0 0v-2m0 2h2m-2 0H4m14-11h-2m-2-2v4h4.171a2 2 0 001.414.586H20m-4-7h2m-2-2v2m6 2h-2m2-2V4h-2M9 4V2H4a2 2 0 00-2 2v5h2V4h5zm-5 7v9h9v-9H4zm11 11h9v-9h-9v9z" />
                            </svg>
                        </div>
                        <p className="qr-text">{t.actions.scanToConnect}</p>
                    </div>
                </div>

                {/* Settings Sections */}
                <div className="settings-section glass-panel-light">
                    <h3 className="section-title text-devanagari">{t.headers.settings}</h3>

                    <button className="setting-item haptic-click" onClick={() => setShowLanguageModal(true)}>
                        <div className="setting-icon">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                        </div>
                        <div className="setting-info">
                            <span className="setting-label">{t.settings.language}</span>
                            <span className="setting-value text-devanagari">{user.language}</span>
                        </div>
                        <div className="setting-arrow">›</div>
                    </button>

                    <button className="setting-item haptic-click">
                        <div className="setting-icon">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div className="setting-info">
                            <span className="setting-label">{t.settings.privacy}</span>
                            <span className="setting-value">{t.settings.verify}</span>
                        </div>
                        <div className="setting-arrow">›</div>
                    </button>

                    <button className="setting-item haptic-click">
                        <div className="setting-icon">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <div className="setting-info">
                            <span className="setting-label">{t.settings.notifications}</span>
                            <span className="setting-value">{t.settings.on}</span>
                        </div>
                        <div className="setting-arrow">›</div>
                    </button>

                    <button className="setting-item haptic-click">
                        <div className="setting-icon">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="setting-info">
                            <span className="setting-label">{t.settings.help}</span>
                        </div>
                        <div className="setting-arrow">›</div>
                    </button>
                </div>

                <div className="profile-actions">
                    <button className="btn btn-secondary haptic-click width-full" onClick={() => alert('Logout clicked')}>
                        {t.actions.logout}
                    </button>
                    <p className="app-version">Bharat Messenger v1.0.0 (Alpha)</p>
                </div>
            </div>

            <style jsx>{`
                .profile-container {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    padding-bottom: 80px;
                    overflow-y: auto;
                }

                .profile-content {
                    padding: var(--space-lg);
                    max-width: 600px;
                    margin: 0 auto;
                    width: 100%;
                    box-sizing: border-box;
                }

                .profile-card {
                    padding: var(--space-xl);
                    margin-bottom: var(--space-lg);
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .profile-avatar {
                    width: 96px;
                    height: 96px;
                    border-radius: 50%;
                    background: var(--gradient-accent);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--space-md);
                    border: 4px solid rgba(255,255,255,0.2);
                    box-shadow: var(--shadow-lg);
                }

                .avatar-text {
                    font-size: 48px;
                    color: white;
                    font-weight: bold;
                }

                .profile-name {
                    margin: 0 0 var(--space-xs) 0;
                    color: white;
                }

                .profile-id {
                    margin: 0 0 var(--space-lg) 0;
                    color: rgba(255,255,255,0.7);
                    font-family: monospace;
                }

                .qr-section {
                    background: white;
                    padding: var(--space-lg);
                    border-radius: var(--radius-md);
                    width: 100%;
                    max-width: 200px;
                }

                .qr-placeholder {
                    width: 100%;
                    aspect-ratio: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f0f0f0;
                    margin-bottom: var(--space-sm);
                    color: #333;
                }
                
                .qr-text {
                    margin: 0;
                    font-size: 12px;
                    color: #666;
                }

                .section-title {
                    font-size: var(--font-size-lg);
                    color: var(--primary-dark);
                    margin: 0 0 var(--space-md) 0;
                    padding-left: var(--space-sm);
                }

                .settings-section {
                    padding: var(--space-lg);
                    margin-bottom: var(--space-lg);
                    border-radius: var(--radius-lg);
                }

                .setting-item {
                    display: flex;
                    align-items: center;
                    gap: var(--space-md);
                    width: 100%;
                    background: transparent;
                    border: none;
                    padding: var(--space-md) var(--space-sm);
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                    cursor: pointer;
                    text-align: left;
                }
                
                .setting-item:last-child {
                    border-bottom: none;
                }

                .setting-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(26, 35, 126, 0.05);
                    color: var(--primary-dark);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .setting-icon .icon { width: 18px; height: 18px; }

                .setting-info {
                    flex: 1;
                }

                .setting-label {
                    display: block;
                    font-size: 16px;
                    color: var(--primary-dark);
                }

                .setting-value {
                    font-size: 12px;
                    color: rgba(0,0,0,0.5);
                }
                
                .setting-arrow {
                    color: rgba(0,0,0,0.3);
                    font-size: 20px;
                }
                
                .btn-secondary {
                    background: rgba(255, 255, 255, 0.2);
                    color: var(--primary-dark);
                    border: 1px solid rgba(26, 35, 126, 0.2);
                    padding: var(--space-md);
                    border-radius: var(--radius-full);
                    font-weight: 600;
                    cursor: pointer;
                }
                .width-full { width: 100%; }
                
                .app-version {
                    text-align: center;
                    font-size: 12px;
                    opacity: 0.5;
                    margin-top: var(--space-lg);
                }
            `}</style>
            {showLanguageModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel">
                        <div className="modal-header">
                            <h3 className="section-title">{t.headers.selectLanguage}</h3>
                            <button className="close-btn" onClick={() => setShowLanguageModal(false)}>×</button>
                        </div>
                        <div className="language-list">
                            {languages.map(lang => (
                                <button
                                    key={lang.code}
                                    className={`language-option ${user.language === lang.native ? 'selected' : ''}`}
                                    onClick={() => handleLanguageChange(lang.native)}
                                >
                                    <span className="lang-name text-devanagari">{lang.name}</span>
                                    <span className="lang-native">{lang.native}</span>
                                    {user.language === lang.native && <span className="check">✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <style jsx>{`
                        .modal-overlay {
                            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                            background: rgba(0,0,0,0.5);
                            display: flex; align-items: center; justify-content: center;
                            z-index: 1000; backdrop-filter: blur(4px);
                        }
                        .modal-content {
                            width: 90%; max-width: 350px;
                            padding: var(--space-lg);
                            border-radius: var(--radius-lg);
                            background: white;
                        }
                        .modal-header {
                            display: flex; justify-content: space-between; align-items: center;
                            margin-bottom: var(--space-md);
                        }
                        .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; }
                        
                        .language-list { display: flex; flex-direction: column; gap: 8px; }
                        
                        .language-option {
                            display: flex; align-items: center; gap: 12px;
                            padding: 12px;
                            background: transparent;
                            border: 1px solid rgba(0,0,0,0.05);
                            border-radius: var(--radius-md);
                            cursor: pointer; text-align: left;
                            transition: all 0.2s;
                        }
                        
                        .language-option.selected {
                            border-color: var(--accent-marigold);
                            background: rgba(255, 153, 51, 0.05);
                        }
                        
                        .lang-name { font-size: 16px; font-weight: 600; color: var(--primary-dark); }
                        .lang-native { font-size: 14px; color: rgba(0,0,0,0.5); flex: 1; }
                        .check { color: var(--accent-marigold); font-weight: bold; }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default ProfileInterface;
