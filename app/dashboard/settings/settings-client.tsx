
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database, 
  Heart,
  Brain,
  Eye,
  Lock,
  Trash2,
  Download,
  Upload,
  ArrowLeft,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Smartphone,
  Monitor,
  Volume2,
  VolumeX,
  Globe,
  Clock,
  Target,
  Star,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { useTheme } from '@/lib/theme'

interface UserSettings {
  // Account Settings
  fullName: string
  email: string
  bio: string
  
  // Privacy Settings  
  privacyLevel: 'high' | 'medium' | 'low'
  allowAnalytics: boolean
  shareDataForImprovement: boolean
  localProcessingOnly: boolean
  
  // AI & Coaching Settings
  coachingStyle: 'gentle' | 'direct' | 'motivational' | 'educational'
  focusAreas: string[]
  adaptationLevel: 'conservative' | 'moderate' | 'progressive'
  aiConfidenceThreshold: number
  
  // Notification Settings
  emailNotifications: boolean
  pushNotifications: boolean
  sessionReminders: boolean
  progressUpdates: boolean
  weeklyReports: boolean
  
  // Interface Settings
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  soundEffects: boolean
  animations: boolean
  compactMode: boolean
  
  // Advanced Settings
  autoBackup: boolean
  dataRetention: number // days
  exportFormat: 'json' | 'csv' | 'pdf'
  biometricAuth: boolean
  twoFactorAuth: boolean
}

