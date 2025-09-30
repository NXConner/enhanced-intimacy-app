export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') || 'health'

  switch (action) {
    case 'models':
      return NextResponse.json({
        models: [
          { id: 'video-analysis', name: 'Video Analysis Model', version: 'v2.3.1', accuracy: 94.2, status: 'ready', lastTrained: '2024-09-15' },
          { id: 'arousal-scoring', name: 'Arousal Scoring Model', version: 'v1.8.4', accuracy: 91.7, status: 'training', lastTrained: '2024-09-14' },
          { id: 'position-recognition', name: 'Position Recognition', version: 'v3.1.0', accuracy: 89.5, status: 'ready', lastTrained: '2024-09-13' },
          { id: 'coaching-engine', name: 'Coaching Recommendation Engine', version: 'v2.7.2', accuracy: 96.1, status: 'updating', lastTrained: '2024-09-16' }
        ]
      })
    case 'pipelines':
      return NextResponse.json({
        pipelines: [
          { id: 'pl-1', name: 'Federated Round', status: 'active', nodes: 12 },
          { id: 'pl-2', name: 'Image Augmentation', status: 'idle', nodes: 0 },
          { id: 'pl-3', name: 'Model Quantization', status: 'queued', nodes: 0 }
        ]
      })
    case 'federated-nodes':
      return NextResponse.json({
        nodes: [
          { id: 'node-1', device: 'Pixel 8 Pro', status: 'online' },
          { id: 'node-2', device: 'iPhone 15', status: 'online' },
          { id: 'node-3', device: 'MacBook Pro', status: 'online' }
        ]
      })
    case 'health':
    default:
      return NextResponse.json({
        health: {
          averageAccuracy: 92.9,
          federatedNodes: { active: 12 },
          lastRound: '2025-09-01T10:00:00Z',
          status: 'operational'
        }
      })
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiTrainingManager } from '@/lib/ai-training'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Premium/Professional feature check
    if (session.user.subscriptionTier !== 'premium' && session.user.subscriptionTier !== 'professional') {
      return NextResponse.json({ error: 'Upgrade required' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'models':
        const models = await aiTrainingManager.getModels()
        return NextResponse.json({ models })

      case 'pipelines':
        const pipelines = await aiTrainingManager.getTrainingPipelines()
        return NextResponse.json({ pipelines })

      case 'federated-nodes':
        const nodes = await aiTrainingManager.getFederatedNodes()
        return NextResponse.json({ nodes })

      case 'health':
        const health = await aiTrainingManager.getSystemHealth()
        return NextResponse.json({ health })

      case 'metrics':
        const modelId = searchParams.get('modelId')
        if (!modelId) {
          return NextResponse.json({ error: 'Model ID required' }, { status: 400 })
        }
        const metrics = await aiTrainingManager.getModelMetrics(modelId)
        return NextResponse.json({ metrics })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Training API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Premium/Professional feature check
    if (session.user.subscriptionTier !== 'premium' && session.user.subscriptionTier !== 'professional') {
      return NextResponse.json({ error: 'Upgrade required' }, { status: 403 })
    }

    const { action, modelId, config, nodeId, update } = await req.json()

    switch (action) {
      case 'start-training':
        if (!modelId) {
          return NextResponse.json({ error: 'Model ID required' }, { status: 400 })
        }
        const pipeline = await aiTrainingManager.startTrainingPipeline(modelId, config)
        return NextResponse.json({ pipeline })

      case 'update-node':
        if (!nodeId) {
          return NextResponse.json({ error: 'Node ID required' }, { status: 400 })
        }
        await aiTrainingManager.updateFederatedNode(nodeId, update)
        return NextResponse.json({ success: true })

      case 'export-model':
        if (!modelId) {
          return NextResponse.json({ error: 'Model ID required' }, { status: 400 })
        }
        const exportData = await aiTrainingManager.exportModel(modelId)
        return NextResponse.json({ exportData })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Training API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
