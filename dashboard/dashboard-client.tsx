
'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Heart, 
  Brain, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Play, 
  BookOpen, 
  Target,
  MessageCircle,
  Award,
  Calendar,
  Activity,
  Sparkles,
  Users,
  Eye,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface DashboardClientProps {
  user: any
  recentSessions: any[]
  progressData: any[]
  preferences: any
}

export default function DashboardClient({ user, recentSessions, progressData, preferences }: DashboardClientProps) {
  const [selectedMetric, setSelectedMetric] = useState('overall_satisfaction')

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  // Calculate progress metrics
  const overallProgress = progressData?.length > 0 
    ? progressData.slice(0, 5).reduce((sum, p) => sum + p.value, 0) / Math.min(progressData.length, 5) 
    : 0

  const weeklyGoalProgress = 75 // Mock data
  const totalSessions = recentSessions?.length || 0

  const achievements = [
    { name: 'First Steps', description: 'Completed your first coaching session', unlocked: totalSessions >= 1 },
    { name: 'Consistent Learner', description: 'Completed 5 coaching sessions', unlocked: totalSessions >= 5 },
    { name: 'Progress Tracker', description: 'Logged progress for 7 consecutive days', unlocked: progressData?.length >= 7 },
    { name: 'Communication Master', description: 'Improved communication scores by 25%', unlocked: overallProgress >= 7 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container-custom flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <Heart className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.fullName?.split(' ')[0] || 'there'}!</h1>
              <p className="text-sm text-muted-foreground">
                {preferences?.preferredCoachingStyle && `${preferences.preferredCoachingStyle} coaching style`}
                {user?.subscriptionTier && ` • ${user.subscriptionTier} plan`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={user?.subscriptionTier === 'premium' ? 'default' : 'secondary'}>
              {user?.subscriptionTier || 'free'} plan
            </Badge>
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-semibold mb-6">Start Your Session</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    title: 'AI Coaching Chat',
                    description: 'Get personalized guidance and advice',
                    icon: MessageCircle,
                    href: '/dashboard/ai-coach',
                    color: 'from-blue-500 to-cyan-500'
                  },
                  {
                    title: 'AI Video Analysis',
                    description: 'Real-time video analysis with AI feedback',
                    icon: Eye,
                    href: '/dashboard/video-analysis',
                    color: 'from-violet-500 to-purple-500',
                    premium: true
                  },
                  {
                    title: 'Arousal Coaching',
                    description: 'Mindfulness and arousal awareness training',
                    icon: Heart,
                    href: '/dashboard/arousal-coaching',
                    color: 'from-rose-500 to-pink-500'
                  },
                  {
                    title: 'Position Guidance',
                    description: 'Explore new techniques and positions',
                    icon: Target,
                    href: '/dashboard/positions',
                    color: 'from-purple-500 to-violet-500'
                  },
                  {
                    title: 'Educational Content',
                    description: 'Learn from expert resources and guides',
                    icon: BookOpen,
                    href: '/dashboard/education',
                    color: 'from-green-500 to-emerald-500'
                  },
                  {
                    title: 'Advanced Analytics',
                    description: 'Detailed insights and progress tracking',
                    icon: BarChart3,
                    href: '/dashboard/analytics',
                    color: 'from-indigo-500 to-blue-500',
                    premium: true
                  },
                  {
                    title: 'AI Training Status',
                    description: 'Monitor AI model performance and updates',
                    icon: Brain,
                    href: '/dashboard/ai-status',
                    color: 'from-cyan-500 to-teal-500',
                    premium: true
                  }
                ].map((action) => (
                  <motion.div
                    key={action.title}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href={action.href}>
                      <Card className="h-full card-hover cursor-pointer bg-white/70 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${action.color}`}>
                              <action.icon className="h-6 w-6 text-white" />
                            </div>
                            {(action as any).premium && (
                              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                                Premium
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                          <p className="text-muted-foreground text-sm">{action.description}</p>
                          <Button className="w-full mt-4" variant="outline">
                            <Play className="h-4 w-4 mr-2" />
                            Start Session
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-6">Your Progress</h2>
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Weekly Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Satisfaction</span>
                        <span className="text-sm text-muted-foreground">{Math.round(overallProgress * 10)}%</span>
                      </div>
                      <Progress value={overallProgress * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Weekly Goal</span>
                        <span className="text-sm text-muted-foreground">{weeklyGoalProgress}%</span>
                      </div>
                      <Progress value={weeklyGoalProgress} className="h-2" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{totalSessions}</div>
                        <div className="text-xs text-muted-foreground">Total Sessions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{progressData?.length || 0}</div>
                        <div className="text-xs text-muted-foreground">Progress Entries</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{achievements.filter(a => a.unlocked).length}</div>
                        <div className="text-xs text-muted-foreground">Achievements</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentSessions?.slice(0, 3).map((session) => (
                      <div key={session.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          <div>
                            <p className="text-sm font-medium capitalize">
                              {session.sessionType.replace('_', ' ')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(session.startTime), 'MMM d, HH:mm')}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {session.status}
                        </Badge>
                      </div>
                    )) || (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No recent activity. Start your first session!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.map((achievement) => (
                      <div key={achievement.name} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          achievement.unlocked ? 'bg-primary text-white' : 'bg-gray-200'
                        }`}>
                          {achievement.unlocked ? (
                            <Sparkles className="h-4 w-4" />
                          ) : (
                            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${
                            achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {achievement.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sessions completed</span>
                      <span className="font-semibold">
                        {recentSessions?.filter(s => {
                          const sessionDate = new Date(s.startTime)
                          const weekAgo = new Date()
                          weekAgo.setDate(weekAgo.getDate() - 7)
                          return sessionDate >= weekAgo
                        }).length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Progress entries</span>
                      <span className="font-semibold">
                        {progressData?.filter(p => {
                          const entryDate = new Date(p.measurementDate)
                          const weekAgo = new Date()
                          weekAgo.setDate(weekAgo.getDate() - 7)
                          return entryDate >= weekAgo
                        }).length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Goal progress</span>
                      <span className="font-semibold text-primary">{weeklyGoalProgress}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