export default function SettingsClient() {
  const { data: session } = useSession()
  const { theme, setTheme, actualTheme } = useTheme()
  const { toast } = useToast()
  
  const [settings, setSettings] = useState<UserSettings>({
    fullName: session?.user?.fullName || '',
    email: session?.user?.email || '',
    bio: '',
    privacyLevel: 'high',
    allowAnalytics: false,
    shareDataForImprovement: false,
    localProcessingOnly: true,
    coachingStyle: 'gentle',
    focusAreas: [],
    adaptationLevel: 'moderate',
    aiConfidenceThreshold: 85,
    emailNotifications: true,
    pushNotifications: true,
    sessionReminders: true,
    progressUpdates: true,
    weeklyReports: false,
    theme: 'system',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    soundEffects: true,
    animations: true,
    compactMode: false,
    autoBackup: true,
    dataRetention: 365,
    exportFormat: 'json',
    biometricAuth: false,
    twoFactorAuth: false
  })
  
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  
  const focusAreaOptions = [
    'Communication',
    'Emotional Intimacy',
    'Physical Intimacy',
    'Mindfulness',
    'Arousal Control',
    'Position Exploration',
    'Relationship Building',
    'Confidence Building'
  ]
  
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' }
  ]

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    setHasChanges(true)
  }, [settings])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/user/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({ ...settings, ...data })
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        toast({
          title: 'Settings Saved',
          description: 'Your preferences have been updated successfully.',
        })
        setHasChanges(false)
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    try {
      const response = await fetch(`/api/user/export?format=${settings.exportFormat}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `intimacy-data.${settings.exportFormat}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast({
          title: 'Data Exported',
          description: 'Your data has been exported successfully.',
        })
      }
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export data. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const deleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/user/delete', {
          method: 'DELETE'
        })

        if (response.ok) {
          toast({
            title: 'Account Deleted',
            description: 'Your account has been deleted successfully.',
          })
          // Redirect to home page
          window.location.href = '/'
        }
      } catch (error) {
        toast({
          title: 'Delete Failed',
          description: 'Failed to delete account. Please try again.',
          variant: 'destructive'
        })
      }
    }
  }

  const updateSetting = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
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
              <Settings className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Settings</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {hasChanges && (
              <Button onClick={saveSettings} disabled={loading}>
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container-custom py-6">
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="account" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI & Coaching</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="interface" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Interface</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your account details and personal information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={settings.fullName}
                      onChange={(e) => updateSetting('fullName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateSetting('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={settings.bio}
                      onChange={(e) => updateSetting('bio', e.target.value)}
                      placeholder="Tell us a bit about yourself..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Subscription
                  </CardTitle>
                  <CardDescription>
                    Manage your subscription and billing preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Plan</p>
                      <p className="text-sm text-muted-foreground">
                        {session?.user?.subscriptionTier || 'free'} plan
                      </p>
                    </div>
                    <Badge variant={session?.user?.subscriptionTier === 'premium' ? 'default' : 'secondary'}>
                      {session?.user?.subscriptionTier || 'free'}
                    </Badge>
                  </div>
                  
                  {session?.user?.subscriptionTier === 'free' && (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                      <h4 className="font-medium mb-2">Upgrade to Premium</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Get access to advanced AI video analysis, unlimited coaching sessions, and premium features.
                      </p>
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        Upgrade Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Privacy Controls
                  </CardTitle>
                  <CardDescription>
                    Control how your data is processed and stored.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Privacy Level</Label>
                    <Select value={settings.privacyLevel} onValueChange={(value) => updateSetting('privacyLevel', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High - Maximum privacy protection</SelectItem>
                        <SelectItem value="medium">Medium - Balanced privacy and features</SelectItem>
                        <SelectItem value="low">Low - Enhanced features with data sharing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Local Processing Only</Label>
                        <p className="text-sm text-muted-foreground">
                          Process all AI analysis locally on your device
                        </p>
                      </div>
                      <Switch
                        checked={settings.localProcessingOnly}
                        onCheckedChange={(checked) => updateSetting('localProcessingOnly', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Anonymous Analytics</Label>
                        <p className="text-sm text-muted-foreground">
                          Share anonymous usage data to improve the app
                        </p>
                      </div>
                      <Switch
                        checked={settings.allowAnalytics}
                        onCheckedChange={(checked) => updateSetting('allowAnalytics', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Data for AI Improvement</Label>
                        <p className="text-sm text-muted-foreground">
                          Share anonymized data to improve AI models
                        </p>
                      </div>
                      <Switch
                        checked={settings.shareDataForImprovement}
                        onCheckedChange={(checked) => updateSetting('shareDataForImprovement', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Enhance your account security with additional protection.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Biometric Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Use fingerprint or face recognition to unlock
                      </p>
                    </div>
                    <Switch
                      checked={settings.biometricAuth}
                      onCheckedChange={(checked) => updateSetting('biometricAuth', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => updateSetting('twoFactorAuth', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* AI & Coaching Settings */}
          <TabsContent value="ai" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    AI Coaching Preferences
                  </CardTitle>
                  <CardDescription>
                    Customize how the AI coach interacts with you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Coaching Style</Label>
                    <Select value={settings.coachingStyle} onValueChange={(value) => updateSetting('coachingStyle', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gentle">Gentle - Soft, encouraging approach</SelectItem>
                        <SelectItem value="direct">Direct - Straightforward guidance</SelectItem>
                        <SelectItem value="motivational">Motivational - Energetic and inspiring</SelectItem>
                        <SelectItem value="educational">Educational - Detailed explanations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Adaptation Level</Label>
                    <Select value={settings.adaptationLevel} onValueChange={(value) => updateSetting('adaptationLevel', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative - Slower adaptation</SelectItem>
                        <SelectItem value="moderate">Moderate - Balanced adaptation</SelectItem>
                        <SelectItem value="progressive">Progressive - Fast adaptation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>AI Confidence Threshold</Label>
                    <p className="text-sm text-muted-foreground">
                      Only show AI suggestions with at least {settings.aiConfidenceThreshold}% confidence
                    </p>
                    <Slider
                      value={[settings.aiConfidenceThreshold]}
                      onValueChange={([value]) => updateSetting('aiConfidenceThreshold', value)}
                      max={100}
                      min={50}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>50%</span>
                      <span>{settings.aiConfidenceThreshold}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Focus Areas
                  </CardTitle>
                  <CardDescription>
                    Select the areas you want to focus on for personalized coaching.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {focusAreaOptions.map((area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={area}
                          checked={settings.focusAreas.includes(area)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateSetting('focusAreas', [...settings.focusAreas, area])
                            } else {
                              updateSetting('focusAreas', settings.focusAreas.filter(f => f !== area))
                            }
                          }}
                          className="rounded"
                        />
                        <Label htmlFor={area} className="text-sm font-normal">
                          {area}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose which notifications you'd like to receive.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your device
                      </p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Session Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminders for scheduled coaching sessions
                      </p>
                    </div>
                    <Switch
                      checked={settings.sessionReminders}
                      onCheckedChange={(checked) => updateSetting('sessionReminders', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Progress Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your progress and achievements
                      </p>
                    </div>
                    <Switch
                      checked={settings.progressUpdates}
                      onCheckedChange={(checked) => updateSetting('progressUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Get weekly summary reports of your progress
                      </p>
                    </div>
                    <Switch
                      checked={settings.weeklyReports}
                      onCheckedChange={(checked) => updateSetting('weeklyReports', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Interface Settings */}
          <TabsContent value="interface" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of the application.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="flex space-x-2">
                      {[
                        { value: 'light', label: 'Light', icon: Monitor },
                        { value: 'dark', label: 'Dark', icon: Monitor },
                        { value: 'system', label: 'System', icon: Smartphone }
                      ].map((themeOption) => (
                        <Button
                          key={themeOption.value}
                          variant={theme === themeOption.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTheme(themeOption.value as any)}
                          className="flex items-center space-x-2"
                        >
                          <themeOption.icon className="h-4 w-4" />
                          <span>{themeOption.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Sound Effects</Label>
                        <p className="text-sm text-muted-foreground">
                          Play sound effects for interactions
                        </p>
                      </div>
                      <Switch
                        checked={settings.soundEffects}
                        onCheckedChange={(checked) => updateSetting('soundEffects', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Animations</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable smooth animations and transitions
                        </p>
                      </div>
                      <Switch
                        checked={settings.animations}
                        onCheckedChange={(checked) => updateSetting('animations', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Compact Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Use a more compact interface layout
                        </p>
                      </div>
                      <Switch
                        checked={settings.compactMode}
                        onCheckedChange={(checked) => updateSetting('compactMode', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Language & Region
                  </CardTitle>
                  <CardDescription>
                    Set your language and regional preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Input
                      value={settings.timezone}
                      onChange={(e) => updateSetting('timezone', e.target.value)}
                      placeholder="Your timezone"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Data Management
                  </CardTitle>
                  <CardDescription>
                    Manage your data backup, retention, and export settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Backup</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically backup your data to the cloud
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoBackup}
                      onCheckedChange={(checked) => updateSetting('autoBackup', checked)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Data Retention</Label>
                    <p className="text-sm text-muted-foreground">
                      Keep data for {settings.dataRetention} days
                    </p>
                    <Slider
                      value={[settings.dataRetention]}
                      onValueChange={([value]) => updateSetting('dataRetention', value)}
                      max={730}
                      min={30}
                      step={30}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>30 days</span>
                      <span>{settings.dataRetention} days</span>
                      <span>2 years</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <Select value={settings.exportFormat} onValueChange={(value) => updateSetting('exportFormat', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON - Machine readable format</SelectItem>
                        <SelectItem value="csv">CSV - Spreadsheet format</SelectItem>
                        <SelectItem value="pdf">PDF - Human readable format</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={exportData} variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Delete Account</h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={deleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
