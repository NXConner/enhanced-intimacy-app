
export interface User {
  id: string
  email: string
  fullName?: string
  subscriptionTier: 'free' | 'premium' | 'professional'
  isActive: boolean
  privacySettings?: any
  createdAt: Date
  updatedAt: Date
}

export interface CoachingSession {
  id: string
  userId: string
  sessionType: 'video_analysis' | 'position_guidance' | 'arousal_coaching' | 'relationship_coaching'
  status: 'active' | 'completed' | 'paused'
  startTime: Date
  endTime?: Date
  durationMinutes?: number
  sessionData?: any
  aiInsights?: any
  satisfactionScore?: number
  createdAt: Date
  updatedAt: Date
}

export interface ArousalData {
  id: string
  userId: string
  coachingSessionId?: string
  arousalLevel: number
  timestamp: Date
  context?: string
  metadata?: any
  isVerified: boolean
}

export interface ProgressTracking {
  id: string
  userId: string
  metricType: string
  value: number
  targetValue?: number
  measurementDate: Date
  weeklyAverage?: number
  monthlyAverage?: number
  progressNotes?: string
  achievementLevel?: string
}

export interface CoachingPreferences {
  id: string
  userId: string
  preferredCoachingStyle: 'gentle' | 'direct' | 'motivational' | 'educational'
  focusAreas?: string[]
  privacyLevel: 'high' | 'medium' | 'low'
  notificationSettings?: any
  goalSettings?: any
  adaptationLevel: 'conservative' | 'moderate' | 'progressive'
  createdAt: Date
  updatedAt: Date
}

export interface PositionRecommendation {
  id: string
  name: string
  category: string
  description: string
  instructions: string
  benefitsFor?: string[]
  difficultyLevel: string
  avgRating: number
  totalRatings: number
  imageUrl?: string
  videoUrl?: string
  tags?: string[]
  isVerified: boolean
  isPremium: boolean
  createdAt: Date
  updatedAt: Date
}

export interface EducationalContent {
  id: string
  title: string
  contentType: 'article' | 'video' | 'interactive' | 'quiz' | 'exercise'
  category: string
  difficultyLevel: string
  content: string
  videoUrl?: string
  imageUrls?: string[]
  estimatedMinutes: number
  isPremium: boolean
  tags?: string[]
  avgRating: number
  totalViews: number
  createdAt: Date
  updatedAt: Date
}

export interface ChatMessage {
  id?: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sessionId?: string
  metadata?: any
}

export interface AIResponse {
  status: 'processing' | 'completed' | 'error'
  message?: string
  result?: any
  confidence?: number
  recommendations?: string[]
}
