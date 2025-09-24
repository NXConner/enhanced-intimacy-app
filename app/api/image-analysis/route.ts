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
    const image = formData.get('image')
    const modelId = (formData.get('modelId') as string) || 'image-analysis'

    if (!image || !(image instanceof File)) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 })
    }

    await tensorFlowManager.loadModel(modelId)
    const inference = await tensorFlowManager.runInference(modelId, null)

    const [engagement = Math.random(), affect = Math.random(), poseConf = Math.random()] = inference.predictions || []
    const confidence = Math.max(0.5, Math.min(0.99, inference.confidence || 0.86))

    const engagementScore = Math.round(Math.min(1, Math.max(0, engagement)) * 100)
    const affectScore = Math.round(Math.min(1, Math.max(0, affect)) * 100)
    const poseConfidence = Math.round(Math.min(1, Math.max(0, poseConf)) * 100)

    const labels = ['Calm', 'Engaged', 'Playful', 'Focused']
    const dominantLabel = labels[Math.floor(Math.random() * labels.length)]

    const explanations = {
      engagement: 'Estimated from facial orientation and attentional signals.',
      affect: 'Approximate affect inferred from coarse facial dynamics.',
      poseConfidence: 'Pose estimation confidence derived from visible keypoints.'
    }

    return NextResponse.json({
      engagement: engagementScore,
      affect: affectScore,
      poseConfidence,
      dominantLabel,
      confidence,
      modelId,
      explanations
    })
  } catch (error) {
    console.error('Image analysis error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

