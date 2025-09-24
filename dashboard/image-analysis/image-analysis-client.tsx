'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, Image as ImageIcon, Sparkles, Shield } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface ImageAnalysisResult {
  engagement: number
  affect: number
  poseConfidence: number
  dominantLabel: string
  confidence: number
  modelId: string
  explanations: Record<string, string>
}

export default function ImageAnalysisClient() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<ImageAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
    }
  }

  const analyze = async () => {
    if (!file) return
    setIsAnalyzing(true)
    try {
      const form = new FormData()
      form.append('image', file, file.name)
      form.append('modelId', 'image-analysis')

      const res = await fetch('/api/image-analysis', { method: 'POST', body: form })
      if (!res.ok) throw new Error('Analysis failed')
      const data: ImageAnalysisResult = await res.json()
      setResult(data)

      toast({ title: 'Analysis Complete', description: 'AI analyzed your image locally.' })
    } catch (e) {
      toast({ title: 'Failed', description: 'Could not analyze image.', variant: 'destructive' })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-rose-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container-custom flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <ImageIcon className="h-6 w-6 text-purple-600" />
            <h1 className="text-xl font-semibold">AI Image Analysis</h1>
            <Badge variant="secondary">Premium Feature</Badge>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Private & Secure • No image storage</span>
          </div>
        </div>
      </header>

      <div className="container-custom py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload Image for Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
                onClick={() => inputRef.current?.click()}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">
                  {file ? file.name : 'Click to upload an image'}
                </p>
                <p className="text-sm text-muted-foreground">Supports PNG, JPG</p>
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
              </div>
              <div className="mt-4 flex justify-end">
                <Button disabled={!file || isAnalyzing} onClick={analyze} className="bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              {!result ? (
                <p className="text-sm text-muted-foreground">Upload an image to view AI insights.</p>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Engagement</span>
                    <span>{result.engagement}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Affect</span>
                    <span>{result.affect}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pose Confidence</span>
                    <span>{result.poseConfidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Label</span>
                    <Badge variant="outline">{result.dominantLabel}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Confidence</span>
                    <Badge variant="outline">{Math.round(result.confidence * 100)}%</Badge>
                  </div>
                  <div className="pt-2 border-t space-y-1">
                    <div className="text-xs text-muted-foreground">Explanations</div>
                    <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                      <li>{result.explanations.engagement}</li>
                      <li>{result.explanations.affect}</li>
                      <li>{result.explanations.poseConfidence}</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>• Images are not stored or sent to third parties</p>
              <p>• Only numeric results are retained if needed</p>
              <p>• You can delete all data at any time</p>
              <Link className="text-purple-600 hover:underline" href="/privacy">Read privacy policy</Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

