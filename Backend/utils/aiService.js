const axios = require('axios');

/**
 * AI Service - Handles both real AI API calls and mock responses
 */
class AIService {
  constructor() {
    this.openaiKey = process.env.OPENAI_API_KEY;
    this.anthropicKey = process.env.ANTHROPIC_API_KEY;
    this.useRealAI = !!(this.openaiKey || this.anthropicKey);
  }

  /**
   * Get legal analysis for a question
   */
  async getLegalAnalysis(question, fileContent = '') {
    if (this.useRealAI) {
      return await this.getRealAIResponse(question, fileContent);
    } else {
      return this.getMockResponse(question, fileContent);
    }
  }

  /**
   * Call real AI API (OpenAI or Anthropic)
   */
  async getRealAIResponse(question, fileContent) {
    const prompt = this.buildPrompt(question, fileContent);

    try {
      if (this.anthropicKey) {
        return await this.callAnthropicAPI(prompt);
      } else if (this.openaiKey) {
        return await this.callOpenAIAPI(prompt);
      }
    } catch (error) {
      console.error('AI API Error:', error.message);
      // Fallback to mock if API fails
      return this.getMockResponse(question, fileContent);
    }
  }

  /**
   * Call Anthropic Claude API
   */
  async callAnthropicAPI(prompt) {
    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [
            { role: 'user', content: prompt }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.anthropicKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      const answer = response.data.content[0].text;
      return this.parseAIResponse(answer, 'Claude AI');
    } catch (error) {
      throw new Error(`Anthropic API error: ${error.message}`);
    }
  }

  /**
   * Call OpenAI API
   */
  async callOpenAIAPI(prompt) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are an expert Indian legal assistant.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 1024,
          temperature: 0.7
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.openaiKey}`
          }
        }
      );

      const answer = response.data.choices[0].message.content;
      return this.parseAIResponse(answer, 'OpenAI GPT');
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  /**
   * Build AI prompt optimized for Indian legal queries
   */
  buildPrompt(question, fileContent) {
    let prompt = `You are LexScripta, an expert Indian legal assistant. Provide clear, simplified legal guidance based on Indian laws.

User Question: ${question}`;

    if (fileContent) {
      prompt += `\n\nDocument Content:\n${fileContent.substring(0, 3000)}`;
    }

    prompt += `\n\nProvide a response in the following format:
1. Direct Answer: (Simplified explanation in 2-3 paragraphs)
2. Relevant Indian Laws: (List 2-3 specific acts/sections if applicable)
3. Next Steps: (Practical advice in bullet points)

Keep language simple and avoid overly legal jargon. Focus on being helpful and actionable.`;

    return prompt;
  }

  /**
   * Parse AI response into structured format
   */
  parseAIResponse(rawAnswer, mode) {
    // Try to extract relevant laws mentioned
    const lawPattern = /(Indian\s+\w+\s+Act|IPC|CrPC|CPC|Section\s+\d+)/gi;
    const laws = [...new Set(rawAnswer.match(lawPattern) || [])];

    return {
      answer: rawAnswer,
      relatedLaws: laws.slice(0, 5),
      disclaimer: 'This is AI-generated legal information, not professional legal advice. Please consult a qualified lawyer for specific legal matters.',
      mode: mode
    };
  }

  /**
   * Mock response generator for demo/testing
   */
  getMockResponse(question, fileContent) {
    const mockResponses = {
      'property': {
        answer: `**Property Registration in India**

Property registration is mandatory in India under the Registration Act, 1908. Here's what you need to know:

The registration process involves visiting the Sub-Registrar's office in your jurisdiction with the original sale deed, identity proofs of buyer and seller, two witnesses, and property documents. The stamp duty and registration fees vary by state, typically ranging from 5-7% of property value.

**Key Requirements:**
• Original sale deed drafted by a lawyer
• PAN cards and Aadhaar cards of all parties
• Property tax receipts and encumbrance certificate
• Two witnesses with valid ID proof
• Payment of stamp duty and registration fees

