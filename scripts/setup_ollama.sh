#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=======================================${NC}"
echo -e "${YELLOW}    Purgify - Complete Ollama Setup    ${NC}"
echo -e "${YELLOW}=======================================${NC}"
echo

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
  echo -e "${RED}Error: This script is designed for macOS.${NC}"
  echo -e "For Linux, please see: docs/linux.md"
  echo -e "For Windows, manually set OLLAMA_ORIGINS environment variable."
  exit 1
fi

# Step 1: Check if Ollama is installed
echo -e "1. ${YELLOW}Checking if Ollama is installed...${NC}"
if ! command -v ollama &> /dev/null; then
  echo -e "${RED}Ollama is not installed.${NC}"
  echo -e "${YELLOW}Installing Ollama...${NC}"
  
  # Download and install Ollama
  curl -fsSL https://ollama.ai/install.sh | sh
  
  # Verify installation
  if ! command -v ollama &> /dev/null; then
    echo -e "${RED}Failed to install Ollama automatically.${NC}"
    echo -e "Please visit https://ollama.ai/download and install manually."
    echo -e "Then run this script again."
    exit 1
  else
    echo -e "${GREEN}✓ Ollama installed successfully.${NC}"
  fi
else
  echo -e "${GREEN}✓ Ollama is already installed.${NC}"
fi
echo

# Step 2: Setting environment variable
echo -e "2. ${YELLOW}Setting OLLAMA_ORIGINS environment variable...${NC}"
export OLLAMA_ORIGINS="chrome-extension://*"
echo -e "${GREEN}✓ Environment variable set.${NC}"
echo

# Step 3: Check and install TinyLlama model
echo -e "3. ${YELLOW}Checking if TinyLlama model is available...${NC}"
if ollama list | grep -q "tinyllama"; then
  echo -e "${GREEN}✓ TinyLlama model is already installed.${NC}"
else
  echo -e "${YELLOW}TinyLlama model not found. Installing (this may take a few minutes)...${NC}"
  ollama pull tinyllama
  
  # Verify model installation
  if ollama list | grep -q "tinyllama"; then
    echo -e "${GREEN}✓ TinyLlama model installed successfully.${NC}"
  else
    echo -e "${RED}Failed to install TinyLlama model. Please try manually:${NC}"
    echo -e "   ollama pull tinyllama"
  fi
fi
echo

# Step 4: Start or restart Ollama service
echo -e "4. ${YELLOW}Managing Ollama service...${NC}"
if pgrep -x "ollama" > /dev/null; then
  echo -e "${YELLOW}Ollama is running. Restarting...${NC}"
  pkill ollama
  sleep 2
  
  # Check if Ollama was successfully stopped
  if pgrep -x "ollama" > /dev/null; then
    echo -e "${RED}Failed to stop Ollama. Please restart it manually:${NC}"
    echo -e "   pkill ollama"
    echo -e "   ollama serve"
  else
    echo -e "${GREEN}✓ Ollama stopped.${NC}"
    echo -e "${YELLOW}Starting Ollama with proper CORS settings...${NC}"
    nohup ollama serve > /tmp/ollama.log 2>&1 &
    sleep 3
    echo -e "${GREEN}✓ Ollama started with chrome-extension://* origin allowed.${NC}"
  fi
else
  echo -e "${YELLOW}Ollama is not running. Starting...${NC}"
  nohup ollama serve > /tmp/ollama.log 2>&1 &
  sleep 3
  echo -e "${GREEN}✓ Ollama started with chrome-extension://* origin allowed.${NC}"
fi
echo

# Step 5: Verify Ollama status
echo -e "5. ${YELLOW}Verifying Ollama status...${NC}"
if pgrep -x "ollama" > /dev/null; then
  echo -e "${GREEN}✓ Ollama is running.${NC}"
  echo -e "You can check the Ollama log with: cat /tmp/ollama.log"
else
  echo -e "${RED}× Ollama failed to start.${NC}"
  echo -e "Please start it manually with: ollama serve"
fi
echo

# Step 6: Setup for browser startup (create a launch agent)
echo -e "6. ${YELLOW}Setting up Ollama to start automatically when needed...${NC}"
mkdir -p ~/Library/LaunchAgents
cat > ~/Library/LaunchAgents/ai.ollama.service.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>ai.ollama.service</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/ollama</string>
        <string>serve</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
        <key>OLLAMA_ORIGINS</key>
        <string>chrome-extension://*</string>
    </dict>
    <key>RunAtLoad</key>
    <false/>
    <key>KeepAlive</key>
    <false/>
</dict>
</plist>
EOF
echo -e "${GREEN}✓ Launch agent created at ~/Library/LaunchAgents/ai.ollama.service.plist${NC}"
echo -e "${BLUE}TIP: To make Ollama start automatically when you log in, run:${NC}"
echo -e "   launchctl load ~/Library/LaunchAgents/ai.ollama.service.plist"
echo -e "   launchctl enable user/$(id -u)/ai.ollama.service"
echo

# Final instructions
echo -e "${YELLOW}=======================================${NC}"
echo -e "${GREEN}Setup complete!${NC}"
echo -e "${YELLOW}=======================================${NC}"
echo
echo -e "${BLUE}Using Purgify:${NC}"
echo -e "1. Reload your Purgify extension in Chrome"
echo -e "2. Make sure Ollama is running (it should be now)"
echo -e "3. Select text in any text field and use Purgify's features"
echo
echo -e "If you still see 403 Forbidden errors, check:"
echo -e "  - Ollama is running (check with: pgrep ollama)"
echo -e "  - The OLLAMA_ORIGINS environment variable was set properly"
echo -e "  - Chrome extension has proper permissions"
echo
echo -e "${BLUE}For manual control of Ollama:${NC}"
echo -e "  - Start: ollama serve"
echo -e "  - Stop: pkill ollama"
echo -e "  - Check status: pgrep ollama"
echo
echo -e "${YELLOW}Happy writing with Purgify!${NC}"
