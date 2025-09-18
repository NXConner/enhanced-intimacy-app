
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { tensorFlowManager, privacyManager, ModelUtils } from '@/lib/tensorflow-lite'

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
    const modelId = searchParams.get('modelId')

    switch (action) {
      case 'models':
        const availableModels = tensorFlowManager.getAvailableModels()
        const modelsInfo = await Promise.all(
          availableModels.map(id => tensorFlowManager.getModelInfo(id))
        )
        return NextResponse.json({ models: modelsInfo })

      case 'model-info':
        if (!modelId) {
          return NextResponse.json({ error: 'Model ID required' }, { status: 400 })
        }
        const info = await tensorFlowManager.getModelInfo(modelId)
        return NextResponse.json({ info })

      case 'system-stats':
        const stats = await tensorFlowManager.getSystemStats()
        return NextResponse.json({ stats })

      case 'privacy-budget':
        const budget = privacyManager.getPrivacyBudget()
        return NextResponse.json({ budget })

      case 'benchmark':
        if (!modelId) {
          return NextResponse.json({ error: 'Model ID required' }, { status: 400 })
        }
        const iterations = parseInt(searchParams.get('iterations') || '10')
        const benchmark = await ModelUtils.benchmarkModel(modelId, iterations)
        return NextResponse.json({ benchmark })

      case 'compliance':
        if (!modelId) {
          return NextResponse.json({ error: 'Model ID required' }, { status: 400 })
        }
        const compliance = ModelUtils.getModelCompliance(modelId)
        return NextResponse.json({ compliance })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('TensorFlow API error:', error)
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

    const { action, modelId, inputData, gradients, epsilon } = await req.json()

    switch (action) {
      case 'load-model':
        if (!modelId) {
          return NextResponse.json({ error: 'Model ID required' }, { status: 400 })
        }
        const loaded = await tensorFlowManager.loadModel(modelId)
        return NextResponse.json({ loaded, modelId })

      case 'run-inference':
        if (!modelId || !inputData) {
          return NextResponse.json({ error: 'Model ID and input data required' }, { status: 400 })
        }
        const result = await tensorFlowManager.runInference(modelId, inputData)
        return NextResponse.json({ result })

      case 'optimize-model':
        if (!modelId) {
          return NextResponse.json({ error: 'Model ID required' }, { status: 400 })
        }
        const optimization = await tensorFlowManager.optimizeModel(modelId)
        return NextResponse.json({ optimization })

      case 'unload-model':
        if (!modelId) {
          return NextResponse.json({ error: 'Model ID required' }, { status: 400 })
        }
        const unloaded = tensorFlowManager.unloadModel(modelId)
        return NextResponse.json({ unloaded, modelId })

      case 'apply-privacy':
        if (!gradients) {
          return NextResponse.json({ error: 'Gradients required' }, { status: 400 })
        }
        const privatized = await privacyManager.applyDifferentialPrivacy(gradients, epsilon)
        return NextResponse.json({ privatized })

      case 'secure-aggregation':
        if (!gradients || !Array.isArray(gradients)) {
          return NextResponse.json({ error: 'Gradients array required' }, { status: 400 })
        }
        const aggregated = await privacyManager.secureAggregation(gradients)
        return NextResponse.json({ aggregated })

      case 'encrypt-gradients':
        if (!gradients) {
          return NextResponse.json({ error: 'Gradients required' }, { status: 400 })
        }
        const encrypted = await privacyManager.encryptGradients(gradients)
        return NextResponse.json({ encrypted })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('TensorFlow API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
