
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Cpu, 
  Database, 
  Network, 
  Shield, 
  Zap, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Play,
  Pause,
  Download,
  Eye,
  Activity,
  Users,
  Lock,
  Sparkles,
  BarChart3,
  Settings
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts'

interface AdvancedTrainingDashboardProps {
  models: any[]
  pipelines: any[]
  federatedNodes: any[]
  metrics: any
}

export function AdvancedTrainingDashboard({ models, pipelines, federatedNodes, metrics }: AdvancedTrainingDashboardProps) {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [trainingHistory, setTrainingHistory] = useState<any[]>([])

  const systemHealth = {
    overall: 98.7,
    models: 96.3,
    infrastructure: 100,
    privacy: 99.2,
    federated: 97.8
  }

  const performanceMetrics = [
    { name: 'Video Analysis', accuracy: 96.3, speed: 45, privacy: 100 },
    { name: 'Arousal Detection', accuracy: 94.1, speed: 28, privacy: 99.5 },
    { name: 'Position Recognition', accuracy: 92.7, speed: 67, privacy: 98.8 },
    { name: 'Coaching Engine', accuracy: 97.8, speed: 23, privacy: 100 }
  ]

  const federatedStats = {
    totalNodes: 15,
    activeNodes: 12,
    trainingNodes: 3,
    contributedSamples: 47892,
    privacyScore: 99.2
  }

  const realtimeTrainingData = [
    { time: '10:00', accuracy: 85.2, loss: 0.45, privacy: 99.1 },
    { time: '10:15', accuracy: 87.8, loss: 0.41, privacy: 99.3 },
    { time: '10:30', accuracy: 89.1, loss: 0.38, privacy: 99.2 },
    { time: '10:45', accuracy: 91.3, loss: 0.34, privacy: 99.4 },
    { time: '11:00', accuracy: 92.8, loss: 0.31, privacy: 99.5 },
    { time: '11:15', accuracy: 94.1, loss: 0.28, privacy: 99.3 }
  ]

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1']

  useEffect(() => {
    if (selectedModel) {
      // Load training history for selected model
      setTrainingHistory(realtimeTrainingData)
    }
  }, [selectedModel])

  const handleStartTraining = (modelId: string) => {
    console.log('Starting training for model:', modelId)
    // API call to start training
  }

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(systemHealth).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground capitalize">{key}</p>
                    <p className="text-2xl font-bold">{value}%</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <Progress value={value} className="h-1 mt-2" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="realtime" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="realtime">Real-time Training</TabsTrigger>
          <TabsTrigger value="models">Advanced Models</TabsTrigger>
          <TabsTrigger value="federated">Federated Learning</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Real-time Training */}
        <TabsContent value="realtime">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Live Training Metrics
                </CardTitle>
                <CardDescription>Real-time model training performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={realtimeTrainingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="accuracy" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} name="Accuracy (%)" />
                    <Area type="monotone" dataKey="privacy" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} name="Privacy Score (%)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Training Loss Reduction
                </CardTitle>
                <CardDescription>Loss minimization over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={realtimeTrainingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="loss" stroke="#ff7c7c" strokeWidth={3} name="Training Loss" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Current Epoch</p>
                    <p className="text-3xl font-bold text-green-600">47/100</p>
                    <p className="text-sm text-muted-foreground">ETA: 2h 15m</p>
                  </div>
                  <Play className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Gradient Updates</p>
                    <p className="text-3xl font-bold text-blue-600">1,247</p>
                    <p className="text-sm text-muted-foreground">Per second</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Privacy Budget</p>
                    <p className="text-3xl font-bold text-purple-600">0.3/1.0</p>
                    <p className="text-sm text-muted-foreground">ε-differential privacy</p>
                  </div>
                  <Shield className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Advanced Models */}
        <TabsContent value="models">
          <div className="space-y-6">
            {performanceMetrics.map((model, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Brain className="h-5 w-5 mr-2" />
                          {model.name}
                        </CardTitle>
                        <CardDescription>TensorFlow Lite optimized model</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Production Ready
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Accuracy</span>
                          <span className="text-sm font-bold">{model.accuracy}%</span>
                        </div>
                        <Progress value={model.accuracy} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Inference Speed</span>
                          <span className="text-sm font-bold">{model.speed}ms</span>
                        </div>
                        <Progress value={100 - model.speed} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Privacy Score</span>
                          <span className="text-sm font-bold">{model.privacy}%</span>
                        </div>
                        <Progress value={model.privacy} className="h-2" />
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button 
                        size="sm" 
                        onClick={() => handleStartTraining(model.name)}
                        className="flex items-center"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Retrain
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Federated Learning */}
        <TabsContent value="federated">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Network className="h-5 w-5 mr-2" />
                  Federated Network Status
                </CardTitle>
                <CardDescription>Distributed learning network health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Users className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                      <div className="text-2xl font-bold">{federatedStats.totalNodes}</div>
                      <div className="text-sm text-muted-foreground">Total Nodes</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
                      <div className="text-2xl font-bold">{federatedStats.activeNodes}</div>
                      <div className="text-sm text-muted-foreground">Active Nodes</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Privacy Score</span>
                      <span className="text-lg font-bold text-purple-600">{federatedStats.privacyScore}%</span>
                    </div>
                    <Progress value={federatedStats.privacyScore} className="mt-2 h-2" />
                    <p className="text-sm text-muted-foreground mt-1">Differential privacy enabled across all nodes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Training Contributions
                </CardTitle>
                <CardDescription>Data contributions from federated nodes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Windows Nodes', value: 45, color: '#8884d8' },
                        { name: 'Android Nodes', value: 35, color: '#82ca9d' },
                        { name: 'Web Nodes', value: 20, color: '#ffc658' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[1, 2, 3].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                  <div className="text-2xl font-bold text-blue-600">{federatedStats.contributedSamples.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total samples contributed</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Privacy & Security */}
        <TabsContent value="privacy">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Privacy Protection Layers
                </CardTitle>
                <CardDescription>Multi-layered privacy preservation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Differential Privacy', status: 'Active', level: 99.5, description: 'ε=0.1, δ=1e-5' },
                  { name: 'Homomorphic Encryption', status: 'Active', level: 100, description: 'FHE enabled' },
                  { name: 'Secure Aggregation', status: 'Active', level: 98.7, description: 'Multi-party computation' },
                  { name: 'Local Data Processing', status: 'Active', level: 100, description: 'No cloud inference' },
                  { name: 'Gradient Clipping', status: 'Active', level: 97.2, description: 'Norm bound = 1.0' }
                ].map((layer, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Lock className="h-4 w-4 text-green-500 mr-2" />
                        <span className="font-medium">{layer.name}</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        {layer.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <Progress value={layer.level} className="flex-1 mr-4" />
                      <span className="text-sm font-bold">{layer.level}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{layer.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Audit Trail & Compliance
                </CardTitle>
                <CardDescription>Real-time compliance monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { check: 'GDPR Compliance', status: 'Verified', time: '2 min ago' },
                    { check: 'CCPA Compliance', status: 'Verified', time: '5 min ago' },
                    { check: 'HIPAA Compliance', status: 'Verified', time: '8 min ago' },
                    { check: 'Data Minimization', status: 'Active', time: 'Continuous' },
                    { check: 'Consent Management', status: 'Active', time: 'Real-time' },
                    { check: 'Right to Deletion', status: 'Available', time: 'On-demand' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm font-medium">{item.check}</span>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{item.status}</Badge>
                        <div className="text-xs text-muted-foreground mt-1">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="h-5 w-5 mr-2" />
                  Inference Performance
                </CardTitle>
                <CardDescription>Real-time model performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={realtimeTrainingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="accuracy" stroke="#8884d8" strokeWidth={2} name="Accuracy (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Resource Utilization
                </CardTitle>
                <CardDescription>System resource consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { resource: 'CPU Usage', value: 23, unit: '%', color: 'bg-blue-500' },
                    { resource: 'GPU Utilization', value: 67, unit: '%', color: 'bg-green-500' },
                    { resource: 'Memory Usage', value: 45, unit: '%', color: 'bg-yellow-500' },
                    { resource: 'Storage I/O', value: 12, unit: '%', color: 'bg-purple-500' },
                    { resource: 'Network Bandwidth', value: 34, unit: '%', color: 'bg-pink-500' }
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{item.resource}</span>
                        <span className="text-sm font-bold">{item.value}{item.unit}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className={`h-2 rounded-full ${item.color}`} 
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
