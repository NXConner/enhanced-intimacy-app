
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, sessionId, sessionType = 'relationship_coaching' } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get user preferences for personalized coaching
    const userPrefs = await prisma.coachingPreferences.findUnique({
      where: { userId: session.user.id }
    })

    // Get user's progress data for context
    const recentProgress = await prisma.progressTracking.findMany({
      where: { userId: session.user.id },
      orderBy: { measurementDate: 'desc' },
      take: 5
    })

    // Create context-aware coaching prompt
    const coachingContext = getCoachingContext(sessionType, userPrefs, recentProgress)
    const personalizedPrompt = createPersonalizedPrompt(message, coachingContext, userPrefs)

    // Stream the AI response
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: coachingContext
          },
          {
            role: 'user',
            content: personalizedPrompt
          }
        ],
        stream: true,
        max_tokens: 3000,
        temperature: 0.7
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 })
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        const encoder = new TextEncoder()
        
        try {
          while (true) {
            const { done, value } = await reader?.read() || { done: true, value: undefined }
            if (done) break
            
            const chunk = decoder.decode(value)
            controller.enqueue(encoder.encode(chunk))
          }
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    // Log the interaction for feedback tracking
    if (sessionId) {
      await prisma.feedbackEvent.create({
        data: {
          coachingSessionId: sessionId,
          eventType: 'ai_response',
          message: message,
          aiConfidence: 0.85,
          timestamp: new Date()
        }
      }).catch(console.error) // Don't fail the request if logging fails
    }

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('AI coach error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getCoachingContext(sessionType: string, userPrefs: any, progressData: any[]): string {
  const baseContext = `You are an expert intimacy and relationship coach with years of experience helping couples enhance their connection. You provide professional, empathetic, and evidence-based guidance while maintaining appropriate boundaries.

Your coaching approach should be:
- Supportive and non-judgmental
- Based on established relationship therapy principles
- Focused on communication, emotional connection, and mutual respect
- Sensitive to privacy and personal boundaries
- Encouraging of healthy relationship dynamics

Always maintain a professional tone while being warm and understanding.`

  const sessionSpecificContext: Record<string, string> = {
    'relationship_coaching': 'Focus on communication skills, emotional intimacy, conflict resolution, and building stronger connections between partners.',
    'arousal_coaching': 'Provide guidance on mindfulness techniques, arousal awareness, communication about desires, and techniques for enhanced intimacy.',
    'position_guidance': 'Offer educational information about physical intimacy positions, comfort considerations, and communication between partners.',
    'video_analysis': 'Provide feedback on relationship dynamics, communication patterns, and suggestions for improvement based on behavioral observations.'
  }

  const userStyle = userPrefs?.preferredCoachingStyle || 'gentle'
  const styleContext: Record<string, string> = {
    'gentle': 'Use a soft, encouraging approach with plenty of reassurance.',
    'direct': 'Be straightforward and clear while remaining supportive.',
    'motivational': 'Use an energetic, encouraging tone that inspires action.',
    'educational': 'Focus on providing detailed explanations and educational content.'
  }

  let context = baseContext + '\n\n' + (sessionSpecificContext[sessionType] || sessionSpecificContext['relationship_coaching']) + '\n\n'
  context += `Coaching Style: ${styleContext[userStyle] || styleContext['gentle']}\n\n`

  if (userPrefs?.focusAreas) {
    context += `User's Focus Areas: ${userPrefs.focusAreas.join(', ')}\n\n`
  }

  if (progressData?.length > 0) {
    context += `Recent Progress Context: The user has been working on various aspects of their relationship. Acknowledge their journey and build upon their progress.\n\n`
  }

  return context
}

function createPersonalizedPrompt(userMessage: string, context: string, userPrefs: any): string {
  return `${userMessage}

Please provide helpful, professional guidance that addresses this question while considering the user's preferences and coaching context provided in the system message.`
}
