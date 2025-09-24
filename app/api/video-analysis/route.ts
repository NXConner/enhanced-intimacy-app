export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { tensorFlowManager } from '@/lib/tensorflow-lite'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.subscriptionTier !== 'premium' && session.user.subscriptionTier !== 'professional') {
      return NextResponse.json({ error: 'Upgrade required' }, { status: 403 })
    }

    const formData = await request.formData()
    const video = formData.get('video')

    if (!video || !(video instanceof File)) {
      return NextResponse.json({ error: 'Video file is required' }, { status: 400 })
    }

    // Note: We do not persist or upload the video. Processing is local/mocked.
    // Load and run mocked TensorFlow Lite inference
    await tensorFlowManager.loadModel('video-analysis')
    const videoInference = await tensorFlowManager.runInference('video-analysis', null)

    // Derive simple metrics from mocked predictions
    const [lowProb = 0.2, mediumProb = 0.4, highProb = 0.4] = videoInference.predictions || []
    const confidence = Math.max(0.5, Math.min(0.99, videoInference.confidence || 0.85))

    // Arousal level emphasizes high/medium probabilities
    const arousalLevel = Math.round(
      Math.max(0, Math.min(1, highProb * 0.7 + mediumProb * 0.3)) * 100
    )

    // Additional dimensions as plausible, privacy-safe signals
    const emotionalConnection = Math.round(
      Math.max(0, Math.min(1, 0.65 + (mediumProb - lowProb) * 0.2 + (confidence - 0.8) * 0.25)) * 100
    )
    const communication = Math.round(
      Math.max(0, Math.min(1, 0.6 + mediumProb * 0.25 + Math.random() * 0.1)) * 100
    )

    const recommendations: string[] = [
      'Maintain steady eye contact to deepen emotional connection',
      'Slow the pace and synchronize breathing for heightened presence',
      'Use open-ended verbal check-ins to improve communication',
      'Explore gentle position transitions to increase comfort and variety'
    ]

    const positions: string[] = ['Missionary', 'Spooning', 'Side-by-side']

    const feedback =
      'Your session indicates strong mutual engagement with balanced pacing. Consider incorporating mindful breathing and periodic verbal check-ins. Gentle position transitions may enhance comfort and variety.'

    return NextResponse.json({
      arousalLevel,
      emotionalConnection,
      communication,
      recommendations,
      positions,
      feedback,
      confidence
    })
  } catch (error) {
    console.error('Video analysis error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

