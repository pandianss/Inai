import React, { useState, useEffect } from 'react';
import '../styles/design-system.css';

/**
 * OnboardingFlow Component
 * Voice-first onboarding with regional language detection
 * Language suggested based on user's location (geolocation)
 * Implements "Aapka naam kya hai?" voice prompt
 */

const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [userName, setUserName] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [locationInfo, setLocationInfo] = useState(null);

  const languages = [
    { code: 'hi', name: 'हिन्दी', nativeName: 'Hindi', greeting: 'नमस्ते!' },
    { code: 'ta', name: 'தமிழ்', nativeName: 'Tamil', greeting: 'வணக்கம்!' },
    { code: 'te', name: 'తెలుగు', nativeName: 'Telugu', greeting: 'నమస్కారం!' },
    { code: 'bn', name: 'বাংলা', nativeName: 'Bengali', greeting: 'নমস্কার!' },
    { code: 'mr', name: 'मराठी', nativeName: 'Marathi', greeting: 'नमस्कार!' },
    { code: 'gu', name: 'ગુજરાતી', nativeName: 'Gujarati', greeting: 'નમસ્તે!' },
    { code: 'kn', name: 'ಕನ್ನಡ', nativeName: 'Kannada', greeting: 'ನಮಸ್ಕಾರ!' },
    { code: 'ml', name: 'മലയാളം', nativeName: 'Malayalam', greeting: 'നമസ്കാരം!' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', nativeName: 'Punjabi', greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ!' },
    { code: 'en', name: 'English', nativeName: 'English', greeting: 'Hello!' }
  ];

  const prompts = {
    hi: 'आपका नाम क्या है?',
    ta: 'உங்கள் பெயர் என்ன?',
    te: 'మీ పేరు ఏమిటి?',
    bn: 'আপনার নাম কি?',
    mr: 'तुमचे नाव काय आहे?',
    gu: 'તમારું નામ શું છે?',
    kn: 'ನಿಮ್ಮ ಹೆಸರು ಏನು?',
    ml: 'നിങ്ങളുടെ പേര് എന്താണ്?',
    pa: 'ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?',
    en: 'What is your name?'
  };

  useEffect(() => {
    // Detect language based on location (geolocation-based suggestion)
    const detectLanguageByLocation = async () => {
      try {
        // Try to get user's location via IP geolocation
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        setLocationInfo({
          city: data.city,
          region: data.region,
          country: data.country_name
        });

        // Map regions to primary languages
        const regionLanguageMap = {
          'Delhi': 'hi',
          'Uttar Pradesh': 'hi',
          'Bihar': 'hi',
          'Madhya Pradesh': 'hi',
          'Rajasthan': 'hi',
          'Haryana': 'hi',
          'Uttarakhand': 'hi',
          'Himachal Pradesh': 'hi',
          'Tamil Nadu': 'ta',
          'Puducherry': 'ta',
          'Andhra Pradesh': 'te',
          'Telangana': 'te',
          'West Bengal': 'bn',
          'Tripura': 'bn',
          'Maharashtra': 'mr',
          'Goa': 'mr',
          'Gujarat': 'gu',
          'Dadra and Nagar Haveli': 'gu',
          'Karnataka': 'kn',
          'Kerala': 'ml',
          'Lakshadweep': 'ml',
          'Punjab': 'pa',
          'Chandigarh': 'pa'
        };

        const region = data.region || data.city;
        const suggestedLang = regionLanguageMap[region] || 'hi'; // Default to Hindi

        const supportedLang = languages.find(l => l.code === suggestedLang);
        if (supportedLang) {
          setSelectedLanguage(suggestedLang);
          console.log(`Language suggested based on location: ${region} → ${suggestedLang}`);
        }
      } catch (error) {
        // Fallback to browser language if geolocation fails
        console.log('Geolocation failed, using browser language');
        const browserLang = navigator.language.split('-')[0];
        const supportedLang = languages.find(l => l.code === browserLang);
        if (supportedLang) {
          setSelectedLanguage(browserLang);
        } else {
          // Default to Hindi if browser language not supported
          setSelectedLanguage('hi');
        }
      }
    };

    detectLanguageByLocation();
  }, []);

  useEffect(() => {
    if (step === 2) {
      // Simulate voice prompt
      setTimeout(() => {
        playVoicePrompt();
      }, 500);
    }
  }, [step, selectedLanguage]);

  const playVoicePrompt = () => {
    // In production, this would use Web Speech API or Bhashini TTS
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(prompts[selectedLanguage]);
      utterance.lang = selectedLanguage === 'en' ? 'en-IN' : `${selectedLanguage}-IN`;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceInput = () => {
    setIsListening(true);

    // In production, this would use Web Speech API or Bhashini ASR
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLanguage === 'en' ? 'en-IN' : `${selectedLanguage}-IN`;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserName(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      // Fallback: just show input field
      setIsListening(false);
    }
  };

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && userName.trim()) {
      setStep(3);
    } else if (step === 3) {
      onComplete({ language: selectedLanguage, name: userName, location: locationInfo });
    }
  };

  const currentLang = languages.find(l => l.code === selectedLanguage);

  return (
    <div className="onboarding-container">
      <div className="background-rangoli rangoli-pattern"></div>

      <div className="onboarding-content">
        {/* Logo/Branding */}
        <div className="onboarding-logo">
          <div className="logo-circle">
            <span className="logo-text">भा</span>
          </div>
          <h1 className="brand-name text-devanagari">भारत मैसेंजर</h1>
          <p className="brand-tagline">Privacy-first messaging for Bharat</p>
        </div>

        {/* Step 1: Language Selection */}
        {step === 1 && (
          <div className="onboarding-step fade-in">
            <h2 className="step-title">Choose Your Language</h2>
            <p className="step-subtitle">अपनी भाषा चुनें</p>

            {locationInfo && (
              <div className="location-info">
                <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>Suggested for {locationInfo.city}, {locationInfo.region}</span>
              </div>
            )}

            <div className="language-grid">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`language-card glass-panel-light haptic-click ${selectedLanguage === lang.code ? 'language-card-active' : ''
                    }`}
                  onClick={() => setSelectedLanguage(lang.code)}
                >
                  <span className="language-native">{lang.name}</span>
                  <span className="language-english">{lang.nativeName}</span>
                  {selectedLanguage === lang.code && locationInfo && (
                    <span className="suggested-badge">✓ Suggested</span>
                  )}
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary haptic-click continue-btn"
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Name Input */}
        {step === 2 && (
          <div className="onboarding-step fade-in">
            <div className="greeting-animation">
              <span className="greeting-text">{currentLang?.greeting}</span>
            </div>

            <h2 className="step-title" style={{ fontFamily: selectedLanguage !== 'en' ? 'Noto Sans Devanagari' : 'Inter' }}>
              {prompts[selectedLanguage]}
            </h2>

            <div className="input-container">
              <input
                type="text"
                className="input name-input"
                placeholder={selectedLanguage === 'hi' ? 'अपना नाम लिखें' : 'Enter your name'}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{ fontFamily: selectedLanguage !== 'en' ? 'Noto Sans Devanagari' : 'Inter' }}
              />

              <button
                className="btn btn-secondary haptic-click voice-btn"
                onClick={handleVoiceInput}
                disabled={isListening}
              >
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                {isListening ? 'Listening...' : 'Speak'}
              </button>
            </div>

            <button
              className="btn btn-primary haptic-click continue-btn"
              onClick={handleContinue}
              disabled={!userName.trim()}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Privacy & Features */}
        {step === 3 && (
          <div className="onboarding-step fade-in">
            <h2 className="step-title">Welcome, {userName}!</h2>

            <div className="features-list">
              <div className="feature-card glass-panel-light">
                <div className="feature-icon" style={{ background: 'var(--gradient-accent)' }}>
                  🔒
                </div>
                <div className="feature-card-content">
                  <h3>End-to-End Encrypted</h3>
                  <p>Your messages are completely private</p>
                </div>
              </div>

              <div className="feature-card glass-panel-light">
                <div className="feature-icon" style={{ background: 'var(--accent-neem)' }}>
                  🗣️
                </div>
                <div className="feature-card-content">
                  <h3>AI Translation</h3>
                  <p>Speak in any Indian language</p>
                </div>
              </div>

              <div className="feature-card glass-panel-light">
                <div className="feature-icon" style={{ background: 'var(--neutral-terracotta)' }}>
                  💰
                </div>
                <div className="feature-card-content">
                  <h3>UPI Payments</h3>
                  <p>Pay directly in chat</p>
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary haptic-click continue-btn"
              onClick={handleContinue}
            >
              Get Started
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .onboarding-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-lg);
          position: relative;
          overflow: hidden;
        }

        .onboarding-content {
          max-width: 600px;
          width: 100%;
          z-index: 1;
        }

        .onboarding-logo {
          text-align: center;
          margin-bottom: var(--space-2xl);
        }

        .logo-circle {
          width: 120px;
          height: 120px;
          margin: 0 auto var(--space-lg);
          border-radius: var(--radius-full);
          background: var(--gradient-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg), var(--shadow-glow);
          animation: logo-pulse 3s ease-in-out infinite;
        }

        @keyframes logo-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .logo-text {
          font-size: 64px;
          font-weight: 700;
          color: white;
        }

        .brand-name {
          color: white;
          margin-bottom: var(--space-sm);
        }

        .brand-tagline {
          color: rgba(255, 255, 255, 0.7);
          font-size: var(--font-size-sm);
        }

        .onboarding-step {
          animation: fade-in 0.5s ease-out;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .step-title {
          color: white;
          text-align: center;
          margin-bottom: var(--space-sm);
        }

        .step-subtitle {
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          margin-bottom: var(--space-xl);
        }

        .location-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          padding: var(--space-md);
          background: rgba(255, 153, 51, 0.1);
          border-radius: var(--radius-md);
          color: var(--accent-marigold);
          margin-bottom: var(--space-lg);
          font-size: var(--font-size-sm);
        }

        .location-info .icon {
          width: 20px;
          height: 20px;
        }

        .language-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
        }

        .language-card {
          padding: var(--space-lg);
          text-align: center;
          border: 2px solid transparent;
          transition: all var(--transition-base);
          background: var(--glass-light);
          position: relative;
        }

        .language-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .language-card-active {
          border-color: var(--accent-marigold);
          background: var(--glass-accent);
        }

        .language-native {
          display: block;
          font-size: var(--font-size-xl);
          font-weight: 600;
          margin-bottom: var(--space-xs);
        }

        .language-english {
          display: block;
          font-size: var(--font-size-sm);
          opacity: 0.7;
        }

        .suggested-badge {
          display: block;
          margin-top: var(--space-sm);
          padding: var(--space-xs) var(--space-sm);
          background: var(--accent-neem);
          color: white;
          border-radius: var(--radius-full);
          font-size: var(--font-size-xs);
          font-weight: 600;
        }

        .greeting-animation {
          text-align: center;
          margin-bottom: var(--space-xl);
        }

        .greeting-text {
          display: inline-block;
          font-size: var(--font-size-3xl);
          animation: greeting-bounce 1s ease-out;
        }

        @keyframes greeting-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .input-container {
          display: flex;
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
        }

        .name-input {
          flex: 1;
        }

        .voice-btn {
          min-width: 120px;
        }

        .continue-btn {
          width: 100%;
          padding: var(--space-lg);
          font-size: var(--font-size-lg);
        }

        .features-list {
          display: grid;
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
        }

        .feature-card {
          display: flex;
          align-items: flex-start;
          gap: var(--space-md);
          padding: var(--space-lg);
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          flex-shrink: 0;
        }

        .feature-card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .feature-card h3 {
          margin: 0 0 var(--space-xs) 0;
          color: var(--primary-dark);
          font-size: var(--font-size-lg);
        }

        .feature-card p {
          margin: 0;
          font-size: var(--font-size-sm);
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .language-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .input-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default OnboardingFlow;
