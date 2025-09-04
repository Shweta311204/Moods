# Moods.my - AI-Powered Mood-Based Recommendation Platform

An intelligent web application that analyzes your emotions from text input and provides personalized movie, book, and TV show recommendations based on your current mood.


<img width="1000" height="952" alt="Screenshot (20)" src="https://github.com/user-attachments/assets/933f757f-b3ff-440e-9e12-4daaecad6fa0" />
## # Features


- **AI-Powered Mood Analysis**: Uses OpenAI GPT-4 to analyze emotions from your text input
- <img width="800" height="960" align="centre" alt="Screenshot (24)" src="https://github.com/user-attachments/assets/bda1cfa7-f76b-4902-ae13-67554dbcf9f4" />

  
- **Smart Content Recommendations**: Get personalized movie, book, and TV show suggestions:
  <img width="800" height="965" alt="Screenshot (25)" src="https://github.com/user-attachments/assets/f58afb49-9bb5-43ba-8df8-3de36d938bf2" />

- **Interactive Mood Selection**: Choose from 15 different mood categories:
- <img width="800" height="972" alt="Screenshot (21)" src="https://github.com/user-attachments/assets/5b4c23af-c2b7-4e0d-9c8e-fb2c65d45f66" />

- **Multi-language Support**: Content recommendations in multiple languages:
  <img width="800" height="939" alt="Screenshot (22)" src="https://github.com/user-attachments/assets/4863b0ac-7121-469b-b76e-578bbb43062a" />

- **Real-time Processing**: Instant mood analysis and content suggestions:
  <img width="800" height="972" alt="Screenshot (26)" src="https://github.com/user-attachments/assets/20b7e530-0a7d-42d3-b753-032907b99642" />


## # Tech Stack

- **Frontend**: React 19, Tailwind CSS, Axios, ShadCN/UI Components
- **Backend**: Python, FastAPI, Pydantic, Uvicorn
- **Database**: MongoDB with Motor (async driver)
- **AI Integration**: OpenAI GPT-4
- **External APIs**: TMDB API, Google Books API (configurable)
- **Deployment**: Docker, Cloud hosting

## # Quick Start

### # Prerequisites

- Node.js (v18 or higher)
- Python 3.8+
- MongoDB (local or cloud instance)
- OpenAI API key or EmergentIntegrations account

### #Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/moods.my.git
   cd moods.my
   ```

2. **Set up the backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   ```

### #Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
MONGO_URL=mongodb://localhost:27017

# AI Integration
LLM_KEY=your_api_key_here

# External APIs (optional - will use demo data if not provided)
TMDB_API_KEY=your_tmdb_api_key
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

### #Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   python server.py
   # Server will run on http://localhost:8001
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   # App will open at http://localhost:3000
   ```

## # Usage

1. **Analyze Your Mood**
   - Enter a memory, thought, or description of how you're feeling
   - Click "Analyze My Mood" to get AI-powered emotion analysis

2. **Get Recommendations**
   - View your detected mood and confidence score
   - Browse personalized content recommendations
   - Filter by content type (movies, books, TV shows) and language

3. **Direct Mood Selection**
   - Skip text analysis and directly select your current mood
   - Choose from 15 emotional states for instant recommendations

## # Mood Categories

The app recognizes and provides recommendations for:
- Happy, Sad, Excited, Romantic, Nostalgic
- Adventurous, Relaxed, Anxious, Angry, Hopeful
- Melancholic, Energetic, Peaceful, Confused, Inspired

## # Project Structure

```
Moods/
├── backend/                 # Python backend application
│   ├── .env                # Environment variables (API keys, DB config)
│   ├── requirements.txt    # Python dependencies
│   └── server.py          # Main backend server file
│
├── frontend/              # React frontend application
│   ├── public/           # Static assets
│   │   └── index.html    # Main HTML template
│   │
│   ├── src/              # Source code
│   │   ├── components/   # Reusable React components
│   │   ├── hooks/        # Custom React hooks
│   │   │   └── use-toast.js
│   │   │
│   │   ├── App.css       # Application styles
│   │   ├── App.js        # Main application component
│   │   ├── index.css     # Global styles
│   │   └── index.js      # Application entry point
│   │
│   ├── .env              # Frontend environment variables
│   ├── .gitignore        # Git ignore rules
│   ├── components.json   # Component configuration
│   ├── craco.config.js   # CRACO configuration
│   ├── jsconfig.json     # JavaScript configuration
│   ├── package.json      # Node.js dependencies
│   ├── postcss.config.js # PostCSS configuration
│   ├── README.md         # Frontend documentation
│   └── tailwind.config.js # Tailwind CSS configuration
│
└── README.md           # Project documentation
```

## # API Endpoints

### POST `/api/analyze-mood`
Analyzes mood from text input using AI.

**Request:**
```json
{
  "memory_text": "I spent a peaceful afternoon reading by the window",
  "user_id": "optional_user_id"
}
```

**Response:**
```json
{
  "mood": "peaceful",
  "confidence": 0.85,
  "emotions": ["calm", "content", "relaxed"],
  "analysis": "The text conveys a sense of tranquility and contentment..."
}
```

### POST `/api/recommendations`
Gets content recommendations based on mood.

**Request:**
```json
{
  "mood": "peaceful",
  "content_types": ["movies", "books", "dramas"],
  "languages": ["en"],
  "user_id": "optional_user_id"
}
```

### GET `/api/health`
Health check endpoint for monitoring.

## # Features in Detail

### AI Mood Analysis
- Uses OpenAI GPT-4 for sophisticated emotion detection
- Analyzes text context, tone, and underlying feelings
- Provides confidence scores and detailed explanations
- Supports 15 distinct emotional categories

### Smart Recommendations
- Mood-to-content mapping algorithm
- Integration with TMDB for movies and TV shows
- Google Books integration for book recommendations
- Fallback to demo data when external APIs unavailable

### Modern UI/UX
- Responsive design with mobile-first approach
- Smooth animations and transitions
- Interactive mood selection with visual feedback
- Loading states and error handling
- Accessibility considerations




## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



##  Acknowledgments 🙏

- OpenAI for GPT-4 API
- TMDB for movie and TV show data
- Google Books for book information
- ShadCN for UI components
- Tailwind CSS for styling system

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Built using React, FastAPI, and AI**
