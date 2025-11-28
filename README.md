# Azure Infrastructure AI Assistant

An AI-powered chat interface that allows non-technical team members to query Azure infrastructure using natural language. Built with React, TypeScript, Azure OpenAI, and Azure SDKs, featuring a modern ChatGPT-style UI.

## 🎯 Project Purpose

This project bridges the gap between technical Azure infrastructure and non-technical team members by providing an intuitive chat interface where users can ask questions about their Azure resources in plain English. The system intelligently analyzes queries, extracts relevant parameters, and fetches real-time data from Azure using the Azure SDKs.

## ✨ Key Features

### 🤖 AI-Powered Query Processing
- **Natural Language Understanding**: Ask questions in plain English about Azure resources
- **Intelligent Query Analysis**: Automatically understands intent and extracts relevant parameters
- **Real-time Azure Data**: Queries live Azure infrastructure via Azure SDKs
- **Azure OpenAI Integration**: Uses GPT models for intelligent response generation

### 💬 Modern Chat Interface
- **ChatGPT-Style UI**: Clean, modern interface with user messages on right, AI responses on left
- **Markdown Rendering**: Rich text formatting for AI responses with code blocks, tables, and lists
- **File Upload Support**: Upload and analyze Azure-related documents (PDFs, Word docs, etc.)
- **Conversation History**: Persistent chat history with sidebar navigation
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🔧 Azure Resource Support
- **Virtual Machines**: Status, SKU, configuration, performance metrics
- **Databases**: SQL, CosmosDB, configuration and performance data
- **Virtual Networks**: Subnets, address spaces, security groups
- **Storage Accounts**: Configuration, replication types, access tiers
- **Resource Groups**: Resource inventory and organization
- **Cost Analysis**: Billing information and cost optimization insights

## 🏗️ Architecture Overview

```
Azure Infrastructure AI Assistant
├── Frontend (React + TypeScript + Vite)
│   ├── ChatGPT-style UI components
│   ├── Real-time chat interface
│   ├── File upload and management
│   └── Responsive design system
├── Backend (Node.js + Express)
│   ├── Azure SDK integration
│   ├── OpenAI query processing
│   ├── File upload handling
│   └── REST API endpoints
└── Azure Services
    ├── Azure OpenAI (GPT models)
    ├── Azure Resource Manager
    ├── Azure Blob Storage (file uploads)
    └── Azure Cost Management
```

## 🎨 UI Components Built

### Core Chat Interface Components

#### [`ChatMessages.tsx`](frontend/src/pages/azure-chat/components/ChatMessages.tsx)
- **Purpose**: Renders the main chat conversation
- **Features**:
  - User messages displayed on right with gray bubbles
  - AI responses on left with clean, unbubbled layout
  - Markdown rendering with syntax highlighting
  - File attachment display with icons and metadata
  - Loading states with animated indicators

#### [`ChatInput.tsx`](frontend/src/pages/azure-chat/components/ChatInput.tsx)
- **Purpose**: Message input and file upload interface
- **Features**:
  - Clean white background with subtle borders
  - Auto-expanding text area
  - File upload integration
  - Send button with proper disabled states
  - Keyboard shortcuts (Enter to send, Shift+Enter for new line)

#### [`WelcomeScreen.tsx`](frontend/src/pages/azure-chat/components/WelcomeScreen.tsx)
- **Purpose**: Initial screen with example queries
- **Features**:
  - Centered ChatGPT logo
  - Example query cards with hover effects
  - 2-column responsive grid layout
  - Clean, minimal design

#### [`ChatHeader.tsx`](frontend/src/pages/azure-chat/components/ChatHeader.tsx)
- **Purpose**: Top navigation bar
- **Features**:
  - Clean white header with simple title
  - Sidebar toggle button
  - New chat button
  - Minimal, distraction-free design

#### [`Sidebar.tsx`](frontend/src/pages/azure-chat/components/Sidebar.tsx)
- **Purpose**: Conversation history and navigation
- **Features**:
  - Dark theme matching ChatGPT
  - Conversation list with active state highlighting
  - New chat creation
  - Conversation deletion
  - User profile section

### File Management Components

#### [`FileUpload.tsx`](frontend/src/pages/azure-chat/components/FileUpload.tsx)
- **Purpose**: File selection and drag-drop interface
- **Features**:
  - Drag and drop file upload
  - Click to select files
  - Multiple file support
  - File type validation
  - Visual feedback during drag operations

#### [`UploadedFiles.tsx`](frontend/src/pages/azure-chat/components/UploadedFiles.tsx)
- **Purpose**: Display and manage uploaded files
- **Features**:
  - File cards with type-specific icons
  - Upload progress indicators
  - File removal functionality
  - Status indicators (uploading, completed, error)
  - File size and name display

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Azure subscription with resources
- Azure Service Principal with appropriate permissions
- Azure OpenAI service deployed

### Required Azure Permissions

Your Service Principal needs the following roles:
- `Reader` role on the subscription or resource groups
- `Cost Management Reader` for cost queries
- Access to Azure OpenAI service

### Installation & Setup

1. **Clone and Install Dependencies**

```bash
# Clone the project
git clone <repository-url>
cd azure-infra-assistant

# Install dependencies for both frontend and backend
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

2. **Configure Environment Variables**

Create a `.env` file in the `backend` directory:

```properties
# Azure Configuration
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_SUBSCRIPTION_ID=your-subscription-id

