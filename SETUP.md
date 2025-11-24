# Azure Infrastructure Query System - Setup Guide

This guide will help you set up and run the Azure Infrastructure Query System locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Azure Subscription** with resources to query
- **Azure Service Principal** with appropriate permissions
- **Azure OpenAI Service** deployed

## 🚀 Quick Start

### Step 1: Install Dependencies

Open a terminal in the project root directory and run:

```bash
# Install all dependencies (backend + frontend)
npm run install:all
```

Or install them separately:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Verify Environment Configuration

The `.env` file has already been created in the `backend` folder with your Azure credentials. Verify it contains:

```properties
# Azure Configuration
AZURE_TENANT_ID=37bb0008-2586-4514-a753-d1092d7259f2
AZURE_CLIENT_ID=3f70e320-539f-415a-bb23-64f6af2dc7f4
AZURE_CLIENT_SECRET=GMY8Q~bDZIXBYyicKxY9QXT_IEzE_t6vdxpGccXS
AZURE_SUBSCRIPTION_ID=85c7908d-8028-4894-af5d-1991ee8f0450

# Azure OpenAI Configuration
AZURE_OPENAI_API_KEY=C5f2Sdt8Xmq2HkNAXYHOpvgyqn2VuhY8s30Ok5KKzge2pWAuK0ExJQQJ99BKACHYHv6XJ3w3AAAAACOGUoiv
AZURE_OPENAI_ENDPOINT=https://dammy-mi9squwm-eastus2.cognitiveservices.azure.com
AZURE_OPENAI_API_VERSION=2025-01-01-preview
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-5-chat

# Application Configuration
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Optional: Resource Group Filter
RESOURCE_GROUPS=rg-dev,rg-prod,rg-staging
```

### Step 3: Test Azure Connection

Before running the application, test your Azure connection:

```bash
cd backend
npm test
```

This will verify:
- ✓ Azure authentication works
- ✓ Can access resource groups
- ✓ Azure OpenAI connection is successful

### Step 4: Run the Application

You have several options to run the application:

#### Option A: Run Backend and Frontend Together (Recommended for Development)

From the project root:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3000`
- Frontend dev server on `http://localhost:5173`

#### Option B: Run Backend Only

```bash
cd backend
npm start

# Or with auto-reload for development:
npm run dev
```

#### Option C: Run Frontend Only (Backend must be running separately)

```bash
cd frontend
npm run dev
```

### Step 5: Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

You should see the Azure Infrastructure Assistant interface!

## 💬 Try These Example Queries

Once the application is running, try asking:

### Virtual Machines
- "What is the status of dami-vm?"
- "What size is the prod-server VM?"
- "Show me all VMs in rg-prod"

### Databases
- "What is the SKU of xyz database?"
- "What tier is the production database?"
- "List all databases in rg-prod"

### Networks
- "How many subnets are in the abc vnet?"
- "Show me the address space of main-vnet"
- "What subnets exist in production-vnet?"

### Storage
- "What is the replication type of storage123?"
- "Show me storage account details for mystore"

### Costs
- "What was the cost of dami-vm last month?"
- "Show me spending for rg-prod last quarter"

### General
- "List all resources in rg-dev"
- "How many resources are in production?"
- "What is the location of app-service-1?"

## 🔧 Project Structure

```
azure-infrastructure-query/
├── backend/                      # Backend Node.js application
│   ├── .env                      # Environment variables (DO NOT COMMIT)
│   ├── server.js                 # Express server
│   ├── azureQueryHandler.js      # Main query orchestrator
│   ├── queryAnalyzer.js          # AI query analysis
│   ├── azureResourceClient.js    # Azure SDK integration
│   ├── test-connection.js        # Connection testing
│   └── package.json              # Backend dependencies
│
├── frontend/                     # React frontend application
│   ├── src/
│   │   ├── App.jsx              # Main React component
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Tailwind CSS
│   ├── index.html               # HTML entry point
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind configuration
│   └── package.json             # Frontend dependencies
│
├── .gitignore                   # Git ignore file
├── package.json                 # Root package.json for scripts
├── README.md                    # Project documentation
└── SETUP.md                     # This file
```

## 🛠️ Troubleshooting

### "Cannot find module" errors

Make sure you've installed all dependencies:

```bash
npm run install:all
```

### "Authentication Failed"

1. Verify your Azure credentials in `backend/.env`
2. Ensure Service Principal has proper permissions (Reader role)
3. Check that credentials haven't expired

### "OpenAI Connection Failed"

1. Verify OpenAI endpoint and key in `backend/.env`
2. Check deployment name matches your Azure OpenAI deployment
3. Ensure API version is supported

### "Port already in use"

If port 3000 or 5173 is already in use:

**For Backend (port 3000):**
Edit `backend/.env` and change:
```properties
PORT=3001
```

**For Frontend (port 5173):**
Edit `frontend/vite.config.js` and change the port in the server section.

### Frontend can't connect to backend

1. Ensure backend is running on `http://localhost:3000`
2. Check the proxy configuration in `frontend/vite.config.js`
3. Verify CORS is enabled in `backend/server.js`

## 🔒 Security Notes

⚠️ **IMPORTANT**: Never commit the `.env` file to version control!

The `.env` file contains sensitive credentials and is already added to `.gitignore`.

For production deployments:
1. Use Azure Key Vault for secrets
2. Implement proper RBAC
3. Enable logging and monitoring
4. Use managed identities when deploying to Azure

## 📊 Development Tips

### Backend Development

Watch for changes and auto-reload:
```bash
cd backend
npm run dev
```

### Frontend Development

The frontend uses Vite with hot module replacement (HMR):
```bash
cd frontend
npm run dev
```

### Building for Production

Build the frontend:
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs in the terminal
3. Verify all environment variables are set correctly
4. Ensure Azure resources exist and are accessible
5. Check Azure service status

## 🎉 Next Steps

Once everything is running:

1. Try the example queries
2. Explore your Azure infrastructure
3. Customize the queries for your specific resources
4. Consider deploying to Azure App Service or Container Instances

Enjoy querying your Azure infrastructure with natural language! 🚀