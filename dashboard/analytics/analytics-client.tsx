
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  ArrowLeft, 
  Calendar,
  Target,
  Heart,
  Brain,
  Activity,
  Award,
  Zap,
  Eye,
  Clock,
  Users,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface AnalyticsData {
  sessions: {
    total: number
    thisWeek: number
    lastWeek: number
    change: number
  }
  arousal: {
    average: number
    peak: number
    improvement: number
  }
  engagement: {
    score: number
    trend: 'up' | 'down' | 'stable'
    sessions: number
  }
  aiAccuracy: {
    overall: number
    videoAnalysis: number
    recommendations: number
  }
}

export default function AnalyticsClient() {
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    sessions: { total: 0, thisWeek: 0, lastWeek: 0, change: 0 },
    arousal: { average: 0, peak: 0, improvement: 0 },
    engagement: { score: 0, trend: 'stable', sessions: 0 },
    aiAccuracy: { overall: 0, videoAnalysis: 0, recommendations: 0 }
  })

  // Mock data for demonstration
  const weeklyData = [
    { name: 'Mon', sessions: 4, arousal: 65, engagement: 78 },
    { name: 'Tue', sessions: 3, arousal: 72, engagement: 82 },
    { name: 'Wed', sessions: 5, arousal: 68, engagement: 76 },
    { name: 'Thu', sessions: 7, arousal: 75, engagement: 85 },
    { name: 'Fri', sessions: 6, arousal: 82, engagement: 88 },
    { name: 'Sat', sessions: 8, arousal: 79, engagement: 90 },
    { name: 'Sun', sessions: 5, arousal: 77, engagement: 87 }
  ]

  const monthlyProgress = [
    { month: 'Jan', improvement: 15 },
    { month: 'Feb', improvement: 22 },
    { month: 'Mar', improvement: 31 },
    { month: 'Apr', improvement: 45 },
    { month: 'May', improvement: 52 },
    { month: 'Jun', improvement: 68 }
  ]

  const sessionTypes = [
    { name: 'AI Coaching', value: 35, color: '#8884d8' },
    { name: 'Video Analysis', value: 25, color: '#82ca9d' },
    { name: 'Arousal Training', value: 20, color: '#ffc658' },
    { name: 'Position Guidance', value: 20, color: '#ff7c7c' }
  ]

  const achievements = [
    { name: 'Consistency Champion', description: '7 days in a row', icon: Target, color: 'text-green-500' },
    { name: 'Progress Pioneer', description: '50% improvement', icon: TrendingUp, color: 'text-blue-500' },
    { name: 'AI Explorer', description: 'All features tried', icon: Brain, color: 'text-purple-500' },
    { name: 'Intimacy Master', description: 'Advanced level reached', icon: Award, color: 'text-yellow-500' }
  ]

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      // Simulate API call
      setTimeout(() => {
        setAnalytics({
          sessions: {
            total: 42,
            thisWeek: 12,
            lastWeek: 8,
            change: 50
          },
          arousal: {
            average: 74,
            peak: 89,
            improvement: 23
          },
          engagement: {
            score: 86,
            trend: 'up',
            sessions: 38
          },
          aiAccuracy: {
            overall: 92,
            videoAnalysis: 89,
            recommendations: 94
          }
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to load analytics:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b dark:border-gray-800">
        <div className="container-custom flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Advanced Analytics</h1>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">Premium</Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="container-custom py-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold">{analytics.sessions.total}</p>
                      {analytics.sessions.change > 0 && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +{analytics.sessions.change}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Arousal</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold">{analytics.arousal.average}%</p>
                      <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400">
                        Peak: {analytics.arousal.peak}%
                      </Badge>
                    </div>
                  </div>
                  <Heart className="h-8 w-8 text-rose-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Engagement Score</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold">{analytics.engagement.score}%</p>
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                        {analytics.engagement.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {analytics.engagement.trend}
                      </Badge>
                    </div>
                  </div>
                  <Zap className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">AI Accuracy</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold">{analytics.aiAccuracy.overall}%</p>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Excellent
                      </Badge>
                    </div>
                  </div>
                  <Brain className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Trends */}
          <TabsContent value="trends">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                  <CardDescription>Your session activity over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="sessions" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="arousal" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Monthly Progress</CardTitle>
                  <CardDescription>Overall improvement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="improvement" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sessions */}
          <TabsContent value="sessions">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Session Distribution</CardTitle>
                  <CardDescription>Breakdown of your coaching sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sessionTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sessionTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {sessionTypes.map((type, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: type.color }}
                          />
                          <span className="text-sm">{type.name}</span>
                        </div>
                        <span className="text-sm font-medium">{type.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Session Insights</CardTitle>
                  <CardDescription>Key metrics from your sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Average Session Duration</span>
                      <span className="text-sm">24 minutes</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Completion Rate</span>
                      <span className="text-sm">96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Satisfaction Score</span>
                      <span className="text-sm">4.8/5</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Goal Achievement</span>
                      <span className="text-sm">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Insights */}
          <TabsContent value="ai-insights">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Video Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{analytics.aiAccuracy.videoAnalysis}%</div>
                    <p className="text-sm text-muted-foreground">Accuracy Score</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Arousal Detection</span>
                      <span>94%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Engagement Analysis</span>
                      <span>87%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Position Recognition</span>
                      <span>91%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{analytics.aiAccuracy.recommendations}%</div>
                    <p className="text-sm text-muted-foreground">Relevance Score</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Personalization</span>
                      <span>96%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Timing</span>
                      <span>92%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Helpfulness</span>
                      <span>95%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Model Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{analytics.aiAccuracy.overall}%</div>
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Response Time</span>
                      <span>1.2s avg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Confidence</span>
                      <span>89%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Learning Rate</span>
                      <span>+2.3%/week</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Recent Achievements
                  </CardTitle>
                  <CardDescription>Milestones you've unlocked</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-700/50">
                      <div className={`p-2 rounded-full bg-white dark:bg-gray-800 ${achievement.color}`}>
                        <achievement.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <Badge>Unlocked</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Progress Summary</CardTitle>
                  <CardDescription>Your journey at a glance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">68%</div>
                    <p className="text-muted-foreground">Overall Progress</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Communication Skills</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Arousal Awareness</span>
                        <span>72%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Technique Mastery</span>
                        <span>61%</span>
                      </div>
                      <Progress value={61} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Confidence Level</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

