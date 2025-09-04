import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Loader2, Heart, Brain, Sparkles, Star, Calendar, Globe, BookOpen, Film, Tv, Zap, TrendingUp, Users } from 'lucide-react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [memoryText, setMemoryText] = useState('');
  const [currentMood, setCurrentMood] = useState('');
  const [moodAnalysis, setMoodAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzingMood, setAnalyzingMood] = useState(false);
  const [selectedContentTypes, setSelectedContentTypes] = useState(['movies', 'books', 'dramas']);
  const [selectedLanguages, setSelectedLanguages] = useState(['en']);

  const contentTypes = [
    { value: 'movies', label: 'Movies', icon: Film },
    { value: 'books', label: 'Books', icon: BookOpen },
    { value: 'dramas', label: 'TV Shows & Dramas', icon: Tv }
  ];

  const languages = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'hi', label: 'Hindi', flag: '🇮🇳' },
    { value: 'es', label: 'Spanish', flag: '🇪🇸' },
    { value: 'fr', label: 'French', flag: '🇫🇷' },
    { value: 'ja', label: 'Japanese', flag: '🇯🇵' },
    { value: 'ko', label: 'Korean', flag: '🇰🇷' }
  ];

  const moods = [
    { name: 'happy', emoji: '😊', description: 'Joyful and uplifting' },
    { name: 'sad', emoji: '😢', description: 'Emotional and touching' },
    { name: 'excited', emoji: '🤩', description: 'Thrilling and energetic' },
    { name: 'romantic', emoji: '💕', description: 'Love and connection' },
    { name: 'nostalgic', emoji: '🌅', description: 'Memories and reflection' },
    { name: 'adventurous', emoji: '🗺️', description: 'Exploration and discovery' },
    { name: 'relaxed', emoji: '😌', description: 'Calm and peaceful' },
    { name: 'anxious', emoji: '😰', description: 'Tense and suspenseful' },
    { name: 'angry', emoji: '😠', description: 'Intense and powerful' },
    { name: 'hopeful', emoji: '🌟', description: 'Inspiring and uplifting' },
    { name: 'melancholic', emoji: '🌧️', description: 'Deep and contemplative' },
    { name: 'energetic', emoji: '⚡', description: 'High-octane and dynamic' },
    { name: 'peaceful', emoji: '🕊️', description: 'Serene and harmonious' },
    { name: 'confused', emoji: '🤔', description: 'Complex and thought-provoking' },
    { name: 'inspired', emoji: '💡', description: 'Creative and motivational' }
  ];

  const getMoodColor = (mood) => {
    const moodColors = {
      happy: 'from-yellow-400 via-orange-400 to-red-400',
      sad: 'from-blue-500 via-indigo-500 to-purple-600',
      excited: 'from-red-500 via-pink-500 to-purple-600',
      romantic: 'from-pink-400 via-rose-400 to-red-500',
      nostalgic: 'from-amber-400 via-orange-500 to-red-600',
      adventurous: 'from-green-500 via-teal-500 to-blue-600',
      relaxed: 'from-green-300 via-emerald-400 to-teal-500',
      anxious: 'from-gray-500 via-slate-600 to-gray-700',
      angry: 'from-red-600 via-red-700 to-red-800',
      hopeful: 'from-sky-400 via-blue-500 to-indigo-600',
      melancholic: 'from-indigo-500 via-purple-600 to-violet-700',
      energetic: 'from-orange-500 via-red-500 to-pink-600',
      peaceful: 'from-teal-400 via-cyan-500 to-blue-500',
      confused: 'from-purple-400 via-indigo-500 to-blue-600',
      inspired: 'from-violet-500 via-purple-600 to-indigo-700'
    };
    return moodColors[mood] || 'from-gray-400 to-gray-600';
  };

  const analyzeMood = async () => {
    if (!memoryText.trim()) return;
    
    setAnalyzingMood(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/analyze-mood`, {
        memory_text: memoryText,
        user_id: 'demo_user'
      });
      
      setMoodAnalysis(response.data);
      setCurrentMood(response.data.mood);
    } catch (error) {
      console.error('Mood analysis failed:', error);
      alert('Failed to analyze mood. Please try again.');
    } finally {
      setAnalyzingMood(false);
    }
  };

  const getRecommendations = async (mood = currentMood) => {
    if (!mood) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/recommendations`, {
        mood: mood,
        content_types: selectedContentTypes,
        languages: selectedLanguages,
        user_id: 'demo_user'
      });
      
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      alert('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
    setMoodAnalysis(null);
    getRecommendations(mood);
  };

  useEffect(() => {
    if (currentMood) {
      getRecommendations();
    }
  }, [selectedContentTypes, selectedLanguages]);

  const getContentIcon = (type) => {
    switch(type) {
      case 'movie': return <Film className="w-4 h-4" />;
      case 'book': return <BookOpen className="w-4 h-4" />;
      case 'drama': return <Tv className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const renderContentItem = (item) => (
    <Card key={item.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
      <div className="aspect-[3/4] relative overflow-hidden">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1489599162158-1f92b42d39d6?w=300&h=450&fit=crop';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 flex items-center justify-center">
            <div className="text-slate-500 text-center">
              <div className="text-5xl mb-3 opacity-60">
                {getContentIcon(item.content_type)}
              </div>
              <p className="text-sm font-medium">No Image Available</p>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="text-xs font-semibold bg-black/70 text-white border-0 shadow-lg">
            {item.content_type}
          </Badge>
        </div>
        {item.rating && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-sm font-bold">{item.rating.toFixed(1)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors duration-300">{item.title}</h3>
        <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">{item.description}</p>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            {item.year && (
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span className="font-medium">{item.year}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-slate-500">
              <Globe className="w-3.5 h-3.5" />
              <span className="font-medium uppercase">{item.language}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-violet-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="font-semibold">Popular</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Moods
                </h1>
                <p className="text-sm font-medium text-slate-600">AI-powered mood-based recommendations</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/60 px-4 py-2 rounded-full border border-slate-200">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span className="font-semibold">Powered by AI</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
                <Users className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-emerald-700">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Mood Analysis Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-slate-800 via-violet-600 to-slate-800 bg-clip-text text-transparent leading-tight">
              Discover Content That Matches Your Soul
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Share a memory, describe your feelings, or choose your current mood. Our advanced AI will curate the perfect entertainment just for you.
            </p>
          </div>

          <Card className="max-w-3xl mx-auto shadow-2xl border-0 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                Tell us about your mood
              </CardTitle>
              <CardDescription className="text-lg text-slate-600">
                Share a memory, experience, or just describe how you're feeling right now
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="I remember walking through the park on a sunny afternoon, feeling grateful for the small moments of peace..."
                value={memoryText}
                onChange={(e) => setMemoryText(e.target.value)}
                className="min-h-[140px] resize-none text-lg leading-relaxed border-2 border-slate-200 focus:border-violet-400 rounded-xl bg-white/80"
              />
              <Button 
                onClick={analyzeMood}
                disabled={!memoryText.trim() || analyzingMood}
                className="w-full h-14 bg-gradient-to-r from-violet-500 via-purple-500 to-violet-600 hover:from-violet-600 hover:via-purple-600 hover:to-violet-700 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {analyzingMood ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Analyzing your mood...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-3" />
                    Analyze My Mood
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Mood Analysis Result */}
          {moodAnalysis && (
            <Card className="max-w-3xl mx-auto mt-8 border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 backdrop-blur-sm">
              <CardContent className="pt-8">
                <div className="text-center">
                  <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-gradient-to-r ${getMoodColor(moodAnalysis.mood)} text-white font-bold text-2xl mb-6 shadow-xl`}>
                    <span className="text-2xl">{moods.find(m => m.name === moodAnalysis.mood)?.emoji || '🎭'}</span>
                    {moodAnalysis.mood.charAt(0).toUpperCase() + moodAnalysis.mood.slice(1)}
                  </div>
                  <p className="text-lg text-slate-700 mb-6 leading-relaxed max-w-2xl mx-auto">{moodAnalysis.analysis}</p>
                  <div className="flex flex-wrap gap-3 justify-center mb-4">
                    {moodAnalysis.emotions.map((emotion, index) => (
                      <Badge key={index} variant="outline" className="px-4 py-2 text-sm font-medium border-violet-200 text-violet-700 bg-violet-50">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-slate-500 font-medium">
                    Confidence: {(moodAnalysis.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Manual Mood Selection */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center text-slate-800">Or choose your mood directly</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {moods.map((mood) => (
              <Button
                key={mood.name}
                variant={currentMood === mood.name ? "default" : "outline"}
                onClick={() => handleMoodSelect(mood.name)}
                className={`group p-4 h-auto flex flex-col items-center gap-2 transition-all duration-300 ${
                  currentMood === mood.name 
                    ? `bg-gradient-to-r ${getMoodColor(mood.name)} text-white border-0 shadow-lg scale-105` 
                    : 'hover:scale-105 hover:shadow-md bg-white/80 border-slate-200 hover:border-violet-300'
                }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="font-semibold capitalize">{mood.name}</span>
                <span className="text-xs opacity-80 text-center leading-tight">{mood.description}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Filters */}
        {currentMood && (
          <div className="mb-12">
            <Card className="max-w-5xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-lg font-semibold mb-4 text-slate-700">Content Types</label>
                    <div className="grid grid-cols-1 gap-3">
                      {contentTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = selectedContentTypes.includes(type.value);
                        return (
                          <Button
                            key={type.value}
                            variant={isSelected ? "default" : "outline"}
                            className={`justify-start h-12 text-left ${
                              isSelected 
                                ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md' 
                                : 'bg-white/80 hover:bg-violet-50 border-slate-200 hover:border-violet-300'
                            }`}
                            onClick={() => {
                              if (selectedContentTypes.includes(type.value)) {
                                setSelectedContentTypes(selectedContentTypes.filter(t => t !== type.value));
                              } else {
                                setSelectedContentTypes([...selectedContentTypes, type.value]);
                              }
                            }}
                          >
                            <Icon className="w-5 h-5 mr-3" />
                            {type.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-lg font-semibold mb-4 text-slate-700">Languages</label>
                    <div className="grid grid-cols-2 gap-3">
                      {languages.map((lang) => {
                        const isSelected = selectedLanguages.includes(lang.value);
                        return (
                          <Button
                            key={lang.value}
                            variant={isSelected ? "default" : "outline"}
                            className={`justify-start h-12 text-left ${
                              isSelected 
                                ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md' 
                                : 'bg-white/80 hover:bg-violet-50 border-slate-200 hover:border-violet-300'
                            }`}
                            onClick={() => {
                              if (selectedLanguages.includes(lang.value)) {
                                setSelectedLanguages(selectedLanguages.filter(l => l !== lang.value));
                              } else {
                                setSelectedLanguages([...selectedLanguages, lang.value]);
                              }
                            }}
                          >
                            <span className="mr-3 text-lg">{lang.flag}</span>
                            {lang.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recommendations */}
        {currentMood && (
          <div>
            <div className="text-center mb-10">
              <h3 className="text-4xl font-black mb-3">
                Perfect for your <span className={`bg-gradient-to-r ${getMoodColor(currentMood)} bg-clip-text text-transparent`}>
                  {currentMood}
                </span> mood
              </h3>
              <p className="text-lg text-slate-600">Curated recommendations powered by AI</p>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full mb-6">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
                <p className="text-lg text-slate-600 font-medium">Finding perfect recommendations...</p>
              </div>
            ) : recommendations.length > 0 ? (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4 mb-10 h-14 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg">
                  <TabsTrigger value="all" className="text-sm font-semibold">All</TabsTrigger>
                  <TabsTrigger value="movies" className="text-sm font-semibold">Movies</TabsTrigger>
                  <TabsTrigger value="books" className="text-sm font-semibold">Books</TabsTrigger>
                  <TabsTrigger value="dramas" className="text-sm font-semibold">Shows</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {recommendations.map(renderContentItem)}
                  </div>
                </TabsContent>
                
                <TabsContent value="movies">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {recommendations.filter(item => item.content_type === 'movie').map(renderContentItem)}
                  </div>
                </TabsContent>
                
                <TabsContent value="books">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {recommendations.filter(item => item.content_type === 'book').map(renderContentItem)}
                  </div>
                </TabsContent>
                
                <TabsContent value="dramas">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {recommendations.filter(item => item.content_type === 'drama').map(renderContentItem)}
                  </div>
                </TabsContent>
              </Tabs>
            ) : currentMood && !loading ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">😔</div>
                <p className="text-lg text-slate-600 font-medium">No recommendations found. Try a different mood or check your filters.</p>
              </div>
            ) : null}
          </div>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="relative bg-gradient-to-r from-slate-50 to-violet-50 border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Moods
              </h3>
            </div>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Discover content that matches your emotions. Powered by advanced AI and real-time mood analysis.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-500 mb-6">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-violet-500" />
                AI-Powered
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-violet-500" />
                Multi-Language
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-violet-500" />
                Mood-Based
              </div>
            </div>
            <p className="text-slate-500">&copy; 2025 Moods. Discover content that matches your emotions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;