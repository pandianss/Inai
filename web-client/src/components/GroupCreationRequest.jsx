import React, { useState } from 'react';
import '../styles/design-system.css';

/**
 * GroupCreationRequest Component
 * Community-driven group creation with voting system
 * No administrator - groups created through community approval
 */

const GroupCreationRequest = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    purpose: '',
    type: 'social',
    expectedMembers: 10,
    guidelines: '',
    timeControls: {
      enabled: false,
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: '09:00',
      endTime: '18:00',
      timezone: 'Asia/Kolkata'
    }
  });

  const groupTypes = [
    {
      id: 'official',
      name: 'Official',
      icon: '🏢',
      description: 'Work, organizations, formal communities',
      timeControlsDefault: true,
      votingThreshold: 70
    },
    {
      id: 'social',
      name: 'Social',
      icon: '👥',
      description: 'Friends, family, casual groups',
      timeControlsDefault: false,
      votingThreshold: 60
    },
    {
      id: 'interest',
      name: 'Interest',
      icon: '🎯',
      description: 'Hobbies, topics, learning groups',
      timeControlsDefault: false,
      votingThreshold: 60
    },
    {
      id: 'temporary',
      name: 'Temporary',
      icon: '⏱️',
      description: 'Events, projects, short-term',
      timeControlsDefault: false,
      votingThreshold: 50
    }
  ];

  const handleTypeSelect = (type) => {
    const selectedType = groupTypes.find(t => t.id === type);
    setFormData({
      ...formData,
      type,
      timeControls: {
        ...formData.timeControls,
        enabled: selectedType.timeControlsDefault
      }
    });
  };

  const handleSubmitRequest = () => {
    const selectedType = groupTypes.find(t => t.id === formData.type);

    const request = {
      ...formData,
      votingThreshold: selectedType.votingThreshold,
      requestedAt: new Date().toISOString(),
      status: 'pending_vote',
      votingEndsAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48 hours
    };

    onSubmit(request);
  };

  const selectedType = groupTypes.find(t => t.id === formData.type);

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel-light">
        <div className="modal-header">
          <h2 className="text-devanagari">Create New Group</h2>
          <button className="icon-btn haptic-click" onClick={onClose}>
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="progress-steps">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Type</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Details</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Rules</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <span>Review</span>
          </div>
        </div>

        <div className="modal-body">
          {/* Step 1: Group Type */}
          {step === 1 && (
            <div className="step-content fade-in">
              <h3>Select Group Type</h3>
              <p className="text-devanagari" style={{ opacity: 0.7, marginBottom: 'var(--space-lg)' }}>
                Choose a category for your new community
              </p>

              <div className="group-type-grid">
                {groupTypes.map(type => (
                  <button
                    key={type.id}
                    className={`group-type-card haptic-click ${formData.type === type.id ? 'selected' : ''}`}
                    onClick={() => handleTypeSelect(type.id)}
                  >
                    <div className="type-icon">{type.icon}</div>
                    <h4>{type.name}</h4>
                    <p className="type-description">{type.description}</p>
                    <div className="type-meta">
                      <span className="badge badge-verified">
                        {type.votingThreshold}% approval needed
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Group Details */}
          {step === 2 && (
            <div className="step-content fade-in">
              <h3>Group Details</h3>

              <div className="form-group">
                <label className="text-devanagari">Group Name</label>
                <input
                  type="text"
                  className="input text-devanagari"
                  placeholder="Enter group name..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="text-devanagari">Purpose</label>
                <textarea
                  className="input text-devanagari"
                  rows="3"
                  placeholder="What is this group for?"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Expected Members</label>
                <input
                  type="number"
                  className="input"
                  min="2"
                  max="1000"
                  value={formData.expectedMembers}
                  onChange={(e) => setFormData({ ...formData, expectedMembers: parseInt(e.target.value) })}
                />
              </div>
            </div>
          )}

          {/* Step 3: Time Controls & Guidelines */}
          {step === 3 && (
            <div className="step-content fade-in">
              <h3>Group Rules & Time Controls</h3>

              {/* Time Controls Toggle */}
              <div className="form-group">
                <div className="toggle-container">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={formData.timeControls.enabled}
                      onChange={(e) => setFormData({
                        ...formData,
                        timeControls: { ...formData.timeControls, enabled: e.target.checked }
                      })}
                    />
                    <span className="toggle-switch"></span>
                    <span className="text-devanagari">Enable Time-Based Message Controls</span>
                  </label>
                  <p className="help-text text-devanagari">
                    Set restrictions for when messages can be sent (recommended for official groups)
                  </p>
                </div>
              </div>

              {formData.timeControls.enabled && (
                <div className="time-controls-config">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Time</label>
                      <input
                        type="time"
                        className="input"
                        value={formData.timeControls.startTime}
                        onChange={(e) => setFormData({
                          ...formData,
                          timeControls: { ...formData.timeControls, startTime: e.target.value }
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>End Time</label>
                      <input
                        type="time"
                        className="input"
                        value={formData.timeControls.endTime}
                        onChange={(e) => setFormData({
                          ...formData,
                          timeControls: { ...formData.timeControls, endTime: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Active Days</label>
                    <div className="day-selector">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <button
                          key={day}
                          className={`day-btn haptic-click ${formData.timeControls.days.includes(day) ? 'active' : ''}`}
                          onClick={() => {
                            const days = formData.timeControls.days.includes(day)
                              ? formData.timeControls.days.filter(d => d !== day)
                              : [...formData.timeControls.days, day];
                            setFormData({
                              ...formData,
                              timeControls: { ...formData.timeControls, days }
                            });
                          }}
                        >
                          {day.substring(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="text-devanagari">Group Guidelines</label>
                <textarea
                  className="input text-devanagari"
                  rows="4"
                  placeholder="Set community guidelines for this group..."
                  value={formData.guidelines}
                  onChange={(e) => setFormData({ ...formData, guidelines: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <div className="step-content fade-in">
              <h3>Review Your Request</h3>
              <p className="text-devanagari" style={{ opacity: 0.7, marginBottom: 'var(--space-lg)' }}>
                This request will be sent for community voting
              </p>

              <div className="review-card glass-panel">
                <div className="review-item">
                  <span className="review-label">Group Type:</span>
                  <span className="review-value">
                    {selectedType.icon} {selectedType.name}
                  </span>
                </div>
                {selectedType.id === 'official' && (
                  <div className="review-item">
                    <span className="review-label">Your Role:</span>
                    <span className="review-value">
                      <span className="badge badge-official">Admin</span>
                    </span>
                  </div>
                )}
                <div className="review-item">
                  <span className="review-label text-devanagari">Name:</span>
                  <span className="review-value text-devanagari">{formData.name}</span>
                </div>
                <div className="review-item">
                  <span className="review-label text-devanagari">Purpose:</span>
                  <span className="review-value text-devanagari">{formData.purpose}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Expected Members:</span>
                  <span className="review-value">{formData.expectedMembers}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Time Controls:</span>
                  <span className="review-value">
                    {formData.timeControls.enabled ? (
                      <>
                        ✅ Enabled ({formData.timeControls.startTime} - {formData.timeControls.endTime})
                      </>
                    ) : (
                      '❌ Disabled'
                    )}
                  </span>
                </div>
                <div className="review-item">
                  <span className="review-label">Approval Needed:</span>
                  <span className="review-value">
                    <span className="badge badge-verified">{selectedType.votingThreshold}%</span>
                  </span>
                </div>
                <div className="review-item">
                  <span className="review-label">Voting Period:</span>
                  <span className="review-value">48 hours</span>
                </div>
              </div>

              <div className="info-box">
                <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                <div>
                  <strong>Community Voting Process</strong>
                  <p className="text-devanagari">
                    Your request will be sent to community members. With {selectedType.votingThreshold}% approval,
                    your group will be created in 48 hours.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="modal-footer">
          {step > 1 && (
            <button
              className="btn btn-secondary haptic-click"
              onClick={() => setStep(step - 1)}
            >
              ← Back
            </button>
          )}

          {step < 4 ? (
            <button
              className="btn btn-primary haptic-click"
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !formData.type) ||
                (step === 2 && (!formData.name || !formData.purpose))
              }
            >
              Continue →
            </button>
          ) : (
            <button
              className="btn btn-primary haptic-click"
              onClick={handleSubmitRequest}
            >
              Submit for Voting
            </button>
          )}
        </div>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: var(--space-lg);
          }

          .modal-content {
            max-width: 700px;
            width: 100%;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--space-lg);
            border-bottom: 1px solid rgba(26, 35, 126, 0.1);
          }

          .modal-header h2 {
            margin: 0;
            color: var(--primary-dark);
          }

          .progress-steps {
            display: flex;
            align-items: center;
            padding: var(--space-lg);
            background: rgba(255, 255, 255, 0.5);
          }

          .progress-step {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--space-xs);
            opacity: 0.4;
            transition: opacity var(--transition-base);
          }

          .progress-step.active {
            opacity: 1;
          }

          .step-number {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: var(--primary-dark);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
          }

          .progress-step.active .step-number {
            background: var(--accent-marigold);
          }

          .progress-line {
            flex: 1;
            height: 2px;
            background: rgba(26, 35, 126, 0.2);
            margin: 0 var(--space-sm);
          }

          .modal-body {
            flex: 1;
            overflow-y: auto;
            padding: var(--space-lg);
          }

          .step-content {
            animation: fade-in 0.3s ease-out;
          }

          .group-type-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-md);
          }

          .group-type-card {
            padding: var(--space-lg);
            border: 2px solid transparent;
            border-radius: var(--radius-md);
            background: white;
            text-align: center;
            transition: all var(--transition-base);
            cursor: pointer;
          }

          .group-type-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-md);
          }

          .group-type-card.selected {
            border-color: var(--accent-marigold);
            background: var(--glass-accent);
          }

          .type-icon {
            font-size: 48px;
            margin-bottom: var(--space-sm);
          }

          .group-type-card h4 {
            margin: var(--space-xs) 0;
            color: var(--primary-dark);
          }

          .type-name-hi {
            font-size: var(--font-size-sm);
            opacity: 0.7;
            margin-bottom: var(--space-sm);
          }

          .type-description {
            font-size: var(--font-size-sm);
            opacity: 0.6;
            margin: var(--space-xs) 0;
          }

          .type-description-hi {
            font-size: var(--font-size-xs);
            opacity: 0.5;
          }

          .type-meta {
            margin-top: var(--space-md);
          }

          .form-group {
            margin-bottom: var(--space-lg);
          }

          .form-group label {
            display: block;
            margin-bottom: var(--space-sm);
            font-weight: 500;
            color: var(--primary-dark);
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-md);
          }

          .toggle-container {
            padding: var(--space-md);
            background: rgba(255, 255, 255, 0.5);
            border-radius: var(--radius-md);
          }

          .toggle-label {
            display: flex;
            align-items: center;
            gap: var(--space-md);
            cursor: pointer;
          }

          .toggle-switch {
            position: relative;
            width: 48px;
            height: 24px;
            background: #ccc;
            border-radius: 12px;
            transition: background var(--transition-base);
          }

          .toggle-switch::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            transition: transform var(--transition-base);
          }

          input[type="checkbox"]:checked + .toggle-switch {
            background: var(--accent-neem);
          }

          input[type="checkbox"]:checked + .toggle-switch::after {
            transform: translateX(24px);
          }

          input[type="checkbox"] {
            display: none;
          }

          .help-text {
            font-size: var(--font-size-sm);
            opacity: 0.7;
            margin-top: var(--space-xs);
          }

          .time-controls-config {
            margin-top: var(--space-md);
            padding: var(--space-md);
            background: rgba(76, 175, 80, 0.05);
            border-radius: var(--radius-md);
          }

          .day-selector {
            display: flex;
            gap: var(--space-xs);
            flex-wrap: wrap;
          }

          .day-btn {
            padding: var(--space-sm) var(--space-md);
            border: 2px solid rgba(26, 35, 126, 0.2);
            border-radius: var(--radius-md);
            background: white;
            cursor: pointer;
            transition: all var(--transition-base);
          }

          .day-btn.active {
            background: var(--accent-neem);
            color: white;
            border-color: var(--accent-neem);
          }

          .review-card {
            padding: var(--space-lg);
            margin-bottom: var(--space-lg);
          }

          .review-item {
            display: flex;
            justify-content: space-between;
            padding: var(--space-md) 0;
            border-bottom: 1px solid rgba(26, 35, 126, 0.1);
          }

          .review-item:last-child {
            border-bottom: none;
          }

          .review-label {
            font-weight: 500;
            opacity: 0.7;
          }

          .review-value {
            font-weight: 600;
            color: var(--primary-dark);
          }

          .info-box {
            display: flex;
            gap: var(--space-md);
            padding: var(--space-md);
            background: rgba(255, 153, 51, 0.1);
            border-radius: var(--radius-md);
            border-left: 4px solid var(--accent-marigold);
          }

          .info-box .icon {
            color: var(--accent-marigold);
            flex-shrink: 0;
          }

          .info-box strong {
            display: block;
            margin-bottom: var(--space-xs);
          }

          .info-box p {
            margin: 0;
            font-size: var(--font-size-sm);
            opacity: 0.8;
          }

          .modal-footer {
            display: flex;
            justify-content: space-between;
            padding: var(--space-lg);
            border-top: 1px solid rgba(26, 35, 126, 0.1);
          }

          @media (max-width: 768px) {
            .group-type-grid {
              grid-template-columns: 1fr;
            }

            .form-row {
              grid-template-columns: 1fr;
            }

            .progress-steps span {
              display: none;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default GroupCreationRequest;