# Azure OpenAI Configuration
AZURE_OPENAI_API_KEY=your-openai-key
AZURE_OPENAI_ENDPOINT=https://your-openai-endpoint.cognitiveservices.azure.com
AZURE_OPENAI_API_VERSION=2025-01-01-preview
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# Application Configuration
PORT=3001
NODE_ENV=development
LOG_LEVEL=info

# Optional: Limit queries to specific resource groups
RESOURCE_GROUPS=rg-dev,rg-prod,rg-staging
```

3. **Start the Application**

```bash
# Start both frontend and backend (recommended for development)
npm run dev

# Or start individually:
# Backend only
npm run backend

# Frontend only  
npm run frontend

# Production build and start
npm run build
npm start
```

4. **Access the Application**

Open your browser and navigate to `http://localhost:3000`

## 💬 Example Queries

### Virtual Machines
- "What is the status of my production VM?"
- "Show me all VMs in resource group XYZ"
- "What is the size of dami-vm?"

### Databases
- "List all storage accounts in my subscription"
- "What is the SKU of the production database?"
- "Show me database performance metrics"

### Networks
- "How many subnets are in the main vnet?"
- "Show me the address space of production-vnet"
- "What security groups are applied to web-subnet?"

### Costs
- "What are the costs for my Azure resources this month?"
- "Show me spending for production resources last quarter"
- "What is the cost breakdown by service?"

### General
- "List all resources in development resource group"
- "How many resources are in production?"
- "What is the location of app-service-1?"

## 📁 Project Structure

```
azure-infra-assistant/
├── frontend/                    # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/azure-chat/    # Main chat interface
│   │   │   ├── components/      # UI components
│   │   │   │   ├── ChatMessages.tsx    # Message rendering
│   │   │   │   ├── ChatInput.tsx       # Input interface
│   │   │   │   ├── WelcomeScreen.tsx   # Landing screen
│   │   │   │   ├── ChatHeader.tsx      # Top navigation
│   │   │   │   ├── Sidebar.tsx         # Conversation history
│   │   │   │   ├── FileUpload.tsx      # File upload
│   │   │   │   └── UploadedFiles.tsx   # File management
│   │   │   ├── page.tsx        # Main chat page
│   │   │   └── types.ts        # TypeScript definitions
│   │   └── App.tsx             # Root component
├── backend/                    # Node.js + Express backend
│   ├── server.js              # Express server
│   ├── azureQueryHandler.js   # Main query processing
│   ├── queryAnalyzer.js       # Query intent analysis
│   ├── azureResourceClient.js # Azure SDK integration
│   ├── promptLoader.js        # AI prompt management
│   └── test-connection.js     # Connection testing
├── prompts/                   # AI prompt templates
│   ├── query-analyzer.txt     # Query analysis prompts
│   ├── response-generator.txt # Response generation prompts
│   └── test-connection.txt    # Connection test prompts
└── package.json              # Project configuration
```

## 🔧 Configuration Options

### Resource Group Filtering

Limit queries to specific resource groups:

```properties
RESOURCE_GROUPS=rg-dev,rg-prod,rg-staging
```

### File Upload Settings

Configure supported file types and size limits in the frontend components.

### UI Customization

The ChatGPT-style interface can be customized through:
- Tailwind CSS classes in component files
- Color schemes in the design system
- Layout adjustments in component structures

## 🛠️ Troubleshooting

### Common Issues

**"Authentication Failed"**
- Verify Azure credentials in backend `.env` file
- Ensure Service Principal has proper permissions
- Check credential expiration

**"OpenAI Connection Failed"**
- Verify OpenAI endpoint and API key
- Check deployment name matches your Azure OpenAI deployment
- Ensure API version is supported

**"File Upload Not Working"**
- Check backend upload endpoint is running
- Verify file size and type restrictions
- Check Azure Blob Storage configuration

**"UI Not Loading Properly"**
- Ensure both frontend and backend are running
- Check browser console for JavaScript errors
- Verify all dependencies are installed

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use Azure Key Vault** for production credential management
3. **Implement proper RBAC** - Grant minimal required permissions
4. **Enable CORS properly** for frontend-backend communication
5. **Validate file uploads** to prevent security risks
6. **Use HTTPS** in production environments

## 🚢 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
# Build and run with Docker
docker build -t azure-infra-assistant .
docker run -p 3000:3000 azure-infra-assistant
```

### Azure App Service
```bash
az webapp up --name azure-infra-assistant --resource-group your-rg --runtime "NODE|18-lts"
```

## 🤝 Contributing

Areas for improvement and contribution:
- Enhanced Azure resource type support
- Advanced query capabilities with KQL integration
- Multi-subscription support
- Enhanced security features
- Performance optimizations
- Additional UI themes and customization options

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Azure SDK documentation
3. Verify Azure OpenAI service status
4. Check server logs for detailed error messages

## 🎉 What's Next?

- Add support for Azure Monitor metrics and alerts
- Implement KQL query generation for Log Analytics
- Add export functionality for query results
- Create customizable dashboards for common queries
- Implement user authentication and role-based access
- Add support for Azure Policy and compliance queries
- Enhanced file analysis with document intelligence