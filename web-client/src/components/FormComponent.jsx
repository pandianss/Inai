import React, { useState } from 'react';
import '../styles/design-system.css';

/**
 * FormComponent
 * Allows creating and filling forms in group chats
 */
const FormComponent = ({ form, onSubmit, userResponse }) => {
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [formData, setFormData] = useState({});

    const handleInputChange = (fieldId, value) => {
        setFormData({ ...formData, [fieldId]: value });
    };

    const handleSubmit = () => {
        // Validate required fields (simplified)
        const isValid = form.fields.every(field => field.required ? formData[field.id] : true);

        if (isValid) {
            onSubmit(form.id, formData);
            setShowResponseModal(false);
        } else {
            alert('Please fill all required fields');
        }
    };

    const isCreator = form.sender.id === 'current_user';
    const hasResponded = !!userResponse;

    return (
        <div className="form-card glass-panel-light">
            <div className="form-header">
                <div className="form-icon">📝</div>
                <div className="form-info">
                    <h4 className="form-title text-devanagari">{form.title}</h4>
                    <span className="form-meta">{form.fields.length} Questions • {form.responseCount} Responses</span>
                </div>
            </div>

            <p className="form-description">{form.description}</p>

            {hasResponded ? (
                <div className="response-status">
                    <span className="check-icon">✓</span>
                    <span className="text-devanagari">You have submitted this form</span>
                    {isCreator && (
                        <button className="btn-link mt-sm">View All Responses</button>
                    )}
                </div>
            ) : (
                <button
                    className="btn btn-primary width-full haptic-click mt-md"
                    onClick={() => setShowResponseModal(true)}
                >
                    Fill Form
                </button>
            )}

            <style jsx>{`
                .form-card {
                    padding: var(--space-md);
                    border-radius: var(--radius-md);
                    margin: var(--space-sm) 0;
                    width: 100%;
                    max-width: 300px;
                    border-left: 4px solid var(--accent-neem);
                }

                .form-header {
                    display: flex;
                    gap: var(--space-md);
                    align-items: center;
                    margin-bottom: var(--space-sm);
                }

                .form-icon {
                    width: 32px;
                    height: 32px;
                    background: rgba(76, 175, 80, 0.1);
                    color: var(--accent-neem);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                }

                .form-info { flex: 1; }

                .form-title {
                    margin: 0;
                    font-size: 16px;
                    color: var(--primary-dark);
                }

                .form-meta {
                    font-size: 11px;
                    color: rgba(0,0,0,0.5);
                }

                .form-description {
                    font-size: 13px;
                    color: rgba(0,0,0,0.7);
                    margin: 0 0 var(--space-md) 0;
                    line-height: 1.4;
                }

                .response-status {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    padding: var(--space-sm);
                    background: rgba(76, 175, 80, 0.05);
                    border-radius: var(--radius-sm);
                    color: var(--accent-neem);
                    font-size: 13px;
                    font-weight: 500;
                }
                
                .mt-sm { margin-top: var(--space-sm); }
                .mt-md { margin-top: var(--space-md); }
                .width-full { width: 100%; }
            `}</style>

            {showResponseModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel">
                        <div className="modal-header">
                            <h3 className="text-devanagari">{form.title}</h3>
                            <button className="close-btn" onClick={() => setShowResponseModal(false)}>×</button>
                        </div>

                        <div className="form-fields-scroll">
                            {form.fields.map(field => (
                                <div key={field.id} className="form-field mb-md">
                                    <label className="field-label">
                                        {field.label} {field.required && <span className="required">*</span>}
                                    </label>

                                    {field.type === 'text' && (
                                        <input
                                            type="text"
                                            className="input width-full"
                                            placeholder="Your answer"
                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                        />
                                    )}

                                    {field.type === 'number' && (
                                        <input
                                            type="number"
                                            className="input width-full"
                                            placeholder="0"
                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                        />
                                    )}

                                    {field.type === 'date' && (
                                        <input
                                            type="date"
                                            className="input width-full"
                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowResponseModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleSubmit}>Submit</button>
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
                            width: 90%; max-width: 400px;
                            max-height: 80vh;
                            display: flex; flex-direction: column;
                            padding: var(--space-lg);
                            border-radius: var(--radius-lg);
                            background: white;
                        }
                        .modal-header {
                            display: flex; justify-content: space-between; align-items: center;
                            margin-bottom: var(--space-md);
                        }
                        .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; }
                        
                        .form-fields-scroll {
                            overflow-y: auto;
                            padding-right: 4px;
                            margin-bottom: var(--space-lg);
                        }
                        
                        .field-label {
                            display: block; font-size: 14px; font-weight: 600;
                            margin-bottom: 4px; color: var(--primary-dark);
                        }
                        .required { color: var(--neutral-terracotta); margin-left: 2px; }
                        
                        .modal-footer { display: flex; justify-content: flex-end; gap: var(--space-md); }
                        
                        .btn-secondary {
                            background: transparent; border: 1px solid rgba(0,0,0,0.2);
                            padding: 8px 16px; border-radius: var(--radius-full); cursor: pointer;
                        }
                        .btn-primary {
                            background: var(--accent-marigold); color: white; border: none;
                            padding: 8px 16px; border-radius: var(--radius-full); cursor: pointer;
                        }
                     `}</style>
                </div>
            )}
        </div>
    );
};

export const CreateFormModal = ({ onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fields, setFields] = useState([
        { id: 1, type: 'text', label: '', required: true }
    ]);

    const handleAddField = () => {
        setFields([...fields, { id: Date.now(), type: 'text', label: '', required: true }]);
    };

    const handleFieldChange = (id, key, value) => {
        setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
    };

    const handleRemoveField = (id) => {
        if (fields.length > 1) {
            setFields(fields.filter(f => f.id !== id));
        }
    };

    const handleSubmit = () => {
        if (title.trim() && fields.every(f => f.label.trim())) {
            onSubmit({ title, description, fields });
        } else {
            alert('Please fill field labels');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel">
                <h3 className="text-devanagari">Create New Form</h3>

                <div className="scroll-area">
                    <input
                        type="text"
                        className="input width-full mb-sm"
                        placeholder="Form Title (e.g., T-Shirt Size)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        className="input width-full mb-lg"
                        placeholder="Description (optional)"
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div className="fields-list">
                        <label className="section-label">Questions</label>
                        {fields.map((field, idx) => (
                            <div key={field.id} className="field-editor mb-sm">
                                <div className="field-row">
                                    <input
                                        type="text"
                                        className="input flex-1"
                                        placeholder={`Question ${idx + 1}`}
                                        value={field.label}
                                        onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
                                    />
                                    <select
                                        className="input select-type"
                                        value={field.type}
                                        onChange={(e) => handleFieldChange(field.id, 'type', e.target.value)}
                                    >
                                        <option value="text">Text</option>
                                        <option value="number">Number</option>
                                        <option value="date">Date</option>
                                    </select>
                                </div>
                                <div className="field-options">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={field.required}
                                            onChange={(e) => handleFieldChange(field.id, 'required', e.target.checked)}
                                        /> Required
                                    </label>
                                    {fields.length > 1 && (
                                        <button className="remove-btn" onClick={() => handleRemoveField(field.id)}>Remove</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="btn-link" onClick={handleAddField}>+ Add Question</button>
                    <div className="action-buttons">
                        <button className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button className="btn-primary" onClick={handleSubmit}>Create</button>
                    </div>
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
                    width: 95%; max-width: 450px;
                    max-height: 85vh;
                    display: flex; flex-direction: column;
                    padding: var(--space-lg);
                    border-radius: var(--radius-lg);
                    background: white;
                }
                .scroll-area {
                    flex: 1; overflow-y: auto;
                    margin-bottom: var(--space-md);
                    padding-right: 4px;
                }
                .field-editor {
                    background: rgba(0,0,0,0.02);
                    padding: var(--space-sm);
                    border-radius: var(--radius-sm);
                    border: 1px solid rgba(0,0,0,0.05);
                }
                .field-row { display: flex; gap: 8px; margin-bottom: 8px; }
                .flex-1 { flex: 1; }
                .select-type { width: 90px; }
                
                .field-options {
                    display: flex; justify-content: space-between; align-items: center;
                    font-size: 12px;
                }
                .remove-btn { color: var(--neutral-terracotta); background: none; border: none; cursor: pointer; }
                
                .modal-actions {
                    display: flex; justify-content: space-between; align-items: center;
                    padding-top: var(--space-md);
                    border-top: 1px solid rgba(0,0,0,0.1);
                }
                .action-buttons { display: flex; gap: var(--space-md); }
                
                .section-label {
                    display: block; font-size: 12px; font-weight: 600;
                    margin-bottom: 8px; color: rgba(0,0,0,0.5); text-transform: uppercase;
                }
                .mb-md { margin-bottom: var(--space-md); }
                .mb-lg { margin-bottom: var(--space-lg); }
                .input { 
                    padding: 8px; border: 1px solid rgba(0,0,0,0.1); 
                    border-radius: 4px; width: 100%; box-sizing: border-box;
                }
                .input:focus { border-color: var(--accent-marigold); outline: none; }
                
                .btn-link { color: var(--accent-marigold); background: none; border: none; cursor: pointer; font-weight: 600; }
                .btn-secondary {
                    background: transparent; border: 1px solid rgba(0,0,0,0.2);
                    padding: 8px 16px; border-radius: var(--radius-full); cursor: pointer;
                }
                .btn-primary {
                    background: var(--accent-neem); color: white; border: none;
                    padding: 8px 16px; border-radius: var(--radius-full); cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default FormComponent;
