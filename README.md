# Purgify

Purgify is a privacy-first Chrome extension that enhances your writing with AI-powered grammar fixing and rephrasing, powered by local LLMs via [Ollama](https://ollama.ai/). Your text never leaves your computer.

---

## ✨ Features

- ✅ **Grammar Fix** — Instantly correct grammar issues while preserving tone and meaning
- 🔁 **Rephrase** — Rewrite sentences for clarity or style
- 🏠 **Local Processing** — Uses Ollama to run LLMs on your own machine (no cloud, no data leaks)
- 🖱️ **Manual & Toolbar Modes** — Paste text in the popup or use the floating toolbar on any text field
- 🌙 **Dark Mode** — Optional dark mode for comfortable editing
- 💾 **Configurable** — Choose your model, prompts, and more in the Options page

---

## 🚀 Quick Start

### 1. Install & Run Ollama

- [Download Ollama](https://ollama.ai/download)
- Pull a model (e.g. TinyLlama):
  ```sh
  ollama pull tinyllama
  ```
- Start the server (with CORS for Chrome extension):
  ```sh
  OLLAMA_ORIGINS="chrome-extension://*" ollama serve
  # or on macOS:
  launchctl setenv OLLAMA_ORIGINS "chrome-extension://*"
  ollama serve
  ```

### 2. Install Purgify Extension

- Clone this repo:
  ```sh
  git clone https://github.com/yourusername/purgify.git
  cd purgify/purgify-extension
  npm install
  npm run build
  ```
- In Chrome, go to `chrome://extensions/`, enable **Developer mode**, click **Load unpacked**, and select the `dist` folder.

---

## 🧑‍💻 Usage

### Manual Workflow (Popup)
1. Copy any text you want to improve
2. Click the Purgify extension icon
3. Paste your text in the popup
4. Click **Fix Grammar** or **Rephrase**
5. Copy the improved result back to any app

### Floating Toolbar (on any text field)
- Select text in any input, textarea, or contenteditable field
- The floating toolbar appears (bottom right)
- Click **Fix Grammar** or **Rephrase**
- Click **Apply** to replace the text

---

## ⚙️ Configuration
- Click the gear/settings icon in the popup or right-click the extension icon > **Options**
- Change the Ollama model, endpoint, or prompt templates
- Enable/disable auto grammar check and dark mode

---

## 🛠️ Development

- `npm install` — Install dependencies
- `npm run build` — Build the extension to `dist/`
- `npm test` — Run tests
- `npm run lint` — Lint and format code

---

## 📝 License

MIT License. See [LICENSE](purgify-extension/LICENSE).

---

## 🙏 Credits
- [Ollama](https://ollama.ai/) for local LLM serving
- [TinyLlama](https://huggingface.co/TinyLlama) and other open models

---

## 📢 Feedback & Contributions

Pull requests and issues are welcome!
