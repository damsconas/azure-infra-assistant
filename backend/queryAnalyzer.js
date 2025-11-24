const OpenAI = require('openai');
const { loadPrompt } = require('./promptLoader');

// Initialize Azure OpenAI client
const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
  defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
});

const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

/**
 * Analyzes a natural language query to extract intent and parameters
 * @param {string} query - The user's natural language query
 * @returns {Promise<Object>} Analysis result with intent, resourceType, resourceName, and parameters
 */
async function analyzeQuery(query) {
  try {
    const systemPrompt = loadPrompt('query-analyzer');

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query }
    ];

    const response = await client.chat.completions.create({
      model: deploymentName,
      messages: messages,
      temperature: 0.1,
      max_tokens: 500,
      top_p: 0.95
    });

    const analysisText = response.choices[0]?.message?.content?.trim();
    
    if (!analysisText) {
      console.error('OpenAI returned empty response:', response);
      throw new Error('OpenAI returned empty response');
    }
    
    // Parse the JSON response
    let analysis;
    try {
      // Remove markdown code blocks if present
      const cleanedText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', analysisText);
      console.error('Parse error:', parseError.message);
      throw new Error('Failed to parse query analysis: ' + parseError.message);
    }

    // Validate required fields
    if (!analysis.intent || !analysis.resourceType) {
      console.error('Invalid analysis result - missing required fields:', analysis);
      throw new Error('Invalid analysis result: missing required fields (intent or resourceType)');
    }

    // Ensure parameters object exists
    analysis.parameters = analysis.parameters || {};

    // Ensure resourceName exists for specific resource queries
    if (!analysis.resourceName && analysis.resourceType !== 'generic') {
      analysis.resourceName = 'unknown';
    }

    console.log('Query analysis:', JSON.stringify(analysis, null, 2));
    
    return analysis;

  } catch (error) {
    console.error('Error analyzing query:', error);
    throw new Error(`Query analysis failed: ${error.message}`);
  }
}

module.exports = { analyzeQuery };