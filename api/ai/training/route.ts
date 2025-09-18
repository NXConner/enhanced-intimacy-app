
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
