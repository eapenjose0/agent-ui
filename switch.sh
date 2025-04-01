#!/bin/bash

# Script to switch between the Gradio and React versions of OM Agents UI

# Function to display usage information
function show_usage {
  echo "Usage: ./switch.sh [gradio|react]"
  echo ""
  echo "Options:"
  echo "  gradio    Run the original Gradio version (Python)"
  echo "  react     Run the new React version (JavaScript)"
  echo ""
  exit 1
}

# Check if at least one argument was provided
if [ $# -lt 1 ]; then
  show_usage
fi

case "$1" in
  gradio)
    echo "Starting Gradio version (Python)..."
    
    # Check if Python is installed
    if ! command -v python3 &> /dev/null; then
      echo "Python 3 is not installed. Please install Python 3."
      exit 1
    fi
    
    # Check for virtual environment
    if [ ! -d "venv" ]; then
      echo "Creating virtual environment..."
      python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install dependencies
    echo "Installing dependencies..."
    pip install -r requirements.txt
    
    # Run the application
    echo "Running Gradio application..."
    python app.py
    ;;
    
  react)
    echo "Starting React version (JavaScript)..."
    
    # Change to React directory
    cd agent-ui-react
    
    # Run the start script
    if [ -f "run.sh" ]; then
      chmod +x run.sh
      ./run.sh
    else
      echo "Error: run.sh not found in agent-ui-react directory."
      exit 1
    fi
    ;;
    
  *)
    echo "Error: Unknown option '$1'"
    show_usage
    ;;
esac 