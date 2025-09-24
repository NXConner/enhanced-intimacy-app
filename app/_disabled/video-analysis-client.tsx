"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
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
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

interface AnalysisResult {
  arousalLevel: number
  emotionalConnection: number
  communication: number
  recommendations: string[]
  positions: string[]
  feedback: string
  confidence: number
  modelId?: string
  timeSeries?: { t: number; arousal: number; connection: number; communication: number }[]
  explanations?: Record<string, string>
}

export default function VideoAnalysisClient() {
  const [isRecording, setIsRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analysisMode, setAnalysisMode] = useState<'live' | 'upload'>('live')
  const [availableModels, setAvailableModels] = useState<string[]>(['video-analysis'])
  const [selectedModel, setSelectedModel] = useState<string>('video-analysis')
  const [thumbnails, setThumbnails] = useState<string[]>([])
  const [liveSeries, setLiveSeries] = useState<{ t: number; arousal: number; connection: number; communication: number }[]>([])
  const workerRef = useRef<Worker | null>(null)
  const frameTimerRef = useRef<number | null>(null)
  const [showArousal, setShowArousal] = useState(true)
  const [showConnection, setShowConnection] = useState(true)
  const [showCommunication, setShowCommunication] = useState(true)
  const [smoothing, setSmoothing] = useState(false)
  const [localOnly, setLocalOnly] = useState(false)
  const [modelInfo, setModelInfo] = useState<any | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleAnalysisModeChange = (value: string) => {
    setAnalysisMode(value === 'upload' ? 'upload' : 'live')
  }

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && !workerRef.current) {
        const worker = new Worker(new URL('../../workers/video-analysis.worker.ts', import.meta.url))
        worker.onmessage = (e: MessageEvent) => {
          if (e.data?.type === 'metrics' && e.data?.payload) {
            const m = e.data.payload as { t: number; arousal: number; connection: number; communication: number }
            setLiveSeries(prev => [...prev, m].slice(-120))
          }
        }
        workerRef.current = worker
      }
    } catch {}
    ;(async () => {
      try {
        const res = await fetch('/api/ai/tensorflow?action=models')
        const data = await res.json()
        const ids: string[] = Array.isArray(data?.models)
          ? data.models.map((m: any) => m.modelId).filter((id: string) => ['video-analysis','arousal-detection','position-recognition'].includes(id))
          : ['video-analysis']
        if (ids.length > 0) {
          setAvailableModels(ids)
          if (!ids.includes('video-analysis')) setSelectedModel(ids[0])
        }
      } catch {}
    })()
    return () => {
      stopRecording()
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/api/ai/tensorflow?action=model-info&modelId=${encodeURIComponent(selectedModel)}`)
        const data = await res.json()
        setModelInfo(data?.info || null)
      } catch {
        setModelInfo(null)
      }
    })()
  }, [selectedModel])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: true 
      })
      setStream(mediaStream)
      if (videoRef.current) {
        // @ts-ignore
        videoRef.current.srcObject = mediaStream
      }
      toast({ title: 'Camera Started', description: 'Ready for live analysis.' })
    } catch {}
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    if (videoRef.current) {
      // @ts-ignore
      videoRef.current.srcObject = null
    }
  }

  const startRecording = () => {
    if (!stream) return
    const recorder = new MediaRecorder(stream)
    const chunks: BlobPart[] = []
    recorder.ondataavailable = (event) => { chunks.push(event.data) }
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      analyzeVideo(blob)
    }
    recorder.start()
    setMediaRecorder(recorder)
    setIsRecording(true)
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }
    stopCamera()
    if (frameTimerRef.current) {
      window.clearInterval(frameTimerRef.current)
      frameTimerRef.current = null
    }
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
      formData.append('modelId', selectedModel)
      await fetch('/api/video-analysis', { method: 'POST', body: formData })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="p-4">
      <div className="container-custom py-6">
        <Tabs value={analysisMode} onValueChange={handleAnalysisModeChange}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="live">Live Analysis</TabsTrigger>
            <TabsTrigger value="upload">Upload Video</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="mt-0">
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader><CardTitle>Upload Video</CardTitle></CardHeader>
              <CardContent>
                <input type="file" accept="video/*" onChange={handleFileUpload} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}