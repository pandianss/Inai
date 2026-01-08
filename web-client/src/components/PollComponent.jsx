import React, { useState } from 'react';
import '../styles/design-system.css';

/**
 * PollComponent
 * Allows creating and voting on polls in group chats
 */
const PollComponent = ({ poll, onVote, userVotedOption }) => {
    const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes, 0);

    return (
        <div className="poll-card glass-panel-light">
            <h4 className="poll-question text-devanagari">{poll.question}</h4>
            <div className="poll-options">
                {poll.options.map((option, index) => {
                    const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                    const isSelected = userVotedOption === option.id;

                    return (
                        <div
                            key={option.id}
                            className={`poll-option haptic-click ${isSelected ? 'selected' : ''}`}
                            onClick={() => !userVotedOption && onVote(poll.id, option.id)}
                        >
                            <div className="poll-progress-bar" style={{ width: `${percentage}%` }}></div>
                            <div className="poll-option-content">
                                <span className="option-text text-devanagari">{option.text}</span>
                                <span className="option-percentage">{percentage}%</span>
                            </div>
                            {isSelected && <span className="vote-check">✓</span>}
                        </div>
                    );
                })}
            </div>
            <div className="poll-meta">
                <span>{totalVotes} votes</span>
                <span>• {poll.status === 'active' ? 'Open' : 'Closed'}</span>
            </div>

            <style jsx>{`
                .poll-card {
                    padding: var(--space-md);
                    border-radius: var(--radius-md);
                    margin: var(--space-sm) 0;
                    width: 100%;
                    max-width: 300px;
                    border-left: 4px solid var(--accent-marigold);
                }

                .poll-question {
                    margin: 0 0 var(--space-md) 0;
                    color: var(--primary-dark);
                    font-size: 16px;
                }

                .poll-options {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-sm);
                }

                .poll-option {
                    position: relative;
                    padding: 8px 12px;
                    border: 1px solid rgba(26, 35, 126, 0.1);
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    overflow: hidden;
                    transition: all 0.2s ease;
                }

                .poll-option:hover {
                    background: rgba(26, 35, 126, 0.02);
                }

                .poll-option.selected {
                    border-color: var(--accent-marigold);
                    background: rgba(255, 153, 51, 0.05);
                }

                .poll-progress-bar {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    background: rgba(26, 35, 126, 0.08);
                    z-index: 0;
                    transition: width 0.5s ease-out;
                }

                .poll-option.selected .poll-progress-bar {
                    background: rgba(255, 153, 51, 0.15);
                }

                .poll-option-content {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .option-text {
                    font-size: 14px;
                    color: var(--primary-dark);
                    font-weight: 500;
                }

                .option-percentage {
                    font-size: 12px;
                    color: rgba(0,0,0,0.6);
                    font-weight: 600;
                }

                .vote-check {
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--accent-marigold);
                    font-weight: bold;
                    display: none; // Hidden unless needed layout adjustment
                }

                .poll-meta {
                    margin-top: var(--space-md);
                    font-size: 11px;
                    color: rgba(0,0,0,0.5);
                    display: flex;
                    gap: 8px;
                }
            `}</style>
        </div>
    );
};

export const CreatePollModal = ({ onClose, onSubmit }) => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);

    const handleAddOption = () => {
        if (options.length < 5) setOptions([...options, '']);
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = () => {
        const validOptions = options.filter(opt => opt.trim() !== '');
        if (question.trim() && validOptions.length >= 2) {
            onSubmit({ question, options: validOptions });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel">
                <h3 className="text-devanagari">Create Poll</h3>

                <input
                    type="text"
                    className="input width-full mb-md"
                    placeholder="Ask a question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />

                <div className="options-list">
                    {options.map((opt, idx) => (
                        <input
                            key={idx}
                            type="text"
                            className="input width-full mb-sm"
                            placeholder={`Option ${idx + 1}`}
                            value={opt}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                        />
                    ))}
                </div>

                {options.length < 5 && (
                    <button className="btn-link mb-lg" onClick={handleAddOption}>
                        + Add Option
                    </button>
                )}

                <div className="flex gap-md justify-end">
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={handleSubmit}>Create Poll</button>
                </div>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                }
                .modal-content {
                    width: 90%;
                    max-width: 400px;
                    padding: var(--space-lg);
                    border-radius: var(--radius-lg);
                    background: white;
                }
                .width-full { width: 100%; box-sizing: border-box; }
                .mb-sm { margin-bottom: var(--space-sm); }
                .mb-md { margin-bottom: var(--space-md); }
                .mb-lg { margin-bottom: var(--space-lg); }
                .flex { display: flex; }
                .gap-md { gap: var(--space-md); }
                .justify-end { justify-content: flex-end; }
                
                .btn-secondary {
                    background: transparent;
                    border: 1px solid rgba(0,0,0,0.2);
                    padding: 8px 16px;
                    border-radius: var(--radius-full);
                    cursor: pointer;
                }
                .btn-primary {
                    background: var(--accent-marigold);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: var(--radius-full);
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default PollComponent;
