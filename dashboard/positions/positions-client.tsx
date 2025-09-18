
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Filter, 
  Heart, 
  ArrowLeft,
  Star,
  Clock,
  Users,
  Target,
  Info,
  Play,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Position {
  id: string
  name: string
  category: string
  description: string
  instructions: string
  benefitsFor: string[]
  difficultyLevel: string
  avgRating: number
  totalRatings: number
  imageUrl?: string
  isPremium: boolean
  estimatedDuration: string
}

export default function PositionsClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)

  const positions: Position[] = [
    {
      id: '1',
      name: 'Intimate Embrace',
      category: 'romantic',
      description: 'A gentle, emotionally connecting position focused on eye contact and tender intimacy.',
      instructions: 'Face each other with gentle, synchronized movements. Focus on eye contact and emotional connection. Take your time to build intimacy gradually.',
      benefitsFor: ['Emotional connection', 'Intimacy building', 'Communication'],
      difficultyLevel: 'Beginner',
      avgRating: 4.8,
      totalRatings: 245,
      imageUrl: '/images/positions/intimate-embrace.jpg',
      isPremium: false,
      estimatedDuration: '15-30 min'
    },
    {
      id: '2',
      name: 'Spooning Connection',
      category: 'comfortable',
      description: 'Side-by-side position emphasizing skin-to-skin contact and gentle intimacy.',
      instructions: 'Lie on your sides with close body contact. Focus on synchronized breathing and gentle movements. Perfect for extended intimate sessions.',
      benefitsFor: ['Comfort', 'Extended intimacy', 'Relaxation'],
      difficultyLevel: 'Beginner',
      avgRating: 4.7,
      totalRatings: 198,
      imageUrl: '/images/positions/spooning.jpg',
      isPremium: false,
      estimatedDuration: '20-45 min'
    },
    {
      id: '3',
      name: 'Mindful Sitting',
      category: 'mindful',
      description: 'Seated position promoting deep emotional and physical connection through mindfulness.',
      instructions: 'Sit facing each other with legs intertwined. Focus on breathing together and maintaining eye contact. Emphasize slow, mindful movements.',
      benefitsFor: ['Mindfulness', 'Deep connection', 'Communication'],
      difficultyLevel: 'Intermediate',
      avgRating: 4.9,
      totalRatings: 156,
      imageUrl: '/images/positions/mindful-sitting.jpg',
      isPremium: true,
      estimatedDuration: '25-40 min'
    },
    {
      id: '4',
      name: 'Standing Embrace',
      category: 'adventurous',
      description: 'Vertical position that adds variety and excitement while maintaining intimacy.',
      instructions: 'Stand facing each other with close body contact. Use wall or surface for support if needed. Focus on balance and gentle movements.',
      benefitsFor: ['Variety', 'Excitement', 'Strength building'],
      difficultyLevel: 'Intermediate',
      avgRating: 4.5,
      totalRatings: 89,
      imageUrl: '/images/positions/standing-embrace.jpg',
      isPremium: true,
      estimatedDuration: '10-20 min'
    },
    {
      id: '5',
      name: 'Gentle Missionary',
      category: 'classic',
      description: 'Traditional position with focus on emotional connection and comfortable intimacy.',
      instructions: 'Classic face-to-face position with emphasis on eye contact and gentle rhythm. Perfect for building emotional and physical intimacy.',
      benefitsFor: ['Intimacy', 'Eye contact', 'Emotional bonding'],
      difficultyLevel: 'Beginner',
      avgRating: 4.6,
      totalRatings: 312,
      imageUrl: '/images/positions/gentle-missionary.jpg',
      isPremium: false,
      estimatedDuration: '15-35 min'
    },
    {
      id: '6',
      name: 'Side Caress',
      category: 'romantic',
      description: 'Side-by-side position emphasizing touch, caressing, and extended foreplay.',
      instructions: 'Lie on your sides facing each other. Focus on extended touching, caressing, and building anticipation. Take time to explore and connect.',
      benefitsFor: ['Extended foreplay', 'Touch exploration', 'Intimacy building'],
      difficultyLevel: 'Beginner',
      avgRating: 4.8,
      totalRatings: 167,
      imageUrl: '/images/positions/side-caress.jpg',
      isPremium: true,
      estimatedDuration: '20-50 min'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Positions', count: positions.length },
    { id: 'romantic', name: 'Romantic', count: positions.filter(p => p.category === 'romantic').length },
    { id: 'comfortable', name: 'Comfortable', count: positions.filter(p => p.category === 'comfortable').length },
    { id: 'mindful', name: 'Mindful', count: positions.filter(p => p.category === 'mindful').length },
    { id: 'classic', name: 'Classic', count: positions.filter(p => p.category === 'classic').length },
    { id: 'adventurous', name: 'Adventurous', count: positions.filter(p => p.category === 'adventurous').length }
  ]

  const filteredPositions = positions.filter(position => {
    const matchesSearch = position.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         position.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || position.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
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
              <Target className="h-6 w-6 text-purple-600" />
              <h1 className="text-xl font-semibold">Position Guidance</h1>
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
                placeholder="Search positions..."
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

        {/* Positions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPositions.map((position) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => setSelectedPosition(position)}
              >
                <Card className="h-full card-hover bg-white/70 backdrop-blur-sm">
                  <div className="relative">
                    <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-rose-100 rounded-t-lg flex items-center justify-center">
                      <Heart className="h-12 w-12 text-purple-400" />
                    </div>
                    
                    {position.isPremium && (
                      <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600">
                        Premium
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{position.name}</CardTitle>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{position.avgRating}</span>
                        <span className="text-xs text-muted-foreground">({position.totalRatings})</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {position.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <Badge className={getDifficultyColor(position.difficultyLevel)}>
                        {position.difficultyLevel}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {position.estimatedDuration}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {position.benefitsFor.slice(0, 2).map((benefit, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                      {position.benefitsFor.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{position.benefitsFor.length - 2} more
                        </Badge>
                      )}
                    </div>

                    <Button className="w-full" size="sm">
                      <Info className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPositions.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No positions found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Position Detail Modal */}
      {selectedPosition && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-semibold">{selectedPosition.name}</h2>
                  {selectedPosition.isPremium && (
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                      Premium
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" onClick={() => setSelectedPosition(null)}>
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-rose-100 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="h-16 w-16 text-purple-400" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground">{selectedPosition.description}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Instructions</h3>
                      <p className="text-muted-foreground">{selectedPosition.instructions}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Difficulty:</span>
                        <Badge className={getDifficultyColor(selectedPosition.difficultyLevel)}>
                          {selectedPosition.difficultyLevel}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Duration:</span>
                        <span className="text-sm">{selectedPosition.estimatedDuration}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Rating:</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm">{selectedPosition.avgRating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedPosition.benefitsFor.map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    <Button className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Start Guided Session
                    </Button>
                    <Button variant="outline" className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Save to Favorites
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
