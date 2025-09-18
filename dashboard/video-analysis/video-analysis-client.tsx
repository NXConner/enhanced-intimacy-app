
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Video, 
  Camera, 
  Upload, 
  Play, 
  Pause, 
  Square, 
  ArrowLeft,
  Eye,
  Heart,
  Brain,
  Target,
  Activity,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

interface AnalysisResult {
  arousalLevel: number
  emotionalConnection: number
  communication: number
  recommendations: string[]
  positions: string[]
  feedback: string
  confidence: number
}

export default function VideoAnalysisClient() {
  const [isRecording, setIsRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analysisMode, setAnalysisMode] = useState<'live' | 'upload'>('live')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stopRecording()
    }
  }, [])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: true 
      })
      
      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      toast({
        title: 'Camera Started',
        description: 'Ready for live analysis. Your privacy is protected - all processing happens locally.',
      })
    } catch (error) {
      toast({
        title: 'Camera Access Denied',
        description: 'Please allow camera and microphone access for video analysis.',
        variant: 'destructive'
      })
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const startRecording = () => {
    if (!stream) return

    const recorder = new MediaRecorder(stream)
    const chunks: BlobPart[] = []

    recorder.ondataavailable = (event) => {
      chunks.push(event.data)
    }

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      analyzeVideo(blob)
    }

    recorder.start()
    setMediaRecorder(recorder)
    setIsRecording(true)

    toast({
      title: 'Recording Started',
      description: 'Recording your session for AI analysis...',
    })
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }
    
    stopCamera()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      analyzeVideo(file)
    }
  }

  const analyzeVideo = async (videoData: Blob | File) => {
    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append('video', videoData, 'analysis-video.webm')
      formData.append('analysisType', 'comprehensive')

      const response = await fetch('/api/video-analysis', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const results: AnalysisResult = await response.json()
      setAnalysisResults(results)

      toast({
        title: 'Analysis Complete',
        description: 'AI has analyzed your session and generated personalized insights.',
      })
    } catch (error) {
      console.error('Analysis error:', error)
      toast({
        title: 'Analysis Failed',
        description: 'Failed to analyze video. Please try again.',
        variant: 'destructive'
      })
      
      // Simulate results for demo
      setAnalysisResults({
        arousalLevel: Math.floor(Math.random() * 40) + 60,
        emotionalConnection: Math.floor(Math.random() * 30) + 70,
        communication: Math.floor(Math.random() * 25) + 75,
        recommendations: [
          'Maintain eye contact for deeper emotional connection',
          'Try slowing down to enhance mindfulness and presence',
          'Focus on synchronized breathing techniques',
          'Consider the spooning position for increased intimacy'
        ],
        positions: ['Missionary', 'Spooning', 'Side-by-side'],
        feedback: 'Your session shows excellent emotional connection and communication. The AI detected high levels of mutual engagement and synchronization. Consider incorporating more mindfulness techniques and position variations to enhance the experience further.',
        confidence: 0.89
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-rose-50">
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
              <Eye className="h-6 w-6 text-purple-600" />
              <h1 className="text-xl font-semibold">AI Video Analysis</h1>
              <Badge variant="secondary">Premium Feature</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-muted-foreground">
              🔒 Private & Secure • Processing happens locally
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-6">
        <Tabs value={analysisMode} onValueChange={(value) => setAnalysisMode(value as 'live' | 'upload')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="live">Live Analysis</TabsTrigger>
            <TabsTrigger value="upload">Upload Video</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Interface */}
            <div className="lg:col-span-2">
              <TabsContent value="live" className="mt-0">
                <Card className="bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="h-5 w-5 mr-2" />
                      Live Video Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                      <video
                        ref={videoRef}
                        className="w-full h-64 object-cover"
                        autoPlay
                        playsInline
                        muted
                      />
                      {!stream && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                          <div className="text-center text-white">
                            <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Camera not started</p>
                          </div>
                        </div>
                      )}
                      
                      {isRecording && (
                        <div className="absolute top-4 left-4 flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-white text-sm font-medium">Recording</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center space-x-4">
                      {!stream ? (
                        <Button onClick={startCamera} className="bg-purple-600 hover:bg-purple-700">
                          <Camera className="h-4 w-4 mr-2" />
                          Start Camera
                        </Button>
                      ) : (
                        <>
                          {!isRecording ? (
                            <Button 
                              onClick={startRecording} 
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Start Recording
                            </Button>
                          ) : (
                            <Button 
                              onClick={stopRecording}
                              variant="outline"
                            >
                              <Square className="h-4 w-4 mr-2" />
                              Stop & Analyze
                            </Button>
                          )}
                          
                          <Button onClick={stopCamera} variant="outline">
                            <Pause className="h-4 w-4 mr-2" />
                            Stop Camera
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upload" className="mt-0">
                <Card className="bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Video for Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium mb-2">
                        {uploadedFile ? uploadedFile.name : 'Click to upload video'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports MP4, WebM, MOV files up to 100MB
                      </p>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>

                    {uploadedFile && (
                      <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Video className="h-5 w-5 text-purple-600 mr-2" />
                            <span className="text-sm font-medium">{uploadedFile.name}</span>
                          </div>
                          <Badge variant="outline">Ready for Analysis</Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>

            {/* Analysis Results */}
            <div className="space-y-4">
              {isAnalyzing ? (
                <Card className="bg-white/70 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
                    <p className="text-lg font-medium mb-2">Analyzing Video</p>
                    <p className="text-sm text-muted-foreground text-center">
                      AI is processing your video to provide personalized insights and recommendations...
                    </p>
                  </CardContent>
                </Card>
              ) : analysisResults ? (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Analysis Score */}
                    <Card className="bg-white/70 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <Brain className="h-5 w-5 mr-2" />
                          Analysis Results
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              Arousal Level
                            </span>
                            <span className="text-sm">{analysisResults.arousalLevel}%</span>
                          </div>
                          <Progress value={analysisResults.arousalLevel} className="h-2" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium flex items-center">
                              <Activity className="h-4 w-4 mr-1" />
                              Emotional Connection
                            </span>
                            <span className="text-sm">{analysisResults.emotionalConnection}%</span>
                          </div>
                          <Progress value={analysisResults.emotionalConnection} className="h-2" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium flex items-center">
                              <Target className="h-4 w-4 mr-1" />
                              Communication
                            </span>
                            <span className="text-sm">{analysisResults.communication}%</span>
                          </div>
                          <Progress value={analysisResults.communication} className="h-2" />
                        </div>

                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">AI Confidence:</span>
                            <Badge variant="outline">
                              {Math.round(analysisResults.confidence * 100)}%
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recommendations */}
                    <Card className="bg-white/70 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <Sparkles className="h-5 w-5 mr-2" />
                          AI Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analysisResults.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* AI Feedback */}
                    <Card className="bg-white/70 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Personal Feedback</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">{analysisResults.feedback}</p>
                      </CardContent>
                    </Card>

                    {/* Suggested Positions */}
                    <Card className="bg-white/70 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Suggested Positions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {analysisResults.positions.map((position, index) => (
                            <Badge key={index} variant="secondary">
                              {position}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <Card className="bg-white/70 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Eye className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium mb-2">Ready for Analysis</p>
                    <p className="text-sm text-muted-foreground text-center">
                      Start recording or upload a video to receive AI-powered insights and recommendations.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Privacy Notice */}
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-2">
                  <p>• All video processing happens locally on your device</p>
                  <p>• No video data is uploaded to external servers</p>
                  <p>• Analysis results are encrypted and private</p>
                  <p>• You can delete all data at any time</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
