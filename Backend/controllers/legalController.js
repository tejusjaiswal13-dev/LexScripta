// controllers/legalController.js
const aiService = require('../utils/aiService');
const fileProcessor = require('../utils/fileProcessor');

/**
 * Main controller for legal operations
 */
exports.analyzeLegalQuery = async (req, res, next) => {
  try {
    let extractedText = '';
    let question = req.body.question || '';
    
    // Process uploaded file if present
    if (req.file) {
      try {
        extractedText = await fileProcessor.processFile(req.file);
      } catch (fileError) {
        return res.status(400).json({
          success: false,
          error: `Document processing failed: ${fileError.message}`
        });
      }
    }
    
    // Get document text from request body if no file
    if (!extractedText && req.body.documentText) {
      extractedText = req.body.documentText;
    }
    
    // Validate that we have either a question or a document
    if (!question && !extractedText) {
      return res.status(400).json({
        success: false,
        error: 'Please provide either a question or upload a document'
      });
    }
    
    // If no question but have document, generate default question
    if (!question && extractedText) {
      question = 'Please provide a legal analysis of this document and explain the key legal aspects in simple terms.';
    }
    
    // Get AI analysis
    const analysis = await aiService.getLegalAnalysis(question, extractedText);
    
    // Return successful response
    res.status(200).json({
      success: true,
      question: question,
      extractedText: extractedText ? extractedText.substring(0, 500) + '...' : null,
      ...analysis,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get example legal questions
 */
exports.getExamples = (req, res) => {
  const examples = [
    {
      category: 'Property Law',
      questions: [
        'How do I register property in India?',
        'What documents are needed for property sale?',
        'What is stamp duty and how is it calculated?'
      ]
    },
    {
      category: 'Employment Law',
      questions: [
        'What are my rights if wrongfully terminated?',
        'How much notice period is legally required?',
        'Can I sue for workplace harassment?'
      ]
    },
    {
      category: 'Consumer Rights',
      questions: [
        'How to file a consumer complaint?',
        'What to do about a defective product?',
        'Can I get a refund for online purchases?'
      ]
    },
    {
      category: 'Family Law',
      questions: [
        'What is the process for divorce in India?',
        'How is child custody decided?',
        'What are maintenance rights?'
      ]
    },
    {
      category: 'Criminal Law',
      questions: [
        'What to do if falsely accused?',
        'How to file an FIR?',
        'What are bail conditions?'
      ]
    }
  ];
  
  res.status(200).json({
    success: true,
    examples: examples
  });
};