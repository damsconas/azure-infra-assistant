# Azure Infrastructure AI Query System

An AI-powered solution that allows non-technical team members to query Azure infrastructure using natural language. Built with Azure OpenAI and Azure SDKs.

## 🎯 Features

- **Natural Language Queries**: Ask questions in plain English about your Azure resources
- **Comprehensive Resource Support**: 
  - Virtual Machines (status, SKU, configuration)
  - Databases (SQL, CosmosDB)
  - Virtual Networks and Subnets
  - Storage Accounts
  - Resource Groups
  - Cost and billing information
- **Intelligent Query Analysis**: Automatically understands intent and extracts relevant parameters
- **Real-time Azure Data**: Queries live Azure infrastructure via Azure SDKs
- **User-Friendly Interface**: Clean, modern web interface for easy interaction

## 📋 Prerequisites

- Node.js 18+ installed
- Azure subscription with resources
- Azure Service Principal with appropriate permissions
- Azure OpenAI service deployed

### Required Azure Permissions

Your Service Principal needs the following roles:
- `Reader` role on the subscription or resource groups
- `Cost Management Reader` for cost queries
- Access to Azure OpenAI service

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Create project directory
mkdir azure-infrastructure-query
cd azure-infrastructure-query

# Initialize and install dependencies
npm init -y
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory with your Azure credentials:

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
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-5-chat

# Application Configuration
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Optional: Limit queries to specific resource groups (comma-separated)
RESOURCE_GROUPS=rg-dev,rg-prod,rg-staging
```

### 3. Test Connection

```bash
npm test
```

This will verify:
- Azure authentication works
- Can access resource groups
- Azure OpenAI connection is successful

### 4. Start the Server

```bash
npm start

# Or for development with auto-reload:
npm run dev
```

The server will start on `http://localhost:3000`

### 5. Access the Interface

Open your browser and navigate to `http://localhost:3000`

## 💬 Example Queries

Here are some example questions you can ask:

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

## 📁 Project Structure

```
azure-infrastructure-query/
├── server.js                 # Express server
├── azureQueryHandler.js      # Main query processing logic
├── queryAnalyzer.js          # Query intent & parameter extraction
├── azureResourceClient.js    # Azure SDK integration
├── test-connection.js        # Connection testing script
├── package.json              # Dependencies
├── .env                      # Environment configuration
└── README.md                 # This file
```

## 🔧 Configuration Options

### Resource Group Filtering

By default, the system queries all resource groups. To limit queries to specific resource groups:

```properties
RESOURCE_GROUPS=rg-dev,rg-prod,rg-staging
```

### Logging

Adjust log verbosity:

```properties
LOG_LEVEL=debug  # Options: error, warn, info, debug
```

## 🛠️ Troubleshooting

### "Authentication Failed"
- Verify your Azure credentials in `.env`
- Ensure Service Principal has proper permissions
- Check that credentials haven't expired

### "Resource Not Found"
- Verify resource name spelling
- Check if resource exists in accessible resource groups
- Ensure Service Principal has Reader access

### "OpenAI Connection Failed"
- Verify OpenAI endpoint and key
- Check deployment name matches your Azure OpenAI deployment
- Ensure API version is supported

### "No Response from Backend"
- Verify server is running on port 3000
- Check for firewall issues
- Review server logs for errors

## 🔒 Security Best Practices

1. **Never commit `.env` file** - Add it to `.gitignore`
2. **Use Azure Key Vault** for production deployments
3. **Implement proper RBAC** - Grant minimal required permissions
4. **Enable logging and monitoring** for audit trails
5. **Use managed identities** when deploying to Azure

## 🚢 Deployment to Azure

### Deploy as Azure App Service

```bash
# Install Azure CLI
az login

# Create App Service
az webapp up --name azure-infra-query --resource-group your-rg --runtime "NODE|18-lts"

# Configure environment variables
az webapp config appsettings set --name azure-infra-query --resource-group your-rg --settings @appsettings.json
```

### Deploy as Azure Container Instance

```bash
# Build Docker image
docker build -t azure-infra-query .

# Push to Azure Container Registry
az acr build --registry yourregistry --image azure-infra-query:latest .

# Deploy to ACI
az container create --resource-group your-rg --name azure-infra-query --image yourregistry.azurecr.io/azure-infra-query:latest
```

## 📊 Monitoring

Monitor your application:
- **Application Insights**: For detailed telemetry
- **Azure Monitor**: For infrastructure monitoring
- **Log Analytics**: For query and error analysis

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Enhanced cost analysis with Cost Management API
- Support for more Azure resource types
- Advanced querying with KQL integration
- Multi-subscription support
- Enhanced security features

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Azure SDK documentation
3. Verify Azure OpenAI service status
4. Check server logs for detailed error messages

## 🎉 What's Next?

- Add support for Azure Monitor metrics
- Implement KQL query generation for Log Analytics
- Add export functionality for query results
- Create dashboards for common queries
- Implement user authentication and authorization