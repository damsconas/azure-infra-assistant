require('dotenv').config();
const { ClientSecretCredential } = require('@azure/identity');
const { ResourceManagementClient } = require('@azure/arm-resources');
const { AzureOpenAI } = require('openai');
const { loadPrompt } = require('./promptLoader');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testAzureConnection() {
  log('\n🔍 Testing Azure Infrastructure Query System\n', colors.blue);

  // Check environment variables
  log('1. Checking environment variables...', colors.yellow);
  const requiredVars = [
    'AZURE_TENANT_ID',
    'AZURE_CLIENT_ID',
    'AZURE_CLIENT_SECRET',
    'AZURE_SUBSCRIPTION_ID',
    'AZURE_OPENAI_API_KEY',
    'AZURE_OPENAI_ENDPOINT',
    'AZURE_OPENAI_DEPLOYMENT_NAME'
  ];

  let allVarsPresent = true;
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      log(`   ✗ Missing: ${varName}`, colors.red);
      allVarsPresent = false;
    } else {
      log(`   ✓ Found: ${varName}`, colors.green);
    }
  }

  if (!allVarsPresent) {
    log('\n❌ Some required environment variables are missing. Please check your .env file.\n', colors.red);
    process.exit(1);
  }

  // Test Azure Authentication
  log('\n2. Testing Azure authentication...', colors.yellow);
  try {
    const credential = new ClientSecretCredential(
      process.env.AZURE_TENANT_ID,
      process.env.AZURE_CLIENT_ID,
      process.env.AZURE_CLIENT_SECRET
    );

    const resourceClient = new ResourceManagementClient(
      credential,
      process.env.AZURE_SUBSCRIPTION_ID
    );

    // Try to list resource groups
    const resourceGroups = [];
    const rgIterator = resourceClient.resourceGroups.list();
    
    for await (const rg of rgIterator) {
      resourceGroups.push(rg.name);
      if (resourceGroups.length >= 5) break; // Just get first 5 for testing
    }

    log(`   ✓ Successfully authenticated with Azure`, colors.green);
    log(`   ✓ Found ${resourceGroups.length} resource group(s)`, colors.green);
    
    if (resourceGroups.length > 0) {
      log(`   ℹ Sample resource groups: ${resourceGroups.slice(0, 3).join(', ')}`, colors.blue);
    }

  } catch (error) {
    log(`   ✗ Azure authentication failed: ${error.message}`, colors.red);
    log('\n❌ Please verify your Azure credentials in the .env file.\n', colors.red);
    process.exit(1);
  }

  // Test Azure OpenAI Connection
  log('\n3. Testing Azure OpenAI connection...', colors.yellow);
  try {
    const openaiClient = new AzureOpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION,
      deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME
    });

    const systemPrompt = loadPrompt('test-connection');
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Say "Connection successful" if you can read this.' }
    ];

    const response = await openaiClient.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      messages: messages,
      max_tokens: 50
    });

    if (response.choices && response.choices.length > 0) {
      log(`   ✓ Successfully connected to Azure OpenAI`, colors.green);
      log(`   ✓ Deployment: ${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`, colors.green);
      log(`   ℹ Test response: ${response.choices[0].message.content}`, colors.blue);
    }

  } catch (error) {
    log(`   ✗ Azure OpenAI connection failed: ${error.message}`, colors.red);
    log('\n❌ Please verify your Azure OpenAI credentials and deployment name.\n', colors.red);
    process.exit(1);
  }

  // Test complete
  log('\n✅ All tests passed! Your Azure Infrastructure Query System is ready to use.\n', colors.green);
  log('Next steps:', colors.blue);
  log('  1. Run "npm start" to start the server', colors.reset);
  log('  2. Open http://localhost:3000 in your browser', colors.reset);
  log('  3. Start querying your Azure infrastructure!\n', colors.reset);
}

// Run the tests
testAzureConnection().catch(error => {
  log(`\n❌ Unexpected error: ${error.message}\n`, colors.red);
  console.error(error);
  process.exit(1);
});