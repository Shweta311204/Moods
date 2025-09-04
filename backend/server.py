from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import uuid
import asyncio
from typing import Optional, List, Dict, Any
import requests
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import json
import re

# Load environment variables
load_dotenv()

app = FastAPI(title="Moods - AI-Powered Mood-Based Recommendation API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(MONGO_URL)
db = client.moods_db

# LLM Integration
import os,openai

# Check if OpenAI API key is available
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

llm_available = bool(OPENAI_API_KEY)

if not llm_available:
    print("Warning: OpenAI API key not found")


# External API keys
TMDB_API_KEY = os.environ.get('TMDB_API_KEY', 'demo_key')
GOOGLE_BOOKS_API_KEY = os.environ.get('GOOGLE_BOOKS_API_KEY', 'demo_key')

# Pydantic models
class MoodAnalysisRequest(BaseModel):
    memory_text: str
    user_id: Optional[str] = None

class RecommendationRequest(BaseModel):
    mood: str
    content_types: List[str] = ["movies", "books", "dramas"]
    languages: List[str] = ["en"]
    user_id: Optional[str] = None

class MoodAnalysisResponse(BaseModel):
    mood: str
    confidence: float
    emotions: List[str]
    analysis: str

class ContentItem(BaseModel):
    id: str
    title: str
    description: str
    rating: Optional[float]
    year: Optional[int]
    genre: List[str]
    language: str
    image_url: Optional[str]
    content_type: str

class RecommendationResponse(BaseModel):
    mood: str
    recommendations: List[ContentItem]
    total_count: int

# Mood analysis using LLM
async def analyze_mood_with_llm(memory_text: str) -> Dict[str, Any]:
    if not llm_available:
        # Fallback simple mood detection
        return {
            "mood": "neutral",
            "confidence": 0.5,
            "emotions": ["neutral"],
            "analysis": "Mood analysis unavailable - using fallback"
        }
    
    try:
        # Initialize LLM chat
        chat = LlmChat(
            api_key=LLM_KEY,
            session_id=f"mood_analysis_{uuid.uuid4()}",
            system_message="""You are an expert emotion analyst. Analyze the given text and determine the primary mood and emotions.

Return your analysis in this exact JSON format:
{
    "mood": "one of: happy, sad, excited, romantic, nostalgic, adventurous, relaxed, anxious, angry, hopeful, melancholic, energetic, peaceful, confused, inspired",
    "confidence": 0.0-1.0,
    "emotions": ["list", "of", "detected", "emotions"],
    "analysis": "brief explanation of the mood and why"
}

Focus on the emotional tone, context, and underlying feelings in the text."""
        ).with_model("openai", "gpt-4o")
        
        user_message = UserMessage(text=f"Analyze the mood and emotions in this memory/text: {memory_text}")
        response = await chat.send_message(user_message)
        
        # Parse JSON response - handle markdown wrapped JSON
        try:
            # Strip markdown code blocks if present
            clean_response = response.strip()
            if clean_response.startswith("```json"):
                clean_response = clean_response[7:]  # Remove ```json
            if clean_response.endswith("```"):
                clean_response = clean_response[:-3]  # Remove ```
            clean_response = clean_response.strip()
            
            result = json.loads(clean_response)
            return result
        except json.JSONDecodeError:
            # Try to extract JSON from the response using regex
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                try:
                    result = json.loads(json_match.group())
                    return result
                except json.JSONDecodeError:
                    pass
            
            # Fallback parsing
            return {
                "mood": "neutral",
                "confidence": 0.7,
                "emotions": ["mixed"],
                "analysis": response[:200] + "..."
            }
            
    except Exception as e:
        print(f"LLM analysis error: {e}")
        return {
            "mood": "neutral",
            "confidence": 0.5,
            "emotions": ["neutral"],
            "analysis": "Error in mood analysis"
        }

# External API functions
async def fetch_movies_by_mood(mood: str, language: str = "en") -> List[ContentItem]:
    """Fetch movies from TMDB based on mood"""
    if TMDB_API_KEY == 'demo_key':
        # Return demo data
        return [
            ContentItem(
                id="demo_movie_1",
                title="The Pursuit of Happyness" if mood in ["happy", "hopeful", "inspired"] else "Inception",
                description="A touching story of perseverance" if mood in ["happy", "hopeful", "inspired"] else "A mind-bending thriller",
                rating=8.0,
                year=2006 if mood in ["happy", "hopeful", "inspired"] else 2010,
                genre=["Drama"] if mood in ["happy", "hopeful", "inspired"] else ["Sci-Fi", "Thriller"],
                language=language,
                image_url="https://images.unsplash.com/photo-1489599162158-1f92b42d39d6?w=300&h=450&fit=crop",
                content_type="movie"
            )
        ]
    
    # Map moods to TMDB genres
    mood_to_genres = {
        "happy": "35,10751",  # Comedy, Family
        "sad": "18",          # Drama
        "excited": "28,12",   # Action, Adventure
        "romantic": "10749",  # Romance
        "nostalgic": "18,36", # Drama, History
        "adventurous": "12,28", # Adventure, Action
        "relaxed": "35,10770", # Comedy, TV Movie
        "anxious": "53,27",   # Thriller, Horror
        "energetic": "28,878", # Action, Science Fiction
        "peaceful": "99,10751", # Documentary, Family
    }
    
    genre_ids = mood_to_genres.get(mood, "18")  # Default to Drama
    
    try:
        url = f"https://api.themoviedb.org/3/discover/movie"
        params = {
            "api_key": TMDB_API_KEY,
            "with_genres": genre_ids,
            "language": language,
            "sort_by": "popularity.desc",
            "page": 1
        }
        
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        
        movies = []
        for item in data.get("results", [])[:5]:
            movies.append(ContentItem(
                id=str(item["id"]),
                title=item["title"],
                description=item["overview"][:200] + "..." if len(item["overview"]) > 200 else item["overview"],
                rating=item.get("vote_average"),
                year=int(item["release_date"][:4]) if item.get("release_date") else None,
                genre=[],  # We'd need another API call for detailed genres
                language=language,
                image_url=f"https://image.tmdb.org/t/p/w300{item['poster_path']}" if item.get("poster_path") else None,
                content_type="movie"
            ))
        
        return movies
    except Exception as e:
        print(f"TMDB API error: {e}")
        return []

async def fetch_books_by_mood(mood: str, language: str = "en") -> List[ContentItem]:
    """Fetch books from Google Books based on mood"""
    if GOOGLE_BOOKS_API_KEY == 'demo_key':
        # Return demo data
        return [
            ContentItem(
                id="demo_book_1",
                title="The Alchemist" if mood in ["hopeful", "inspired", "adventurous"] else "1984",
                description="A journey of self-discovery" if mood in ["hopeful", "inspired", "adventurous"] else "A dystopian masterpiece",
                rating=4.5,
                year=1988 if mood in ["hopeful", "inspired", "adventurous"] else 1949,
                genre=["Fiction", "Philosophy"] if mood in ["hopeful", "inspired", "adventurous"] else ["Fiction", "Dystopian"],
                language=language,
                image_url="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop",
                content_type="book"
            )
        ]
    
    # Map moods to search terms
    mood_to_search = {
        "happy": "comedy inspiration",
        "sad": "drama emotional",
        "excited": "adventure thriller",
        "romantic": "romance love",
        "nostalgic": "historical memoir",
        "adventurous": "adventure travel",
        "relaxed": "poetry meditation",
        "anxious": "mystery psychological",
        "energetic": "action adventure",
        "peaceful": "nature mindfulness",
    }
    
    search_term = mood_to_search.get(mood, "fiction")
    
    try:
        url = "https://www.googleapis.com/books/v1/volumes"
        params = {
            "q": search_term,
            "key": GOOGLE_BOOKS_API_KEY,
            "maxResults": 5,
            "orderBy": "relevance",
            "langRestrict": language
        }
        
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        
        books = []
        for item in data.get("items", []):
            volume_info = item.get("volumeInfo", {})
            books.append(ContentItem(
                id=item["id"],
                title=volume_info.get("title", "Unknown Title"),
                description=volume_info.get("description", "No description available")[:200] + "...",
                rating=volume_info.get("averageRating"),
                year=int(volume_info.get("publishedDate", "2000")[:4]) if volume_info.get("publishedDate") else None,
                genre=volume_info.get("categories", []),
                language=language,
                image_url=volume_info.get("imageLinks", {}).get("thumbnail"),
                content_type="book"
            ))
        
        return books
    except Exception as e:
        print(f"Google Books API error: {e}")
        return []

async def fetch_dramas_by_mood(mood: str, language: str = "en") -> List[ContentItem]:
    """Fetch TV shows/dramas from TMDB based on mood"""
    if TMDB_API_KEY == 'demo_key':
        # Return demo data
        return [
            ContentItem(
                id="demo_drama_1",
                title="Friends" if mood in ["happy", "relaxed", "energetic"] else "Breaking Bad",
                description="A comedy about six friends" if mood in ["happy", "relaxed", "energetic"] else "A drama about transformation",
                rating=9.0,
                year=1994 if mood in ["happy", "relaxed", "energetic"] else 2008,
                genre=["Comedy"] if mood in ["happy", "relaxed", "energetic"] else ["Drama", "Crime"],
                language=language,
                image_url="https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=300&h=450&fit=crop",
                content_type="drama"
            )
        ]
    
    # Similar to movies but for TV shows
    mood_to_genres = {
        "happy": "35,10751",  # Comedy, Family
        "sad": "18",          # Drama
        "excited": "10759,80", # Action & Adventure, Crime
        "romantic": "10749",  # Romance
        "nostalgic": "18,36", # Drama, History
        "adventurous": "10759", # Action & Adventure
        "relaxed": "35",      # Comedy
        "anxious": "9648,80", # Mystery, Crime
        "energetic": "10759", # Action & Adventure
        "peaceful": "99",     # Documentary
    }
    
    genre_ids = mood_to_genres.get(mood, "18")
    
    try:
        url = f"https://api.themoviedb.org/3/discover/tv"
        params = {
            "api_key": TMDB_API_KEY,
            "with_genres": genre_ids,
            "language": language,
            "sort_by": "popularity.desc",
            "page": 1
        }
        
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        
        dramas = []
        for item in data.get("results", [])[:5]:
            dramas.append(ContentItem(
                id=str(item["id"]),
                title=item["name"],
                description=item["overview"][:200] + "..." if len(item["overview"]) > 200 else item["overview"],
                rating=item.get("vote_average"),
                year=int(item["first_air_date"][:4]) if item.get("first_air_date") else None,
                genre=[],
                language=language,
                image_url=f"https://image.tmdb.org/t/p/w300{item['poster_path']}" if item.get("poster_path") else None,
                content_type="drama"
            ))
        
        return dramas
    except Exception as e:
        print(f"TMDB TV API error: {e}")
        return []

# API Routes
@app.get("/")
async def root():
    return {"message": "Moods - AI-Powered Mood-Based Recommendation API", "status": "running", "version": "2.0"}

@app.post("/api/analyze-mood", response_model=MoodAnalysisResponse)
async def analyze_mood(request: MoodAnalysisRequest):
    """Analyze mood from memory text using LLM"""
    try:
        result = await analyze_mood_with_llm(request.memory_text)
        
        # Store analysis in database if user_id provided
        if request.user_id:
            await db.mood_analyses.insert_one({
                "user_id": request.user_id,
                "memory_text": request.memory_text,
                "mood_result": result,
                "timestamp": datetime.utcnow()
            })
        
        return MoodAnalysisResponse(
            mood=result["mood"],
            confidence=result["confidence"],
            emotions=result["emotions"],
            analysis=result["analysis"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mood analysis failed: {str(e)}")

@app.post("/api/recommendations", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """Get content recommendations based on mood"""
    try:
        all_recommendations = []
        
        # Fetch content based on requested types
        for content_type in request.content_types:
            for language in request.languages:
                if content_type == "movies":
                    movies = await fetch_movies_by_mood(request.mood, language[:2])
                    all_recommendations.extend(movies)
                elif content_type == "books":
                    books = await fetch_books_by_mood(request.mood, language[:2])
                    all_recommendations.extend(books)
                elif content_type == "dramas":
                    dramas = await fetch_dramas_by_mood(request.mood, language[:2])
                    all_recommendations.extend(dramas)
        
        # Store recommendations in database if user_id provided
        if request.user_id:
            await db.recommendations.insert_one({
                "user_id": request.user_id,
                "mood": request.mood,
                "content_types": request.content_types,
                "languages": request.languages,
                "recommendations": [rec.dict() for rec in all_recommendations],
                "timestamp": datetime.utcnow()
            })
        
        return RecommendationResponse(
            mood=request.mood,
            recommendations=all_recommendations,
            total_count=len(all_recommendations)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": "Moods",
        "version": "2.0",
        "llm_available": llm_available,
        "apis_configured": {
            "tmdb": TMDB_API_KEY != 'demo_key',
            "google_books": GOOGLE_BOOKS_API_KEY != 'demo_key'
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
