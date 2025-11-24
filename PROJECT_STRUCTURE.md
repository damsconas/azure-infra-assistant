# 📁 Project Structure

Complete overview of the Azure Infrastructure Query System architecture and file organization.

## Directory Tree

```
azure-infrastructure-query/
├── 📄 README.md                    # Main project documentation
├── 📄 SETUP.md                     # Detailed setup instructions
├── 📄 QUICKSTART.md                # Quick start guide
├── 📄 PROJECT_STRUCTURE.md         # This file
├── 📄 package.json                 # Root package.json with convenience scripts
├── 📄 .gitignore                   # Git ignore rules
│
├── 🚀 start.sh                     # Linux/Mac startup script
├── 🚀 start.bat                    # Windows startup script
├── 🛑 stop.sh                      # Linux/Mac stop script
├── 🛑 stop.bat                     # Windows stop script
│
├── 📂 backend/                     # Backend Node.js application
│   ├── 📄 .env                     # Environment variables (DO NOT COMMIT!)
│   ├── 📄 package.json             # Backend dependencies
│   ├── 📄 server.js                # Express server entry point
│   ├── 📄 azureQueryHandler.js     # Main query orchestration
│   ├── 📄 queryAnalyzer.js         # AI-powered query analysis
│   ├── 📄 azureResourceClient.js   # Azure SDK integration
│   └── 📄 test-connection.js       # Connection testing utility
│
└── 📂 frontend/                    # React frontend application
    ├── 📄 index.html               # HTML entry point
    ├── 📄 package.json             # Frontend dependencies
    ├── 📄 vite.config.js           # Vite bundler configuration
    ├── 📄 tailwind.config.js       # Tailwind CSS configuration
    ├── 📄 postcss.config.js        # PostCSS configuration
    │
    └── 📂 src/
        ├── 📄 main.jsx             # React application entry
        ├── 📄 App.jsx              # Main React component
        └── 📄 index.css            # Global styles with Tailwind
```

## 🔧 Backend Architecture

### Core Files

#### [`server.js`](backend/server.js)
- Express.js server setup
- CORS configuration
- API endpoint definitions
- Error handling middleware
- Health check endpoint

**Key Endpoints:**
- `GET /health` - Health check
- `POST /api/query` - Main query endpoint

#### [`azureQueryHandler.js`](backend/azureQueryHandler.js)
- Orchestrates the entire query flow
- Coordinates between query analysis and Azure execution
- Generates natural language responses using Azure OpenAI
- Error handling and response formatting

**Flow:**
1. Receives user query
2. Analyzes query intent using OpenAI
3. Executes Azure SDK calls
4. Formats response using OpenAI
5. Returns structured result

#### [`queryAnalyzer.js`](backend/queryAnalyzer.js)
- Uses Azure OpenAI to understand user intent
- Extracts structured information from natural language
- Identifies resource types and parameters
- Returns analysis object with:
  - `intent`: User's goal (get_status, get_sku, etc.)
  - `resourceType`: Azure resource type
  - `resourceName`: Specific resource name
  - `parameters`: Additional query parameters

#### [`azureResourceClient.js`](backend/azureResourceClient.js)
- Integrates with Azure SDKs
- Implements resource-specific query logic
- Handles authentication via Service Principal
- Supports multiple resource types:
  - Virtual Machines
  - SQL Databases
  - Virtual Networks
  - Storage Accounts
  - Resource Groups

**Key Functions:**
- `executeAzureQuery()` - Main entry point
- `queryVirtualMachine()` - VM queries
- `queryDatabase()` - Database queries
- `queryVirtualNetwork()` - Network queries
- `queryStorageAccount()` - Storage queries
- `getCostData()` - Cost information (placeholder)

#### [`test-connection.js`](backend/test-connection.js)
- Validates Azure credentials
- Tests Azure OpenAI connection
- Verifies resource access
- Provides colored console output
- Used by `npm test` command

### Environment Configuration

#### [`.env`](backend/.env)
Contains sensitive configuration:
```properties
# Azure Authentication
AZURE_TENANT_ID
AZURE_CLIENT_ID
AZURE_CLIENT_SECRET
AZURE_SUBSCRIPTION_ID

# Azure OpenAI
AZURE_OPENAI_API_KEY
AZURE_OPENAI_ENDPOINT
AZURE_OPENAI_API_VERSION
AZURE_OPENAI_DEPLOYMENT_NAME

# Application
PORT
NODE_ENV
LOG_LEVEL
RESOURCE_GROUPS
```

## 🎨 Frontend Architecture

### Core Files

