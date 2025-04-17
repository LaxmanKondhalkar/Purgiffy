import React, { useState, useEffect } from 'react';
import './Settings.css';

interface SettingsProps {
  isInPopup?: boolean;
}

interface Config {
  provider: 'ollama' | 'openai' | 'deepseek' | 'gemini';
  apiKey?: string;
  providerModel?: string;
  ollamaBaseUrl: string;
  ollamaModel: string;
  autoCheckEnabled: boolean;
}

const defaultConfig: Config = {
  provider: 'ollama',
  ollamaBaseUrl: 'http://localhost:11434',
  ollamaModel: 'tinyllama',
  autoCheckEnabled: true
};

export const Settings: React.FC<SettingsProps> = ({ isInPopup = false }) => {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [status, setStatus] = useState<string>('');
  const [ollamaStatus, setOllamaStatus] = useState<{ connected: boolean; models: string[] }>({
    connected: false,
    models: []
  });

  useEffect(() => {
    // Load config on mount
    chrome.storage.sync.get('purgifyConfig', (result) => {
      if (result.purgifyConfig) {
        setConfig({ ...defaultConfig, ...result.purgifyConfig });
        checkOllamaStatus(result.purgifyConfig.ollamaBaseUrl || defaultConfig.ollamaBaseUrl);
      } else {
        checkOllamaStatus(defaultConfig.ollamaBaseUrl);
      }
    });
  }, []);

  const checkOllamaStatus = (host: string) => {
    chrome.runtime.sendMessage(
      { action: 'checkOllamaStatus', host },
      (response) => {
        if (response && response.success) {
          setOllamaStatus({
            connected: true,
            models: response.models || []
          });
        } else {
          setOllamaStatus({
            connected: false,
            models: []
          });
        }
      }
    );
  };

  const handleSave = async () => {
    try {
      chrome.storage.sync.set({ purgifyConfig: config }, () => {
        setStatus('Settings saved successfully!');
        setTimeout(() => setStatus(''), 3000);
      });
    } catch (err) {
      setStatus('Error saving settings');
      console.error('Error saving settings:', err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name === 'provider') {
      setConfig({
        ...config,
        provider: value as Config['provider']
      });
    } else if (name === 'apiKey' || name === 'providerModel' || name === 'ollamaBaseUrl' || name === 'ollamaModel') {
      setConfig({
        ...config,
        [name]: value
      });
    } else if (name === 'autoCheckEnabled') {
      setConfig({
        ...config,
        autoCheckEnabled: (e.target as HTMLInputElement).checked
      });
    }
  };

  const handleOllamaCheck = () => {
    checkOllamaStatus(config.ollamaBaseUrl);
  };

  return (
    <div className={`settings-container ${isInPopup ? 'in-popup' : ''}`}>
      <h1>Purgify Settings</h1>

      <div className="settings-section">
        <h2>LLM Provider</h2>
        <div className="setting-row">
          <label htmlFor="provider">Provider:</label>
          <select
            id="provider"
            name="provider"
            value={config.provider}
            onChange={handleChange}
          >
            <option value="ollama">Ollama (local)</option>
            <option value="openai">OpenAI</option>
            <option value="deepseek">DeepSeek</option>
            <option value="gemini">Gemini Studio</option>
          </select>
        </div>
      </div>

      {config.provider === 'ollama' && (
        <div className="settings-section">
          <h2>Ollama Connection</h2>
          <div className="setting-row">
            <label htmlFor="ollamaBaseUrl">Ollama URL:</label>
            <input
              type="text"
              id="ollamaBaseUrl"
              name="ollamaBaseUrl"
              value={config.ollamaBaseUrl}
              onChange={handleChange}
            />
            <button onClick={handleOllamaCheck} className="test-button">
              Test Connection
            </button>
          </div>
          <div className="status-indicator">
            Connection: 
            <span className={ollamaStatus.connected ? 'status-ok' : 'status-error'}>
              {ollamaStatus.connected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
          <div className="setting-row">
            <label htmlFor="ollamaModel">Model:</label>
            <select
              id="ollamaModel"
              name="ollamaModel"
              value={config.ollamaModel}
              onChange={handleChange}
            >
              {ollamaStatus.models.length > 0 ? (
                ollamaStatus.models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))
              ) : (
                <option value={config.ollamaModel}>{config.ollamaModel}</option>
              )}
            </select>
          </div>
        </div>
      )}

      {(config.provider === 'openai' || config.provider === 'deepseek' || config.provider === 'gemini') && (
        <div className="settings-section">
          <h2>{config.provider.charAt(0).toUpperCase() + config.provider.slice(1)} Settings</h2>
          <div className="setting-row">
            <label htmlFor="apiKey">API Key:</label>
            <input
              type="password"
              id="apiKey"
              name="apiKey"
              value={config.apiKey || ''}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="setting-row">
            <label htmlFor="providerModel">Model:</label>
            <input
              type="text"
              id="providerModel"
              name="providerModel"
              value={config.providerModel || ''}
              onChange={handleChange}
              placeholder={
                config.provider === 'openai' ? 'e.g. gpt-3.5-turbo' :
                config.provider === 'deepseek' ? 'e.g. deepseek-chat' :
                'e.g. gemini-pro'
              }
            />
          </div>
        </div>
      )}

      <div className="settings-section">
        <h2>Auto Grammar Check</h2>
        <div className="setting-row checkbox-row">
          <label>
            <input
              type="checkbox"
              name="autoCheckEnabled"
              checked={config.autoCheckEnabled}
              onChange={handleChange}
            />
            Enable automatic grammar checking
          </label>
        </div>
        <p className="setting-description">
          When enabled, Purgify will automatically check for grammar issues as you type in text fields.
        </p>
      </div>

      <div className="save-section">
        <button onClick={handleSave} className="save-button">Save Settings</button>
        {status && <div className="status-message">{status}</div>}
      </div>
    </div>
  );
};

export default Settings;