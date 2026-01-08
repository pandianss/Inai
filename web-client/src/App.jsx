import React, { useState, useEffect } from 'react';
import { getTranslation } from './utils/translations';
import OnboardingFlow from './components/OnboardingFlow';
import ChatInterface from './components/ChatInterface';
import CommerceHub from './components/CommerceHub';
import GroupCreationRequest from './components/GroupCreationRequest';
import GroupChatInterface from './components/GroupChatInterface';
import MailInterface from './components/MailInterface';
import ProfileInterface from './components/ProfileInterface';

function App() {
    const [isOnboarded, setIsOnboarded] = useState(false);
    const [userData, setUserData] = useState(null);
    const [currentView, setCurrentView] = useState('chat'); // 'chat', 'commerce', 'groups'
    const [showGroupCreation, setShowGroupCreation] = useState(false);
    const [groups, setGroups] = useState([
        {
            id: 'demo-official',
            name: 'Team Alpha',
            icon: (
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-3a1 1 0 011-1h2a1 1 0 011 1v3m-4 0h4" />
                </svg>
            ),
            type: 'official',
            memberCount: 12,
            timeControls: {
                enabled: true,
                days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                startTime: '09:00',
                endTime: '18:00',
                timezone: 'Asia/Kolkata'

            },
            admins: ['current_user']
        },
        {
            id: 'demo-social',
            name: 'Family Group',
            icon: (
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            type: 'social',
            memberCount: 8,
            timeControls: {
                enabled: false
            },
            admins: ['current_user', 'user2']
        }
    ]);
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        // Check if user has already onboarded
        const storedUserData = localStorage.getItem('bharatMessengerUser');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
            setIsOnboarded(true);
        }
    }, []);

    const handleOnboardingComplete = (data) => {
        setUserData(data);
        setIsOnboarded(true);
        localStorage.setItem('bharatMessengerUser', JSON.stringify(data));
    };

    const handleUpdateProfile = (updates) => {
        const newUserData = { ...userData, ...updates };
        setUserData(newUserData);
        localStorage.setItem('bharatMessengerUser', JSON.stringify(newUserData));
    };

    const handleGroupCreationSubmit = (request) => {
        // In production, this would send to backend for voting
        console.log('Group creation request submitted:', request);

        // Simulate adding to filtered groups
        alert(t.headers.createGroup + ` request submitted!\n\nName: ${request.name}\nType: ${request.type}\nApproval needed: ${request.votingThreshold}%\nVoting ends in 48 hours`);

        // In a real app, successful vote would create this group:
        /*
        const newGroup = {
            id: 'new-group-' + Date.now(),
            name: request.name,
            type: request.type,
            // ...
            admins: request.type === 'official' ? ['current_user'] : [] 
        };
        */

        setShowGroupCreation(false);
    };

    const handleLeaveGroup = (groupId) => {
        // Mock logic for leaving group
        const group = groups.find(g => g.id === groupId);

        // Admin governance check is handled in GroupChatInterface UI before calling this
        if (group) {
            alert(`Left group: ${group.name}`);
            setGroups(groups.filter(g => g.id !== groupId));
            setSelectedGroup(null);
            setCurrentView('groups');
        }
    };

    const handleGroupSelect = (group) => {
        setSelectedGroup(group);
        setCurrentView('group-chat');
    };

    const t = getTranslation(userData?.language || 'English');

    if (!isOnboarded) {
        return <OnboardingFlow onComplete={handleOnboardingComplete} />;
    }

    return (
        <div className="App">
            {/* Main Content */}
            {currentView === 'chat' && <ChatInterface />}
            {currentView === 'commerce' && <CommerceHub userData={userData} />}
            {currentView === 'mails' && <MailInterface userData={userData} />}
            {currentView === 'profile' && <ProfileInterface userData={userData} onLogout={() => setIsOnboarded(false)} onUpdateProfile={handleUpdateProfile} />}
            {currentView === 'groups' && !selectedGroup && (
                <div className="groups-view">
                    <div className="background-rangoli rangoli-pattern"></div>

                    <header className="groups-header glass-panel">
                        <h2 className="text-devanagari" style={{ color: 'white', margin: 0 }}>{t.headers.yourGroups}</h2>
                        <button
                            className="btn btn-primary haptic-click"
                            onClick={() => setShowGroupCreation(true)}
                        >
                            <span className="text-devanagari">{t.headers.createGroup}</span>
                        </button>
                    </header>

                    <div className="groups-container">
                        <div className="groups-section">
                            <h3 className="section-title text-devanagari">{t.headers.yourGroups}</h3>
                            <div className="groups-list">
                                {groups.map(group => (
                                    <button
                                        key={group.id}
                                        className="group-card glass-panel-light haptic-click"
                                        onClick={() => handleGroupSelect(group)}
                                    >
                                        <div className="group-card-icon">{group.icon}</div>
                                        <div className="group-card-info">
                                            <h4 className="text-devanagari">{group.name}</h4>
                                            <div className="group-card-meta">
                                                {group.type === 'official' && (
                                                    <span className="card-badge badge-official text-devanagari">{t.group.official}</span>
                                                )}
                                                {group.type === 'social' && (
                                                    <span className="card-badge badge-social text-devanagari">{t.group.social}</span>
                                                )}
                                            </div>
                                            <div className="group-card-meta">
                                                <span>{group.memberCount} {t.group.members}</span>
                                            </div>
                                            {group.timeControls?.enabled && (
                                                <span className="badge badge-verified" style={{ marginTop: '4px' }}>
                                                    ⏰ Time Controls Active
                                                </span>
                                            )}
                                        </div>
                                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="new-group-prompt glass-panel-light">
                            <div className="flex items-center gap-md">
                                <div className="info-icon">
                                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-devanagari" style={{ margin: '0 0 4px 0', fontSize: '14px' }}>Community Driven Groups</h4>
                                    <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>Creating new groups requires community approval.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <style jsx>{`
            .groups-view {
              min-height: 100vh;
              position: relative;
              padding-bottom: 80px;
            }

            .groups-header {
              padding: var(--space-lg);
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: var(--space-lg);
            }

            .groups-container {
              padding: var(--space-lg);
              max-width: 800px;
              margin: 0 auto;
            }

            .groups-section {
              margin-bottom: var(--space-2xl);
            }

            .section-title {
              color: white;
              margin-bottom: var(--space-lg);
            }

            .groups-list {
              display: flex;
              flex-direction: column;
              gap: var(--space-md);
            }

            .group-card {
              display: flex;
              align-items: center;
              gap: var(--space-md);
              padding: var(--space-lg);
              text-align: left;
              width: 100%;
              transition: all var(--transition-base);
            }

            .group-card:hover {
              transform: translateX(8px);
              box-shadow: var(--shadow-md);
            }

            .group-card-icon {
              width: 48px;
              height: 48px;
              color: var(--primary-dark);
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(26, 35, 126, 0.05);
              border-radius: 12px;
              flex-shrink: 0;
            }

            .group-card-icon .icon-lg {
                width: 32px;
                height: 32px;
            }

            .group-card-info {
              flex: 1;
            }

            .group-card-info h4 {
              margin: 0 0 var(--space-xs) 0;
              color: var(--primary-dark);
            }

            .group-card-meta {
              margin: 0;
              font-size: var(--font-size-sm);
              opacity: 0.7;
            }

            .info-card {
              display: flex;
              gap: var(--space-md);
              padding: var(--space-lg);
              align-items: flex-start;
            }

            .info-card .icon {
              color: var(--accent-marigold);
              flex-shrink: 0;
            }

            .info-card strong {
              display: block;
              margin-bottom: var(--space-sm);
              color: var(--primary-dark);
            }

            .info-card p {
              margin: 0;
              font-size: var(--font-size-sm);
              opacity: 0.8;
              line-height: 1.6;
            }
          `}</style>
                </div>
            )}
            {currentView === 'group-chat' && selectedGroup && (
                <>
                    <button
                        className="back-button haptic-click"
                        onClick={() => {
                            setSelectedGroup(null);
                            setCurrentView('groups');
                        }}
                    >
                        ← Back to Groups
                    </button>
                    <GroupChatInterface
                        group={selectedGroup}
                        userData={userData || { id: 'current_user', name: 'You' }}
                        onLeaveGroup={() => handleLeaveGroup(selectedGroup.id)}
                    />
                </>
            )}

            {/* Group Creation Modal */}
            {showGroupCreation && (
                <GroupCreationRequest
                    onClose={() => setShowGroupCreation(false)}
                    onSubmit={handleGroupCreationSubmit}
                />
            )}

            {/* Bottom Navigation */}
            <nav className="bottom-nav glass-panel">
                <button
                    className={`nav-item ${currentView === 'chat' ? 'active' : ''} haptic-click`}
                    onClick={() => { setCurrentView('chat'); setSelectedGroup(null); }}
                >
                    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="nav-label text-devanagari">{t.nav.chat}</span>
                </button>
                <button
                    className={`nav-item ${currentView === 'groups' || currentView === 'group-chat' ? 'active' : ''} haptic-click`}
                    onClick={() => { setCurrentView('groups'); setSelectedGroup(null); }}
                >
                    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="nav-label text-devanagari">{t.nav.groups}</span>
                </button>
                <button
                    className={`nav-item ${currentView === 'commerce' ? 'active' : ''} haptic-click`}
                    onClick={() => { setCurrentView('commerce'); setSelectedGroup(null); }}
                >
                    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="nav-label text-devanagari">{t.nav.commerce}</span>
                </button>
                <button
                    className={`nav-item ${currentView === 'mails' ? 'active' : ''} haptic-click`}
                    onClick={() => { setCurrentView('mails'); setSelectedGroup(null); }}
                >
                    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="nav-label text-devanagari">{t.nav.mails}</span>
                </button>
                <button
                    className={`nav-item ${currentView === 'profile' ? 'active' : ''} haptic-click`}
                    onClick={() => { setCurrentView('profile'); setSelectedGroup(null); }}
                >
                    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="nav-label text-devanagari">{t.nav.profile}</span>
                </button>
            </nav>

            <style jsx>{`
        .back-button {
          position: fixed;
          top: var(--space-lg);
          left: var(--space-lg);
          z-index: 100;
          padding: var(--space-sm) var(--space-md);
          background: var(--glass-primary);
          backdrop-filter: blur(12px);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .back-button:hover {
          background: var(--accent-marigold);
          transform: translateX(-4px);
        }

        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          height: 64px; /* Fixed height */
          padding: 0 var(--space-md);
          background: var(--glass-primary);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 100;
          width: 100%;
          box-sizing: border-box;
          max-width: 100vw;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          padding: 0;
          margin: 0;
          transition: color 0.2s ease;
          position: relative;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          width: 100%;
          height: 100%;
          outline: none !important;
        }

        .nav-item:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .nav-item.active {
          color: var(--accent-marigold);
        }

        /* Fixed container for icon to prevent movement */
        .nav-icon {
          width: 24px;
          height: 24px;
          display: block;
          margin-bottom: 4px;
        }

        .nav-label {
          font-size: 10px;
          font-weight: 500;
          line-height: 1.2;
          white-space: nowrap;
          text-align: center;
          width: 100%;
        }
      `}</style>
        </div>
    );
}

export default App;
