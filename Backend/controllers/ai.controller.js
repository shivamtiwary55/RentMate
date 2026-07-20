import Anthropic from '@anthropic-ai/sdk';
import { Listing } from '../models/listing.model.js';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export const chatWithAI = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    // Fetch all available listings from database
    const listings = await Listing.find({ isAvailable: true })
      .populate('landlord', 'name')
      .select('title rent roomType address amenities deposit preferredTenants');

    // Format listings for AI context
    const listingsContext = listings.map((l, i) => `
      Listing ${i + 1}:
      - Title: ${l.title}
      - Rent: ₹${l.rent}/month
      - Deposit: ₹${l.deposit}
      - Type: ${l.roomType}
      - City: ${l.address?.city}, ${l.address?.state}
      - Amenities: ${l.amenities?.join(', ')}
      - Preferred Tenants: ${l.preferredTenants}
      - Landlord: ${l.landlord?.name}
    `).join('\n');

    // System prompt — tells AI how to behave
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

    // Build messages array with conversation history
    const messages = [
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ];

    // Call Claude API
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages
    });

    const aiReply = response.content[0].text;

    res.status(200).json({
      reply: aiReply,
      updatedHistory: [
        ...(conversationHistory || []),
        { role: 'user', content: message },
        { role: 'assistant', content: aiReply }
      ]
    });

  } catch (error) {
    console.error('AI chat error:', error.message);
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
};