**Important Acts:**
- Registration Act, 1908
- Transfer of Property Act, 1882
- Indian Stamp Act, 1899

Registration must be completed within 4 months of the sale deed execution to avoid penalties.`,
        laws: ['Registration Act 1908', 'Transfer of Property Act 1882', 'Indian Stamp Act 1899']
      },
      'employment': {
        answer: `**Wrongful Termination Rights in India**

If you believe you've been wrongfully terminated, you have several legal protections under Indian labor laws.

Under the Industrial Disputes Act, 1947, employees cannot be terminated without valid reason and proper procedure. Notice period requirements vary by employment terms, but typically range from 30-90 days. If terminated without notice, you're entitled to notice period pay.

**Your Rights:**
• Right to receive termination notice in writing
• Right to full and final settlement within 2 months
• Right to challenge termination in labor court
• Right to gratuity (if applicable under specific conditions)

**Relevant Laws:**
- Industrial Disputes Act, 1947
- Payment of Gratuity Act, 1972
- Shops and Establishments Act (State-specific)

Document everything, gather employment records, and consult with a labor law attorney to evaluate your case.`,
        laws: ['Industrial Disputes Act 1947', 'Payment of Gratuity Act 1972', 'Shops and Establishments Act']
      },
      'consumer': {
        answer: `**Filing Consumer Complaints in India**

The Consumer Protection Act, 2019 provides a robust framework for addressing defective products and unfair trade practices.

You can file a complaint at three levels based on claim value: District Forum (up to ₹1 crore), State Commission (₹1-10 crore), or National Commission (above ₹10 crore). The complaint can be filed online through the e-Daakhil portal or offline at the consumer forum.

**Steps to File:**
• Gather all bills, receipts, and product documentation
• Draft a complaint with clear description of defect
• Include copies of communication with seller/manufacturer
• Submit to appropriate consumer forum with prescribed fee
• Attend hearings as scheduled

**Key Provisions:**
- Consumer Protection Act, 2019
- Legal Metrology Act, 2009
- Sale of Goods Act, 1930

Complaints must be filed within 2 years of the cause of action. Most cases are resolved within 6-12 months.`,
        laws: ['Consumer Protection Act 2019', 'Legal Metrology Act 2009', 'Sale of Goods Act 1930']
      },
      'default': {
        answer: `**Legal Guidance - Indian Law Context**

Thank you for your legal query. Based on Indian law, here's general guidance on your question:

${fileContent ? 'I\'ve reviewed the document you provided. ' : ''}Your question relates to an area of Indian law that requires careful consideration of specific facts and circumstances.

**General Information:**
Indian law is comprehensive and covers various aspects through central and state legislation. Depending on your specific situation, different acts and regulations may apply. The legal framework ensures protection of rights while balancing various interests.

**Recommended Next Steps:**
• Gather all relevant documents related to your situation
• Note down detailed timeline of events
• Consult with a qualified lawyer specializing in this area
• Consider mediation or alternative dispute resolution if applicable
• Be aware of limitation periods for filing legal actions

**Important Note:**
This is general information based on common Indian legal principles. Your specific case may have unique factors that require professional legal assessment.`,
        laws: ['Indian Constitution', 'Indian Penal Code', 'Code of Civil Procedure']
      }
    };

    // Determine which mock response to use
    const questionLower = question.toLowerCase();
    let response;

    if (questionLower.includes('property') || questionLower.includes('registration')) {
      response = mockResponses.property;
    } else if (questionLower.includes('employment') || questionLower.includes('termination') || questionLower.includes('job')) {
      response = mockResponses.employment;
    } else if (questionLower.includes('consumer') || questionLower.includes('defective') || questionLower.includes('complaint')) {
      response = mockResponses.consumer;
    } else {
      response = mockResponses.default;
    }

    return {
      answer: response.answer,
      relatedLaws: response.laws,
      disclaimer: 'This is AI-generated legal information for educational purposes, not professional legal advice. Please consult a qualified lawyer for specific legal matters.',
      mode: 'Mock AI (Demo Mode)'
    };
  }
}

module.exports = new AIService();