#### [`src/App.jsx`](frontend/src/App.jsx)
Main React component implementing:
- Chat interface with message history
- Query input with example suggestions
- Real-time loading states
- Error handling and display
- Responsive design with Tailwind CSS

**Features:**
- Message history with role-based styling
- Example query buttons
- Auto-scroll to latest message
- Loading indicators
- Error messages with helpful context

#### [`src/main.jsx`](frontend/src/main.jsx)
- React application entry point
- Renders App component into DOM
- Includes React StrictMode

#### [`src/index.css`](frontend/src/index.css)
- Tailwind CSS imports
- Global styles
- Custom CSS variables
- Font and layout configurations

### Build Configuration

#### [`vite.config.js`](frontend/vite.config.js)
- Vite bundler configuration
- React plugin setup
- Development server settings
- Proxy configuration for API calls

#### [`tailwind.config.js`](frontend/tailwind.config.js)
- Tailwind CSS configuration
- Content paths for purging
- Theme customization
- Plugin configuration

#### [`postcss.config.js`](frontend/postcss.config.js)
- PostCSS configuration
- Tailwind CSS processing
- Autoprefixer setup

## 🚀 Startup Scripts

### Linux/Mac Scripts

#### [`start.sh`](start.sh)
- Checks Node.js installation
- Installs dependencies if needed
- Starts backend on port 3000
- Starts frontend on port 5173
- Provides colored console output
- Saves process IDs for cleanup

#### [`stop.sh`](stop.sh)
- Reads saved process IDs
- Gracefully stops backend and frontend
- Cleans up PID file
- Provides status feedback

### Windows Scripts

#### [`start.bat`](start.bat)
- Windows equivalent of start.sh
- Opens separate command windows for backend/frontend
- Checks port availability
- Installs dependencies automatically

#### [`stop.bat`](stop.bat)
- Windows equivalent of stop.sh
- Kills processes on ports 3000 and 5173
- Provides status feedback

## 📦 Dependencies

### Backend Dependencies
- `@azure/arm-compute` - VM management
- `@azure/arm-network` - Network resources
- `@azure/arm-resources` - Resource management
- `@azure/arm-sql` - SQL database management
- `@azure/arm-storage` - Storage account management
- `@azure/identity` - Azure authentication
- `@azure/openai` - Azure OpenAI integration
- `express` - Web server framework
- `cors` - CORS middleware
- `dotenv` - Environment variable management

### Frontend Dependencies
- `react` - UI library
- `react-dom` - React DOM rendering
- `lucide-react` - Icon library
- `vite` - Build tool
- `tailwindcss` - CSS framework
- `autoprefixer` - CSS post-processing
- `postcss` - CSS transformation

## 🔐 Security Considerations

### Protected Files (in .gitignore)
- `backend/.env` - Contains sensitive credentials
- `node_modules/` - Dependencies
- `.pids` - Process IDs
- `*.log` - Log files

### Best Practices
1. Never commit `.env` files
2. Use Azure Key Vault in production
3. Implement proper RBAC
4. Enable audit logging
5. Use managed identities when possible

## 🔄 Data Flow

```
User Query
    ↓
Frontend (React)
    ↓
POST /api/query
    ↓
Backend (Express)
    ↓
Query Analyzer (Azure OpenAI)
    ↓
Azure Resource Client (Azure SDKs)
    ↓
Azure Resources
    ↓
Response Generator (Azure OpenAI)
    ↓
Formatted Response
    ↓
Frontend Display
```

## 📝 Development Workflow

1. **Start Development:**
   ```bash
   ./start.sh  # or start.bat on Windows
   ```

2. **Make Changes:**
   - Backend: Auto-reloads with nodemon
   - Frontend: Hot module replacement with Vite

3. **Test:**
   ```bash
   cd backend && npm test
   ```

4. **Stop:**
   ```bash
   ./stop.sh  # or stop.bat on Windows
   ```

## 🚢 Deployment Considerations

### Environment Variables
- Use Azure Key Vault for secrets
- Configure via Azure App Service settings
- Never hardcode credentials

### Scaling
- Backend: Stateless, can scale horizontally
- Frontend: Static files, use CDN
- Consider Azure App Service or Container Instances

### Monitoring
- Enable Application Insights
- Configure Azure Monitor
- Set up Log Analytics

## 📚 Additional Resources

- [Azure SDK Documentation](https://docs.microsoft.com/azure/developer/)
- [Azure OpenAI Documentation](https://learn.microsoft.com/azure/ai-services/openai/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

**Last Updated:** 2025-11-23