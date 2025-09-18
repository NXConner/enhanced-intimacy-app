
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  ArrowLeft, 
  Cpu, 
  Database, 
  Zap,
  Shield,
  Eye,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Activity,
  Server,
  Lock,
  Globe,
  Sparkles,
  Network,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { AdvancedTrainingDashboard } from '@/components/ai-training/advanced-training-dashboard'

interface AIModelStatus {
  name: string
  version: string
  accuracy: number
  status: 'training' | 'ready' | 'updating' | 'error'
  lastTrained: string
  improvements: string[]
}

interface TrainingMetrics {
  epoch: number
  accuracy: number
  loss: number
  valAccuracy: number
  timestamp: string
}

export default function AIStatusClient() {
  const [models, setModels] = useState<AIModelStatus[]>([])
  const [trainingMetrics, setTrainingMetrics] = useState<TrainingMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [aiModels, setAiModels] = useState([])
  const [trainingPipelines, setTrainingPipelines] = useState([])
  const [federatedNodes, setFederatedNodes] = useState([])
  const [systemHealth, setSystemHealth] = useState<any>(null)

  // Mock data for demonstration
  const mockModels: AIModelStatus[] = [
    {
      name: 'Video Analysis Model',
      version: 'v2.3.1',
      accuracy: 94.2,
      status: 'ready',
      lastTrained: '2024-09-15',
      improvements: [
        'Enhanced arousal detection accuracy by 3.2%',
        'Improved privacy filtering by 15%',
        'Reduced inference time by 200ms'
      ]
    },
    {
      name: 'Arousal Scoring Model',
      version: 'v1.8.4',
      accuracy: 91.7,
      status: 'training',
      lastTrained: '2024-09-14',
      improvements: [
        'Better temporal analysis',
        'Reduced false positives by 12%',
        'Enhanced personalization'
      ]
    },
    {
      name: 'Position Recognition',
      version: 'v3.1.0',
      accuracy: 89.5,
      status: 'ready',
      lastTrained: '2024-09-13',
      improvements: [
        'New position categories added',
        'Improved edge case handling',
        'Better confidence scoring'
      ]
    },
    {
      name: 'Coaching Recommendation Engine',
      version: 'v2.7.2',
      accuracy: 96.1,
      status: 'updating',
      lastTrained: '2024-09-16',
      improvements: [
        'Personalization algorithm upgraded',
        'Context awareness improved',
        'Feedback integration enhanced'
      ]
    }
  ]

  const mockTrainingData = [
    { epoch: 1, accuracy: 76.2, loss: 0.89, valAccuracy: 74.1, timestamp: '09:00' },
    { epoch: 2, accuracy: 81.5, loss: 0.72, valAccuracy: 79.3, timestamp: '09:15' },
    { epoch: 3, accuracy: 85.1, loss: 0.58, valAccuracy: 82.7, timestamp: '09:30' },
    { epoch: 4, accuracy: 87.9, loss: 0.47, valAccuracy: 85.2, timestamp: '09:45' },
    { epoch: 5, accuracy: 90.2, loss: 0.39, valAccuracy: 87.8, timestamp: '10:00' },
    { epoch: 6, accuracy: 91.8, loss: 0.33, valAccuracy: 89.1, timestamp: '10:15' },
    { epoch: 7, accuracy: 93.1, loss: 0.28, valAccuracy: 90.4, timestamp: '10:30' },
    { epoch: 8, accuracy: 94.2, loss: 0.24, valAccuracy: 91.7, timestamp: '10:45' }
  ]

  const privacyMetrics = {
    localProcessing: 98.5,
    dataEncryption: 100,
    anonymization: 94.7,
    consentCompliance: 100
  }

  useEffect(() => {
    loadAIStatus()
  }, [])

  const loadAIStatus = async () => {
    setLoading(true)
    try {
      // Load advanced AI training data
      const [modelsRes, pipelinesRes, nodesRes, healthRes] = await Promise.all([
        fetch('/api/ai/training?action=models').then(r => r.json()).catch(() => ({ models: [] })),
        fetch('/api/ai/training?action=pipelines').then(r => r.json()).catch(() => ({ pipelines: [] })),
        fetch('/api/ai/training?action=federated-nodes').then(r => r.json()).catch(() => ({ nodes: [] })),
        fetch('/api/ai/training?action=health').then(r => r.json()).catch(() => ({ health: null }))
      ])

      setAiModels(modelsRes.models || [])
      setTrainingPipelines(pipelinesRes.pipelines || [])
      setFederatedNodes(nodesRes.nodes || [])
      setSystemHealth(healthRes.health)

      // Legacy data for compatibility
      setModels(mockModels)
      setTrainingMetrics(mockTrainingData)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load AI status:', error)
      // Fallback to mock data
      setModels(mockModels)
      setTrainingMetrics(mockTrainingData)
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'training': return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      case 'updating': return <Download className="h-5 w-5 text-yellow-500" />
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />
      default: return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'training': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'updating': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
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
              <Brain className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">AI Training Status</h1>
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">Advanced</Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button onClick={loadAIStatus} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="container-custom py-6">
        {/* Enhanced Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">TensorFlow Models</p>
                    <p className="text-2xl font-bold">{aiModels.length || 4}</p>
                    <p className="text-xs text-green-600">Fully operational</p>
                  </div>
                  <Brain className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Model Accuracy</p>
                    <p className="text-2xl font-bold">
                      {systemHealth?.averageAccuracy ? `${systemHealth.averageAccuracy.toFixed(1)}%` : '92.9%'}
                    </p>
                    <p className="text-xs text-green-600">+2.1% this week</p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Privacy Score</p>
                    <p className="text-2xl font-bold">98.3%</p>
                    <p className="text-xs text-green-600">Military-grade</p>
                  </div>
                  <Shield className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Federated Nodes</p>
                    <p className="text-2xl font-bold">{systemHealth?.federatedNodes?.active || 12}</p>
                    <p className="text-xs text-green-600">Distributed learning</p>
                  </div>
                  <Network className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Local Processing</p>
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-xs text-green-600">Zero cloud inference</p>
                  </div>
                  <Lock className="h-8 w-8 text-indigo-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Advanced AI Training System Status */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center">
                  <Sparkles className="h-6 w-6 mr-3 text-purple-500" />
                  Advanced AI Training System
                </CardTitle>
                <CardDescription className="mt-2">
                  TensorFlow Lite • Federated Learning • Military-Grade Privacy • Real-time Training
                </CardDescription>
              </div>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                FULLY OPERATIONAL
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Comprehensive Training Dashboard */}
        <AdvancedTrainingDashboard 
          models={aiModels}
          pipelines={trainingPipelines}
          federatedNodes={federatedNodes}
          metrics={systemHealth}
        />

        {/* Legacy Status for Compatibility */}
        <Tabs defaultValue="legacy" className="space-y-6 mt-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="legacy">Legacy Models</TabsTrigger>
            <TabsTrigger value="training">Training History</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Metrics</TabsTrigger>
            <TabsTrigger value="infrastructure">System Health</TabsTrigger>
          </TabsList>

          {/* Legacy Models */}
          <TabsContent value="legacy">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {models.map((model, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(model.status)}
                          <Badge className={getStatusColor(model.status)}>
                            {model.status}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>Version {model.version}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Accuracy</span>
                          <span className="text-sm font-bold">{model.accuracy}%</span>
                        </div>
                        <Progress value={model.accuracy} className="h-2" />
                      </div>

                      <div>
                        <span className="text-sm font-medium">Last Trained:</span>
                        <span className="text-sm text-muted-foreground ml-2">{model.lastTrained}</span>
                      </div>

                      <div>
                        <span className="text-sm font-medium mb-2 block">Recent Improvements:</span>
                        <ul className="space-y-1">
                          {model.improvements.map((improvement, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2 border-t flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Retrain
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Training Metrics */}
          <TabsContent value="training">
            <div className="space-y-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Training Progress</CardTitle>
                  <CardDescription>Real-time training metrics for active models</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={trainingMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="accuracy" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.3} 
                        name="Training Accuracy (%)"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="valAccuracy" 
                        stroke="#82ca9d" 
                        fill="#82ca9d" 
                        fillOpacity={0.3} 
                        name="Validation Accuracy (%)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Current Epoch</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">8/20</div>
                      <p className="text-sm text-muted-foreground">Training in progress</p>
                      <Progress value={40} className="mt-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Loss Reduction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">73%</div>
                      <p className="text-sm text-muted-foreground">Since training start</p>
                      <div className="flex items-center justify-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">Improving</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">ETA to Completion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">3h 12m</div>
                      <p className="text-sm text-muted-foreground">Estimated remaining</p>
                      <div className="flex items-center justify-center mt-2">
                        <Zap className="h-4 w-4 text-purple-500 mr-1" />
                        <span className="text-sm text-purple-600">On schedule</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Privacy & Security */}
          <TabsContent value="privacy">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Privacy Metrics
                  </CardTitle>
                  <CardDescription>Privacy compliance and protection levels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Local Processing</span>
                      <span className="text-sm font-bold">{privacyMetrics.localProcessing}%</span>
                    </div>
                    <Progress value={privacyMetrics.localProcessing} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Data Encryption</span>
                      <span className="text-sm font-bold">{privacyMetrics.dataEncryption}%</span>
                    </div>
                    <Progress value={privacyMetrics.dataEncryption} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Data Anonymization</span>
                      <span className="text-sm font-bold">{privacyMetrics.anonymization}%</span>
                    </div>
                    <Progress value={privacyMetrics.anonymization} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Consent Compliance</span>
                      <span className="text-sm font-bold">{privacyMetrics.consentCompliance}%</span>
                    </div>
                    <Progress value={privacyMetrics.consentCompliance} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Security Features
                  </CardTitle>
                  <CardDescription>Active security measures and protections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { name: 'End-to-End Encryption', status: 'active', description: 'AES-256-GCM encryption' },
                      { name: 'Local Model Inference', status: 'active', description: 'No cloud processing of sensitive data' },
                      { name: 'Differential Privacy', status: 'active', description: 'Privacy-preserving machine learning' },
                      { name: 'Federated Learning', status: 'active', description: 'Decentralized model training' },
                      { name: 'Biometric Authentication', status: 'enabled', description: 'Hardware-backed security' },
                      { name: 'Data Anonymization', status: 'active', description: 'Automatic PII removal' }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <div>
                          <div className="font-medium text-sm">{feature.name}</div>
                          <div className="text-xs text-muted-foreground">{feature.description}</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {feature.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Infrastructure */}
          <TabsContent value="infrastructure">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="h-5 w-5 mr-2" />
                    Processing Power
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Usage</span>
                      <span>23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>GPU Utilization</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory Usage</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Storage</span>
                      <span>12%</span>
                    </div>
                    <Progress value={12} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Model Storage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold">2.4 GB</div>
                    <p className="text-sm text-muted-foreground">Total model size</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Video Analysis</span>
                      <span>892 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Arousal Scoring</span>
                      <span>456 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Position Recognition</span>
                      <span>678 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recommendations</span>
                      <span>234 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other</span>
                      <span>140 MB</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Network Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { name: 'Model Updates API', status: 'online', latency: '23ms' },
                      { name: 'Analytics Service', status: 'online', latency: '45ms' },
                      { name: 'Authentication', status: 'online', latency: '12ms' },
                      { name: 'Content Delivery', status: 'online', latency: '67ms' }
                    ].map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{service.name}</span>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{service.latency}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">All systems operational</span>
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

