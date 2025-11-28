require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const { queryAzureInfrastructure } = require('./azureQueryHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Initialize Azure Blob Service Client
let blobServiceClient;
const hasValidStorageConfig = process.env.AZURE_STORAGE_CONNECTION_STRING &&
                             !process.env.AZURE_STORAGE_CONNECTION_STRING.includes('yourstorageaccount');

if (hasValidStorageConfig) {
  try {
    blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    console.log('✅ Azure Blob Storage client initialized');
  } catch (error) {
    console.warn('⚠️ Azure Blob Storage connection failed:', error.message);
    console.warn('⚠️ File uploads will be simulated');
  }
} else {
  console.warn('⚠️ Azure Storage configuration not provided or using placeholder values');
  console.warn('⚠️ File uploads will be simulated');
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    features: {
      fileUpload: !!blobServiceClient
    }
  });
});

// File upload endpoint
app.post('/api/upload', upload.array('files'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded'
      });
    }

    const uploadResults = [];

    if (blobServiceClient) {
      // Real Azure Blob Storage upload
      const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER);

      // Ensure container exists
      await containerClient.createIfNotExists({
        access: 'container'
      });

      for (const file of req.files) {
        try {
          const blobName = `${Date.now()}-${file.originalname}`;
          const blockBlobClient = containerClient.getBlockBlobClient(blobName);
          
          // Upload file to Azure Blob Storage
          const uploadResponse = await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: {
              blobContentType: file.mimetype
            }
          });

          const blobUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${process.env.AZURE_STORAGE_CONTAINER}/${blobName}`;
          
          uploadResults.push({
            originalName: file.originalname,
            blobName,
            blobUrl,
            size: file.size,
            contentType: file.mimetype,
            uploadStatus: 'success',
            etag: uploadResponse.etag
          });

          console.log(`✅ Uploaded: ${file.originalname} -> ${blobName}`);
        } catch (error) {
          console.error(`❌ Upload failed for ${file.originalname}:`, error);
          uploadResults.push({
            originalName: file.originalname,
            uploadStatus: 'failed',
            error: error.message
          });
        }
      }
    } else {
      // Simulated upload (for development/testing)
      console.log('📁 Simulating file upload (Azure Storage not configured)');
      
      for (const file of req.files) {
        const blobName = `${Date.now()}-${file.originalname}`;
        const blobUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${process.env.AZURE_STORAGE_CONTAINER}/${blobName}`;
        
        uploadResults.push({
          originalName: file.originalname,
          blobName,
          blobUrl,
          size: file.size,
          contentType: file.mimetype,
          uploadStatus: 'success',
          etag: 'simulated-etag'
        });

        console.log(`✅ Simulated upload: ${file.originalname} -> ${blobName}`);
      }
    }

    res.json({
      message: `Successfully uploaded ${uploadResults.filter(r => r.uploadStatus === 'success').length} of ${req.files.length} files`,
      results: uploadResults,
      simulated: !blobServiceClient
    });

  } catch (error) {
    console.error('Upload endpoint error:', error);
    res.status(500).json({
      error: 'Failed to process upload',
      message: error.message
    });
  }
});

// Main query endpoint
app.post('/api/query', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Accept both 'query' and 'question' fields for compatibility
    const { query, question, files } = req.body;
    const queryText = query || question;
    
    // Handle file-only uploads (no query text)
    if ((!queryText || !queryText.trim()) && (!files || files.length === 0)) {
      return res.status(400).json({
        error: 'Invalid request. Please provide either a query or files.'
      });
    }

    // If only files are uploaded without a query, return success
    if ((!queryText || !queryText.trim()) && files && files.length > 0) {
      console.log(`📁 Processing file-only upload: ${files.length} file(s)`, files.map(f => f.name));
      
      const queryTime = Date.now() - startTime;
      
      return res.json({
        response: `Successfully processed ${files.length} file(s). Files are ready for analysis.`,
        metadata: {
          queryTime,
          source: 'File Upload',
          timestamp: new Date().toISOString(),
          filesProcessed: files.length
        }
      });
    }

    // Only process Azure queries if there's actual query text
    console.log(`[${new Date().toISOString()}] Processing query: "${queryText}"`);
    if (files && files.length > 0) {
      console.log(`📁 Query includes ${files.length} file(s):`, files.map(f => f.name));
    }

    const result = await queryAzureInfrastructure(queryText);
    
    const queryTime = Date.now() - startTime;
    
    res.json({
      response: result.response,
      metadata: {
        queryTime,
        source: result.source || 'Azure API',
        timestamp: new Date().toISOString(),
        filesProcessed: files ? files.length : 0
      }
    });

  } catch (error) {
    console.error('Error processing query:', error);
    
    // Provide more specific error messages
    let userMessage = error.message;
    if (error.message.includes('AADSTS') || error.message.includes('tenant')) {
      userMessage = 'Azure authentication failed. Please check your Azure credentials in the .env file.';
    } else if (error.message.includes('OpenAI') || error.message.includes('deployment')) {
      userMessage = 'Azure OpenAI connection failed. Please check your OpenAI configuration.';
    }
    
    res.status(500).json({
      error: 'Failed to process query',
      message: userMessage,
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
  console.log(`📁 Upload endpoint: http://localhost:${PORT}/api/upload`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 File upload: ${blobServiceClient ? 'ENABLED' : 'SIMULATED'}`);
});