require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { queryAzureInfrastructure } = require('./azureQueryHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Main query endpoint
app.post('/api/query', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Accept both 'query' and 'question' fields for compatibility
    const { query, question } = req.body;
    const queryText = query || question;
    
    if (!queryText || typeof queryText !== 'string') {
      return res.status(400).json({
        error: 'Invalid query. Please provide a query string in either "query" or "question" field.'
      });
    }

    console.log(`[${new Date().toISOString()}] Processing query: "${queryText}"`);

    const result = await queryAzureInfrastructure(queryText);
    
    const queryTime = Date.now() - startTime;
    
    res.json({
      response: result.response,
      metadata: {
        queryTime,
        source: result.source || 'Azure API',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error processing query:', error);
    
    res.status(500).json({
      error: 'Failed to process query',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Azure Infrastructure Query Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Query endpoint: http://localhost:${PORT}/api/query`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
});