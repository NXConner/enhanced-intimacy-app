
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Search, 
  Filter, 
  ArrowLeft,
  Play,
  Clock,
  Star,
  Eye,
  Heart,
  Brain,
  Users,
  MessageCircle,
  Target,
  Award
} from 'lucide-react'
import Link from 'next/link'

interface EducationalContent {
  id: string
  title: string
  contentType: 'article' | 'video' | 'interactive' | 'quiz' | 'exercise'
  category: string
  difficultyLevel: string
  content: string
  videoUrl?: string
  estimatedMinutes: number
  isPremium: boolean
  tags: string[]
  avgRating: number
  totalViews: number
}

export default function EducationClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null)

  const educationalContent: EducationalContent[] = [
    {
      id: '1',
      title: 'Building Emotional Intimacy in Relationships',
      contentType: 'article',
      category: 'communication',
      difficultyLevel: 'Beginner',
      content: 'Learn the foundations of emotional intimacy and how to create deeper connections with your partner through effective communication, active listening, and vulnerability.',
      estimatedMinutes: 8,
      isPremium: false,
      tags: ['communication', 'emotional connection', 'relationships'],
      avgRating: 4.8,
      totalViews: 1245
    },
    {
      id: '2',
      title: 'Mindfulness Techniques for Enhanced Intimacy',
      contentType: 'video',
      category: 'mindfulness',
      difficultyLevel: 'Intermediate',
      content: 'Discover mindfulness practices that can enhance your intimate experiences, including breathing exercises, body awareness techniques, and present-moment focus.',
      videoUrl: '/videos/mindfulness-intimacy.mp4',
      estimatedMinutes: 15,
      isPremium: true,
      tags: ['mindfulness', 'meditation', 'body awareness'],
      avgRating: 4.9,
      totalViews: 856
    },
    {
      id: '3',
      title: 'Understanding Arousal and Response Cycles',
      contentType: 'interactive',
      category: 'education',
      difficultyLevel: 'Intermediate',
      content: 'Interactive guide to understanding human sexual response cycles, arousal patterns, and how to work with natural rhythms for enhanced intimate experiences.',
      estimatedMinutes: 12,
      isPremium: true,
      tags: ['arousal', 'physiology', 'response cycles'],
      avgRating: 4.7,
      totalViews: 643
    },
    {
      id: '4',
      title: 'Communication Quiz: Intimate Conversations',
      contentType: 'quiz',
      category: 'communication',
      difficultyLevel: 'Beginner',
      content: 'Test your knowledge about effective intimate communication and learn new strategies for discussing desires, boundaries, and preferences with your partner.',
      estimatedMinutes: 10,
      isPremium: false,
      tags: ['communication', 'quiz', 'conversation'],
      avgRating: 4.6,
      totalViews: 912
    },
    {
      id: '5',
      title: 'Breathing Exercises for Intimacy',
      contentType: 'exercise',
      category: 'techniques',
      difficultyLevel: 'Beginner',
      content: 'Guided breathing exercises designed to enhance relaxation, presence, and connection during intimate moments. Includes synchronized breathing techniques for couples.',
      estimatedMinutes: 20,
      isPremium: false,
      tags: ['breathing', 'exercises', 'relaxation'],
      avgRating: 4.8,
      totalViews: 1108
    },
    {
      id: '6',
      title: 'Advanced Position Techniques and Safety',
      contentType: 'article',
      category: 'techniques',
      difficultyLevel: 'Advanced',
      content: 'Comprehensive guide to advanced intimate positions, safety considerations, communication strategies, and how to explore new experiences safely and consensually.',
      estimatedMinutes: 18,
      isPremium: true,
      tags: ['positions', 'safety', 'advanced techniques'],
      avgRating: 4.9,
      totalViews: 534
    },
    {
      id: '7',
      title: 'Creating Romance in Long-term Relationships',
      contentType: 'video',
      category: 'romance',
      difficultyLevel: 'Beginner',
      content: 'Video guide on maintaining and revitalizing romance in long-term relationships, including date ideas, spontaneous gestures, and keeping the spark alive.',
      videoUrl: '/videos/romance-longterm.mp4',
      estimatedMinutes: 14,
      isPremium: false,
      tags: ['romance', 'long-term', 'relationships'],
      avgRating: 4.7,
      totalViews: 987
    },
    {
      id: '8',
      title: 'Consent and Boundaries Interactive Workshop',
      contentType: 'interactive',
      category: 'communication',
      difficultyLevel: 'Intermediate',
      content: 'Interactive workshop covering consent, boundary-setting, and ongoing communication about comfort levels and preferences in intimate relationships.',
      estimatedMinutes: 25,
      isPremium: true,
      tags: ['consent', 'boundaries', 'workshop'],
      avgRating: 5.0,
      totalViews: 445
    }
  ]

  const categories = [
    { id: 'all', name: 'All Content', count: educationalContent.length },
    { id: 'communication', name: 'Communication', count: educationalContent.filter(c => c.category === 'communication').length },
    { id: 'techniques', name: 'Techniques', count: educationalContent.filter(c => c.category === 'techniques').length },
    { id: 'mindfulness', name: 'Mindfulness', count: educationalContent.filter(c => c.category === 'mindfulness').length },
    { id: 'education', name: 'Education', count: educationalContent.filter(c => c.category === 'education').length },
    { id: 'romance', name: 'Romance', count: educationalContent.filter(c => c.category === 'romance').length }
  ]

  const filteredContent = educationalContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || content.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return BookOpen
      case 'video': return Play
      case 'interactive': return Target
      case 'quiz': return Brain
      case 'exercise': return Heart
      default: return BookOpen
    }
  }

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-100 text-blue-800'
      case 'video': return 'bg-red-100 text-red-800'
      case 'interactive': return 'bg-purple-100 text-purple-800'
      case 'quiz': return 'bg-green-100 text-green-800'
      case 'exercise': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container-custom flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold">Educational Resources</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </header>

      <div className="container-custom py-6">
        {/* Search and Categories */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search educational content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  {category.name} ({category.count})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredContent.map((content) => {
              const IconComponent = getContentTypeIcon(content.contentType)
              
              return (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedContent(content)}
                >
                  <Card className="h-full card-hover bg-white/70 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-lg ${getContentTypeColor(content.contentType)}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          {content.isPremium && (
                            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-xs">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-medium">{content.avgRating}</span>
                        </div>
                      </div>
                      
                      <CardTitle className="text-lg leading-tight">
                        {content.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {content.content}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <Badge className={getDifficultyColor(content.difficultyLevel)}>
                          {content.difficultyLevel}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {content.estimatedMinutes} min
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {content.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {content.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{content.tags.length - 2} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Eye className="h-3 w-3 mr-1" />
                          {content.totalViews} views
                        </div>
                        <Button size="sm">
                          <Play className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No content found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Content Detail Modal */}
      {selectedContent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${getContentTypeColor(selectedContent.contentType)}`}>
                      {(() => {
                        const IconComponent = getContentTypeIcon(selectedContent.contentType)
                        return <IconComponent className="h-4 w-4" />
                      })()}
                    </div>
                    <h2 className="text-2xl font-semibold">{selectedContent.title}</h2>
                    {selectedContent.isPremium && (
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                        Premium
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {selectedContent.estimatedMinutes} minutes
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                      {selectedContent.avgRating} ({selectedContent.totalViews} views)
                    </div>
                    <Badge className={getDifficultyColor(selectedContent.difficultyLevel)}>
                      {selectedContent.difficultyLevel}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedContent(null)}>
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {selectedContent.videoUrl ? (
                    <div className="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                      <Play className="h-16 w-16 text-white opacity-50" />
                      <span className="text-white ml-2">Video Player</span>
                    </div>
                  ) : (
                    <div className={`w-full h-64 rounded-lg flex items-center justify-center mb-4 ${getContentTypeColor(selectedContent.contentType)}`}>
                      {(() => {
                        const IconComponent = getContentTypeIcon(selectedContent.contentType)
                        return <IconComponent className="h-16 w-16 opacity-50" />
                      })()}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">About This Content</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedContent.content}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedContent.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Start Learning
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        <Heart className="h-4 w-4 mr-2" />
                        Save to Favorites
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Discuss with Coach
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Learning Path</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Award className="h-4 w-4 text-green-500 mr-2" />
                          <span>Complete to earn progress</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-2" />
                          <span>Discuss with partner afterward</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Target className="h-4 w-4 mr-2" />
                          <span>Apply techniques learned</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
