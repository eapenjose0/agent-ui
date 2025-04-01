#!/bin/bash

# OM Agents UI - React Startup Script

# Load environment variables if .env file exists
if [ -f .env ]; then
  echo "Loading environment variables from .env file..."
  export $(grep -v '^#' .env | xargs)
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "Node.js is not installed. Please install Node.js and npm."
  exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo "npm is not installed. Please install npm."
  exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the development server
echo "Starting OM Agents UI..."
echo "API URL: $REACT_APP_API_BASE_URL"
echo "Agent API URL: $REACT_APP_AGENT_API_URL"

npm start 