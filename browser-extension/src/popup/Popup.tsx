import React, { useState, useEffect } from 'react';
import './styles.css';
import PermissionRequest from './PermissionRequest';
import { createRoot } from 'react-dom/client';
import Settings from '../components/Settings';

// Import Options from the options directory
import '../options';

interface PopupProps {}

const Popup: React.FC<PopupProps> = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const handleGrammarFix = () => {
    if (!inputText.trim()) {
      setError('Please enter some text to process');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    chrome.runtime.sendMessage(
      { action: 'fixGrammar', text: inputText },
      (response) => {
        setIsProcessing(false);
        if (response && response.success) {
          setOutputText(response.result);
        } else {
          setError(response?.error || 'An error occurred');
        }
      }
    );
  };
  
  const handleRephrase = () => {
    if (!inputText.trim()) {
      setError('Please enter some text to process');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    chrome.runtime.sendMessage(
      { action: 'rephrase', text: inputText },
      (response) => {
        setIsProcessing(false);
        if (response && response.success) {
          setOutputText(response.result);
        } else {
          setError(response?.error || 'An error occurred');
        }
      }
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
  };
  
  const openSettings = () => {
    // Render settings modal in the popup
    setShowSettings(true);
  };
  
  const closeSettings = () => {
    setShowSettings(false);
  };
  
  return (
    <div className="popup-container">
      <header className="popup-header">
        <h1>Purgify</h1>
        <p>AI-powered writing enhancement</p>
      </header>
      
      <div className="input-section">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your text here..."
          rows={5}
          disabled={isProcessing}
        />
        
        <div className="button-row">
          <button 
            onClick={handleGrammarFix}
            disabled={isProcessing}
            className="action-button"
          >
            ✅ Fix Grammar
          </button>
          <button 
            onClick={handleRephrase}
            disabled={isProcessing}
            className="action-button"
          >
            🔄 Rephrase
          </button>
        </div>
        
        {isProcessing && <div className="loading">Processing...</div>}
        {error && <div className="error">{error}</div>}
        
        {outputText && (
          <div className="output-section">
            <textarea
              value={outputText}
              readOnly
              rows={5}
            />
            <button onClick={handleCopy} className="copy-button">
              Copy Result
            </button>
          </div>
        )}
      </div>
      
      <div className="footer">
        <button onClick={openSettings} className="settings-button">
          ⚙️ Settings
        </button>
      </div>
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="settings-overlay">
          <div className="settings-modal">
            <button onClick={closeSettings} className="close-button">×</button>
            <Settings isInPopup={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;