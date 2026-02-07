const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Tesseract = require('tesseract.js');

/**
 * File Processor - Extracts text from various file formats
 */
class FileProcessor {
  /**
   * Process uploaded file and extract text content
   */
  async processFile(file) {
    if (!file || !file.buffer) {
      throw new Error('Invalid file');
    }

    const mimeType = file.mimetype;

    try {
      switch (mimeType) {
        case 'application/pdf':
          return await this.processPDF(file.buffer);
        
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
          return await this.processDOCX(file.buffer);
        
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/png':
          return await this.processImage(file.buffer);
        
        default:
          throw new Error('Unsupported file type');
      }
    } catch (error) {
      console.error('File processing error:', error);
      throw new Error(`Failed to process ${file.originalname}: ${error.message}`);
    }
  }

  /**
   * Extract text from PDF
   */
  async processPDF(buffer) {
    try {
      const data = await pdfParse(buffer);
      const text = data.text.trim();
      
      if (!text || text.length < 10) {
        throw new Error('PDF appears to be empty or contains only images');
      }
      
      return text;
    } catch (error) {
      throw new Error(`PDF processing failed: ${error.message}`);
    }
  }

  /**
   * Extract text from DOCX/DOC
   */
  async processDOCX(buffer) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value.trim();
      
      if (!text || text.length < 10) {
        throw new Error('Document appears to be empty');
      }
      
      return text;
    } catch (error) {
      throw new Error(`DOCX processing failed: ${error.message}`);
    }
  }

  /**
   * Extract text from images using OCR
   */
  async processImage(buffer) {
    try {
      const { data: { text } } = await Tesseract.recognize(
        buffer,
        'eng',
        {
          logger: () => {} // Suppress verbose logs
        }
      );
      
      const cleanedText = text.trim();
      
      if (!cleanedText || cleanedText.length < 10) {
        throw new Error('No readable text found in image');
      }
      
      return cleanedText;
    } catch (error) {
      throw new Error(`Image OCR failed: ${error.message}`);
    }
  }
}

module.exports = new FileProcessor();