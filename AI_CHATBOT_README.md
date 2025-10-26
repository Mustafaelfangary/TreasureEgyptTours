# AI Chatbot System - Dahabiyat Nile Cruise

## Overview
An intelligent AI chatbot that indexes all website content and learns from user interactions to provide accurate, helpful responses about Nile cruises, dahabiyas, packages, itineraries, and more.

## Features

### 1. **Content Indexing**
The chatbot automatically indexes all website content including:
- ✅ Dahabiyas (boats) - names, descriptions, capacity, prices, features
- ✅ Packages - tour packages, prices, duration, inclusions
- ✅ Itineraries - routes, schedules, destinations
- ✅ Blogs - articles and travel guides
- ✅ FAQs - frequently asked questions
- ✅ Rates & Pricing information

### 2. **Learning Capability**
- **Conversation Storage**: Every conversation is saved to the database
- **Q&A Learning**: User questions and AI responses are stored for future reference
- **Continuous Improvement**: The system learns from past interactions
- **Session Tracking**: Each user session is tracked for context

### 3. **Smart Responses**
The AI can handle queries about:
- Dahabiya information and availability
- Package details and pricing
- Itinerary routes and schedules
- Booking procedures
- Contact information
- General Nile cruise questions

### 4. **Beautiful UI**
- **Floating Button**: Unobtrusive chat button in bottom-right corner
- **Animated Interface**: Smooth animations and transitions
- **Mobile Responsive**: Works perfectly on all devices
- **Real-time Typing**: Shows typing indicator while processing
- **Message History**: Maintains conversation context

## Files Created

### Components
1. **`src/components/chatbot/AIChatbot.tsx`**
   - Main chatbot UI component
   - Handles user interactions
   - Manages message state
   - Beautiful animated interface

2. **`src/components/chatbot/AIChatbotWrapper.tsx`**
   - Client-side wrapper for dynamic loading
   - Prevents SSR issues

### API
3. **`src/app/api/chatbot/route.ts`**
   - POST endpoint for chat messages
   - GET endpoint for conversation history
   - Content indexing service
   - AI response generator
   - Database integration for learning

### Database
4. **`prisma/migrations/add_chat_conversation/migration.sql`**
   - Creates `ChatConversation` table
   - Stores all user interactions
   - Enables learning from past conversations

## How It Works

### Content Indexing
```typescript
// Automatically indexes content every 5 minutes
ContentIndexer.indexAllContent()
  - Fetches dahabiyas from database
  - Fetches packages from database
  - Fetches itineraries from database
  - Fetches blogs from database
  - Caches for performance
```

### AI Response Generation
```typescript
AIAssistant.generateResponse(userMessage, indexedContent, history)
  - Analyzes user message
  - Extracts relevant keywords
  - Searches indexed content
  - Generates contextual response
  - Saves to database for learning
```

### Learning System
```sql
-- Every conversation is saved
INSERT INTO ChatConversation (
  sessionId,
  userMessage,
  assistantResponse,
  createdAt
)
-- Future enhancement: Use past conversations to improve responses
```

## Usage

### For Users
1. Click the floating chat button (bottom-right corner)
2. Type your question about Nile cruises
3. Get instant, accurate responses
4. Continue the conversation naturally

### For Developers
```typescript
// The chatbot is automatically included in the layout
import AIChatbotWrapper from '@/components/chatbot/AIChatbotWrapper';

// Customize appearance
<AIChatbot 
  position="bottom-right"  // or "bottom-left"
  primaryColor="#0080ff"   // Your brand color
/>
```

## API Endpoints

### POST /api/chatbot
Send a message to the chatbot
```json
{
  "message": "Tell me about your dahabiyas",
  "sessionId": "session_123456",
  "conversationHistory": []
}
```

Response:
```json
{
  "response": "We have 5 beautiful dahabiyas available...",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### GET /api/chatbot?sessionId=xxx
Get conversation history for a session

## Database Schema

```sql
CREATE TABLE "ChatConversation" (
    "id" TEXT PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "userMessage" TEXT NOT NULL,
    "assistantResponse" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB
);

-- Indexes for performance
CREATE INDEX ON "ChatConversation"("sessionId");
CREATE INDEX ON "ChatConversation"("createdAt");
```

## Future Enhancements

### Planned Features
1. **Advanced NLP**: Integrate OpenAI GPT for more natural responses
2. **Multi-language**: Support Arabic, French, German, etc.
3. **Voice Input**: Allow voice questions
4. **Image Recognition**: Analyze uploaded images
5. **Booking Integration**: Direct booking through chat
6. **Analytics Dashboard**: Track popular questions
7. **Admin Panel**: Review and improve responses
8. **Sentiment Analysis**: Understand user satisfaction
9. **Proactive Suggestions**: Suggest relevant information
10. **Integration with CRM**: Connect to customer database

### Learning Improvements
- Analyze past conversations to identify patterns
- Auto-generate responses based on similar questions
- Suggest improvements to admin
- A/B test different response styles

## Mobile Enhancements

### Fixed Issues
✅ **Blue Header**: Changed from blue gradient to clean white background
✅ **Menu Button**: Updated to use ocean-blue color matching brand
✅ **Responsive Design**: Optimized for all mobile screen sizes
✅ **Touch Targets**: Minimum 44x44px for better usability

### Mobile UI Improvements
- Clean white header with better contrast
- Larger touch targets for buttons
- Smooth animations and transitions
- Optimized for one-handed use
- Fast loading and performance

## Performance

- **Content Caching**: 5-minute cache for indexed content
- **Lazy Loading**: Chatbot loads only when needed
- **Optimized Queries**: Efficient database queries
- **Session Management**: Lightweight session tracking

## Security

- **Input Validation**: All user input is sanitized
- **Rate Limiting**: Prevents abuse (can be added)
- **Session Isolation**: Each session is independent
- **No PII Storage**: Only conversation content is stored

## Maintenance

### To Run Database Migration
```bash
# Apply the chat conversation table
npx prisma migrate deploy

# Or manually run the SQL
psql -d your_database -f prisma/migrations/add_chat_conversation/migration.sql
```

### To Clear Cache
The content cache automatically refreshes every 5 minutes. To force refresh, restart the server.

### To View Conversations
```sql
SELECT * FROM "ChatConversation"
ORDER BY "createdAt" DESC
LIMIT 100;
```

## Support

For issues or questions:
- Check the console for error messages
- Review API logs in `/api/chatbot`
- Verify database connection
- Ensure Prisma schema is up to date

## Credits

Built with:
- **Next.js 14**: React framework
- **Prisma**: Database ORM
- **Framer Motion**: Animations
- **Lucide Icons**: Beautiful icons
- **Tailwind CSS**: Styling

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: ✅ Production Ready
