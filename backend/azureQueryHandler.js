const { analyzeQuery } = require('./queryAnalyzer');
const { executeAzureQuery } = require('./azureResourceClient');
const { AzureOpenAI } = require('openai');
const { loadPrompt } = require('./promptLoader');

// Initialize Azure OpenAI client for response generation
const client = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME
});

const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

/**
 * Main function to handle Azure infrastructure queries
 * @param {string} query - The user's natural language query
 * @returns {Promise<Object>} Response object with formatted answer
 */
async function queryAzureInfrastructure(query) {
  try {
    console.log(`Processing query: "${query}"`);

    // Step 1: Analyze the query using Azure OpenAI
    const analysis = await analyzeQuery(query);
    console.log('Query analysis complete:', analysis);

    // Step 2: Execute the Azure query based on analysis
    const azureResult = await executeAzureQuery(analysis);
    console.log('Azure query result:', azureResult);

    // Step 3: Generate natural language response
    const response = await generateResponse(query, analysis, azureResult);

    return {
      response,
      source: azureResult.source || 'Azure Resource Manager',
      analysis
    };

  } catch (error) {
    console.error('Error in queryAzureInfrastructure:', error);
    
    // Return a user-friendly error message
    return {
      response: `I encountered an error while processing your query: ${error.message}. Please try rephrasing your question or check if the resource name is correct.`,
      source: 'Error Handler',
      error: error.message
    };
  }
}

/**
 * Generates a natural language response from Azure query results
 * @param {string} originalQuery - The original user query
 * @param {Object} analysis - The query analysis
 * @param {Object} azureResult - The result from Azure
 * @returns {Promise<string>} Natural language response
 */
async function generateResponse(originalQuery, analysis, azureResult) {
  try {
    // If there's an error in the Azure result, return it directly
    if (azureResult.error) {
      return `I couldn't find the information you requested. ${azureResult.error}`;
    }

    // Create a prompt for generating natural language response
    const systemPrompt = loadPrompt('response-generator', { originalQuery });

    const dataContext = `Here is the data from Azure:
${JSON.stringify(azureResult.data, null, 2)}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: dataContext }
    ];

    const response = await client.chat.completions.create({
      model: deploymentName,
      messages: messages,
      temperature: 0.7,
      max_tokens: 800,
      top_p: 0.95
    });

    return response.choices[0].message.content.trim();

  } catch (error) {
    console.error('Error generating response:', error);
    
    // Fallback to basic formatting if OpenAI fails
    return formatBasicResponse(azureResult.data);
  }
}

/**
 * Fallback function to format response without OpenAI
 * @param {Object} data - The Azure data to format
 * @returns {string} Formatted response
 */
function formatBasicResponse(data) {
  if (!data) {
    return 'No data available.';
  }

  let response = 'Here is the information I found:\n\n';
  
  for (const [key, value] of Object.entries(data)) {
    if (value !== null && value !== undefined) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        response += `${key}:\n`;
        for (const [subKey, subValue] of Object.entries(value)) {
          response += `  - ${subKey}: ${subValue}\n`;
        }
      } else if (Array.isArray(value)) {
        response += `${key}: ${value.length} items\n`;
        value.forEach((item, index) => {
          if (typeof item === 'object') {
            response += `  ${index + 1}. ${JSON.stringify(item)}\n`;
          } else {
            response += `  ${index + 1}. ${item}\n`;
          }
        });
      } else {
        response += `${key}: ${value}\n`;
      }
    }
  }

  return response;
}

module.exports = { queryAzureInfrastructure };