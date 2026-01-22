import express from 'express';

const router = express.Router();

// Chat with AI - Simple fallback version
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Simple AI-like responses for demo
    const responses = {
      'hello': 'Hello! I\'m your PYQ Hub AI Assistant. How can I help you with your studies today? 📚',
      'hi': 'Hi there! Ask me about subjects, papers, or study tips! 🤖',
      'help': 'I can help you with:\n• Finding PYQ papers\n• Subject information\n• Study guidance\n• Upload assistance',
      'chemistry': 'Chemistry is a great subject! We have many chemistry PYQ papers available. Would you like me to help you find specific year papers?',
      'physics': 'Physics papers are very popular! You can browse physics PYQs by year. Need help finding specific topics?',
      'mathematics': 'Mathematics PYQs are essential for practice. We have papers from multiple years. What specific area interests you?',
      'upload': 'To upload papers: Go to Upload page → Select PDF → Choose subject → Add year → Submit for review!',
      'how to use': 'Browse subjects → Search papers → View/Download PDFs → Upload your own papers for others!'
    };

    // Find matching response
    const query = message.toLowerCase();
    let response = 'I\'m here to help with PYQ Hub! Ask me about subjects, papers, uploading, or study tips. 📖';
    
    for (const [key, value] of Object.entries(responses)) {
      if (query.includes(key)) {
        response = value;
        break;
      }
    }

    // Add context-aware responses
    if (query.includes('explain') || query.includes('2026') || query.includes('2025')) {
      response = 'I can help explain PYQ papers! For detailed explanations, please view the PDF and I\'ll guide you through the topics and important questions. 📄';
    }

    if (query.includes('operating system') || query.includes('os')) {
      response = 'Operating System is a core CS subject! Key topics include Process Management, Memory Management, File Systems, and CPU Scheduling. Check our OS PYQ papers for practice! 💻';
    }

    res.json({ response });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'Chat service unavailable' });
  }
});

export default router;