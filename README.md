# OM Agents UI - React

A modern, responsive React-based UI for the OutMarket AI agent system. This project uses Material UI with a clean, professional design.

## Features

- Secure login system with token management
- Clean, responsive user interface
- Multiple agent support with easy switching between agents:
  - **OM Assistant** - General purpose assistant for everyday tasks
  - **Appetite Agent** - Specialized for insurance carrier exploration
- Agent chat with streaming response support
- Settings management for agent configuration
- Local storage for session persistence

## Technologies

- React (Create React App)
- React Router for navigation
- Material UI for components and styling
- Axios for API requests
- React Markdown for rendering markdown content

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd agent-ui-react
```

2. Install the required dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables (or copy from `.env.example`):
```
REACT_APP_API_BASE_URL=https://api.stage.outmarket.ai/v1
REACT_APP_AGENT_API_URL=http://localhost:9000
REACT_APP_TITLE=OM Agents
REACT_APP_DESCRIPTION=Your Intelligent AI Assistant
```

## Usage

1. Start the development server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Log in with your OutMarket AI credentials.

4. Choose between OM Assistant and Appetite Agent depending on your needs:
   - Use **OM Assistant** for general information, common questions, and everyday tasks
   - Use **Appetite Agent** for specialized insurance-related questions and carrier research

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The build files will be created in the `build` directory, ready to be deployed to a web server.

## Project Structure

```
agent-ui-react/
├── public/                 # Static files
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React contexts for state management
│   ├── pages/              # Full page components
│   ├── services/           # API and utility services
│   ├── utils/              # Helper utilities
│   ├── App.js              # Main app component with routing
│   └── index.js            # Application entry point
├── .env                    # Environment variables
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

## Authentication

The application uses token-based authentication, storing tokens securely in localStorage for persistence between sessions. The AuthContext provides authentication state and methods throughout the application.

## Chat System

The chat interface supports:
- Multiple AI agents with different specializations
- Visual distinction between different agent responses
- Markdown rendering for rich text responses
- Streaming responses with real-time updates
- Tool usage visualization
- Automatic scrolling to the latest messages

## Security Notes

- Authentication tokens are stored in browser localStorage
- All API requests use HTTPS
- Input validation is implemented for all user inputs

## License

© OutMarket AI - All rights reserved 