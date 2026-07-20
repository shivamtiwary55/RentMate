import Anthropic from '@anthropic-ai/sdk';
import { Listing } from '../models/listing.model.js';

// Initialize client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export const chatWithAI = async (req, res) => {
  try {
    // Debug logs — Render mein dikhenge
    console.log('AI Chat request received');
    console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
    console.log('API Key prefix:', process.env.ANTHROPIC_API_KEY?.substring(0, 15));

    const { message, conversationHistory } = req.body;

    // Validation
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ message: 'ANTHROPIC_API_KEY not configured on server' });
    }

    // Fetch listings from database
    const listings = await Listing.find({ isAvailable: true })
      .populate('landlord', 'name')
      .select('title rent roomType address amenities deposit preferredTenants');

    console.log('Listings found:', listings.length);

    // Format listings for AI
    const listingsContext = listings.length > 0
      ? listings.map((l, i) => `
        Listing ${i + 1}:
        - Title: ${l.title}
        - Rent: ₹${l.rent}/month
        - Deposit: ₹${l.deposit}
        - Type: ${l.roomType}
        - City: ${l.address?.city}, ${l.address?.state}
        - Amenities: ${l.amenities?.join(', ') || 'Not specified'}
        - Preferred Tenants: ${l.preferredTenants}
        - Landlord: ${l.landlord?.name}
      `).join('\n')
      : 'No listings available currently.';

    // System prompt
    const systemPrompt = `You are RentMate AI Assistant, a helpful chatbot for a rental platform in India.

Your job is to help students and tenants find the best room listings based on their preferences.

Here are all the currently available listings in our database:
${listingsContext}

Guidelines:
- Always respond in a friendly, helpful manner
- When user mentions budget, suggest listings within or near that budget
- When user mentions city, filter listings by that city
- When user mentions room type (pg, single, shared, flat), filter accordingly
- When user mentions amenities (wifi, ac, parking), prioritize listings with those
- Always mention the rent, location, and key amenities when suggesting a listing
- If no listings match exactly, suggest the closest alternatives
- Keep responses concise and easy to read
- Use emojis to make responses friendly
- If asked about something unrelated to rentals, politely redirect to rental topics
- Respond in the same language the user writes in (Hindi or English)`;

    // Build messages — last 10 only to avoid token limit
    const messages = [
      ...(conversationHistory || []).slice(-10),
      { role: 'user', content: message }
    ];

    console.log('Calling Claude API...');

    // Call Claude API
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages
    });

    console.log('Claude API response received');

    const aiReply = response.content[0].text;

    res.status(200).json({
      reply: aiReply,
      updatedHistory: [
        ...(conversationHistory || []).slice(-10),
        { role: 'user', content: message },
        { role: 'assistant', content: aiReply }
      ]
    });

  } catch (error) {
    // Detailed error logging
    console.error('AI chat error full:', error);
    console.error('Error message:', error.message);
    console.error('Error status:', error.status);
    console.error('Error type:', error.constructor.name);

    // Specific error responses
    if (error.status === 401) {
      return res.status(500).json({
        message: 'Invalid Anthropic API key — check Render environment variables'
      });
    }

    if (error.status === 429) {
      return res.status(500).json({
        message: 'API rate limit exceeded — please try after sometime'
      });
    }

    if (error.status === 400) {
      return res.status(500).json({
        message: 'Bad request to Claude API',
        error: error.message
      });
    }

    res.status(500).json({
      message: 'AI service error',
      error: error.message
    });
  }
};