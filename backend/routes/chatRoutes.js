import express from 'express';

const router = express.Router();

// Chat with AI
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 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`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "google/gemma-2-9b-it:free",
        messages: [
          {
            role: "system",
            content: `You are PYQ Hub AI Assistant. Help students with Previous Year Questions (PYQs). 
            Context: ${context || 'General PYQ assistance'}
            Be helpful, concise, and educational. Answer in Hindi and English mix (Hinglish) when appropriate.`
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "Sorry, I couldn't process that.";

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

export default router;