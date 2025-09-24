
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Heart, 
  ArrowLeft, 
  Play, 
  Pause, 
  Square,
  Activity,
  Brain,
  Target,
  Sparkles,
  Timer,
  BarChart3,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

interface ArousalSession {
  id: string
  startTime: Date
  duration: number
  peakLevel: number
  averageLevel: number
  techniques: string[]
  notes: string
}

interface ArousalReading {
  timestamp: Date
  level: number
  technique: string
}

export default function ArousalCoachingClient() {
  const [currentArousal, setCurrentArousal] = useState(50)
  const [isTracking, setIsTracking] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [arousalHistory, setArousalHistory] = useState<ArousalReading[]>([])
  const [selectedTechnique, setSelectedTechnique] = useState('breathing')
  const [sessionData, setSessionData] = useState<ArousalSession[]>([])
  const [currentPhase, setCurrentPhase] = useState<'preparation' | 'buildup' | 'plateau' | 'cooldown'>('preparation')
  const { toast } = useToast()

  const techniques = [
    { id: 'breathing', name: 'Deep Breathing', description: 'Focus on slow, deep breaths to build mindfulness' },
    { id: 'kegels', name: 'Kegel Exercises', description: 'Strengthen pelvic floor muscles for enhanced sensation' },
    { id: 'mindfulness', name: 'Mindful Awareness', description: 'Stay present and aware of physical sensations' },
    { id: 'edging', name: 'Edge Training', description: 'Practice arousal control and延edure the experience' },
    { id: 'visualization', name: 'Visualization', description: 'Use mental imagery to enhance arousal' },
    { id: 'touch', name: 'Sensory Focus', description: 'Concentrate on different types of touch and sensation' }
  ]

  const phases = [
    { id: 'preparation', name: 'Preparation', color: 'bg-blue-500', range: [0, 25] },
    { id: 'buildup', name: 'Build-up', color: 'bg-green-500', range: [25, 65] },
    { id: 'plateau', name: 'Plateau', color: 'bg-yellow-500', range: [65, 85] },
    { id: 'cooldown', name: 'Cool-down', color: 'bg-purple-500', range: [85, 100] }
  ]

  useEffect(() => {
    // Update current phase based on arousal level
    if (currentArousal <= 25) setCurrentPhase('preparation')
    else if (currentArousal <= 65) setCurrentPhase('buildup')
    else if (currentArousal <= 85) setCurrentPhase('plateau')
    else setCurrentPhase('cooldown')
  }, [currentArousal])

  const startSession = () => {
    setIsTracking(true)
    setSessionStartTime(new Date())
    setArousalHistory([])
    setCurrentArousal(50)
    
    toast({
      title: 'Session Started',
      description: 'Begin tracking your arousal levels and practicing techniques.',
    })

    // Start automatic tracking
    const interval = setInterval(() => {
      if (isTracking) {
        setArousalHistory(prev => [...prev, {
          timestamp: new Date(),
          level: currentArousal,
          technique: selectedTechnique
        }])
      } else {
        clearInterval(interval)
      }
    }, 5000)
  }

  const endSession = () => {
    if (!sessionStartTime) return

    const duration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000 / 60)
    const peakLevel = Math.max(...arousalHistory.map(r => r.level))
    const averageLevel = arousalHistory.reduce((sum, r) => sum + r.level, 0) / arousalHistory.length || 0

    const newSession: ArousalSession = {
      id: Date.now().toString(),
      startTime: sessionStartTime,
      duration,
      peakLevel,
      averageLevel,
      techniques: Array.from(new Set(arousalHistory.map(r => r.technique))),
      notes: `Session focused on ${selectedTechnique} technique with ${arousalHistory.length} readings recorded.`
    }

    setSessionData(prev => [...prev, newSession])
    setIsTracking(false)
    setSessionStartTime(null)
    setArousalHistory([])

    toast({
      title: 'Session Complete',
      description: `${duration} minute session recorded with peak arousal of ${Math.round(peakLevel)}%.`,
    })
  }

  const getPhaseRecommendation = () => {
    switch (currentPhase) {
      case 'preparation':
        return 'Focus on relaxation and mindful breathing. Take your time to connect with your body.'
      case 'buildup':
        return 'Gradually increase stimulation while maintaining awareness. Practice chosen technique.'
      case 'plateau':
        return 'Maintain current level through controlled breathing. Perfect for edge training.'
      case 'cooldown':
        return 'Focus on gentle, mindful movements. Consider transitioning to intimacy or rest.'
      default:
        return 'Listen to your body and adjust technique as needed.'
    }
  }

  const getArousalColor = () => {
    if (currentArousal <= 25) return 'text-blue-600 bg-blue-50'
    if (currentArousal <= 50) return 'text-green-600 bg-green-50'
    if (currentArousal <= 75) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
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
              <Heart className="h-6 w-6 text-rose-600" />
              <h1 className="text-xl font-semibold">Arousal Coaching</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isTracking && (
              <Badge variant="secondary" className="animate-pulse">
                <Activity className="h-3 w-3 mr-1" />
                Live Session
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="container-custom py-6">
        <Tabs defaultValue="training" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="training">Arousal Training</TabsTrigger>
            <TabsTrigger value="techniques">Techniques</TabsTrigger>
            <TabsTrigger value="history">Session History</TabsTrigger>
          </TabsList>

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Training Interface */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Arousal Level Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Arousal Level Display */}
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-4xl font-bold ${getArousalColor()}`}>
                        {currentArousal}%
                      </div>
                      <p className="text-lg font-medium mt-2 capitalize">{currentPhase} Phase</p>
                    </div>

                    {/* Arousal Slider */}
                    <div className="space-y-4">
                      <label className="text-sm font-medium">Current Arousal Level</label>
                      <Slider
                        value={[currentArousal]}
                        onValueChange={([value]) => setCurrentArousal(value)}
                        max={100}
                        step={5}
                        className="w-full"
                        disabled={!isTracking}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Relaxed</span>
                        <span>Moderate</span>
                        <span>High</span>
                        <span>Peak</span>
                      </div>
                    </div>

                    {/* Progress Bars for Phases */}
                    <div className="grid grid-cols-4 gap-2">
                      {phases.map((phase) => (
                        <div key={phase.id} className="text-center">
                          <div className={`h-2 rounded-full ${
                            currentPhase === phase.id ? phase.color : 'bg-gray-200'
                          }`} />
                          <p className="text-xs mt-1 capitalize">{phase.name}</p>
                        </div>
                      ))}
                    </div>

                    {/* Session Controls */}
                    <div className="flex items-center justify-center space-x-4">
                      {!isTracking ? (
                        <Button onClick={startSession} className="bg-rose-600 hover:bg-rose-700">
                          <Play className="h-4 w-4 mr-2" />
                          Start Session
                        </Button>
                      ) : (
                        <Button onClick={endSession} variant="outline">
                          <Square className="h-4 w-4 mr-2" />
                          End Session
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Live Chart */}
                {isTracking && arousalHistory.length > 0 && (
                  <Card className="bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Real-time Tracking
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-32 flex items-end space-x-1">
                        {arousalHistory.slice(-12).map((reading, index) => (
                          <div
                            key={index}
                            className="flex-1 bg-gradient-to-t from-rose-500 to-pink-400 rounded-t"
                            style={{ height: `${reading.level}%` }}
                          />
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-center text-muted-foreground">
                        Last {Math.min(arousalHistory.length, 12)} readings
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Current Technique */}
                <Card className="bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Active Technique</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <select
                        value={selectedTechnique}
                        onChange={(e) => setSelectedTechnique(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        disabled={isTracking}
                      >
                        {techniques.map((technique) => (
                          <option key={technique.id} value={technique.id}>
                            {technique.name}
                          </option>
                        ))}
                      </select>
                      
                      <div className="p-3 bg-rose-50 rounded-lg">
                        <p className="text-sm">
                          {techniques.find(t => t.id === selectedTechnique)?.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Phase Guidance */}
                <Card className="bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Phase Guidance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${phases.find(p => p.id === currentPhase)?.color} mr-2`} />
                        <span className="font-medium capitalize">{currentPhase} Phase</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getPhaseRecommendation()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Session Stats */}
                {isTracking && sessionStartTime && (
                  <Card className="bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Session Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Duration:</span>
                        <Badge variant="outline">
                          <Timer className="h-3 w-3 mr-1" />
                          {Math.floor((Date.now() - sessionStartTime.getTime()) / 1000 / 60)} min
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Readings:</span>
                        <span className="text-sm font-medium">{arousalHistory.length}</span>
                      </div>
                      {arousalHistory.length > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Average:</span>
                          <span className="text-sm font-medium">
                            {Math.round(arousalHistory.reduce((sum, r) => sum + r.level, 0) / arousalHistory.length)}%
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Techniques Tab */}
          <TabsContent value="techniques">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techniques.map((technique) => (
                <motion.div
                  key={technique.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="h-full card-hover bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Brain className="h-5 w-5 mr-2" />
                        {technique.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{technique.description}</p>
                      <Button
                        variant={selectedTechnique === technique.id ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setSelectedTechnique(technique.id)}
                        disabled={isTracking}
                      >
                        {selectedTechnique === technique.id ? 'Currently Active' : 'Select Technique'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <div className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Session History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sessionData.length > 0 ? (
                    <div className="space-y-4">
                      {sessionData.slice().reverse().map((session) => (
                        <div key={session.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">
                              Session - {session.startTime.toLocaleDateString()}
                            </h3>
                            <Badge variant="outline">{session.duration} minutes</Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Peak Level:</span>
                              <div className="font-medium">{Math.round(session.peakLevel)}%</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Average Level:</span>
                              <div className="font-medium">{Math.round(session.averageLevel)}%</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Techniques:</span>
                              <div className="font-medium">{session.techniques.length}</div>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-sm text-muted-foreground">{session.notes}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No sessions yet</h3>
                      <p className="text-muted-foreground">Start your first arousal training session to see history here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
