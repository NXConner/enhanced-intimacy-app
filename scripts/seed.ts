
import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Create test user
  const hashedPassword = await bcryptjs.hash('johndoe123', 12)
  
  const testUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: hashedPassword,
      fullName: 'John Doe',
      name: 'John',
      subscriptionTier: 'premium',
      isActive: true
    }
  })

  // Create coaching preferences for test user
  await prisma.coachingPreferences.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      preferredCoachingStyle: 'gentle',
      focusAreas: ['communication', 'intimacy', 'emotional_connection'],
      privacyLevel: 'high',
      adaptationLevel: 'moderate',
      notificationSettings: {
        reminders: true,
        progress: true,
        newContent: true
      },
      goalSettings: {
        primaryGoals: ['improve_communication', 'enhance_intimacy', 'build_trust'],
        weeklySessionTarget: 3,
        monthlyGoals: ['complete_educational_modules', 'track_progress_daily']
      }
    }
  })

  // Create position recommendations
  const positions = [
    {
      name: 'The Connection Position',
      category: 'beginner',
      description: 'A gentle, intimate position focused on emotional connection and eye contact.',
      instructions: 'This position emphasizes face-to-face intimacy, allowing partners to maintain eye contact and communicate throughout. Focus on slow, gentle movements and synchronized breathing. Perfect for couples wanting to enhance emotional intimacy.',
      benefitsFor: ['intimacy', 'communication', 'emotional_connection'],
      difficultyLevel: 'beginner',
      avgRating: 4.5,
      totalRatings: 127,
      tags: ['romantic', 'intimate', 'beginner-friendly', 'eye-contact', 'communication'],
      isVerified: true,
      isPremium: false
    },
    {
      name: 'The Comfort Embrace',
      category: 'beginner',
      description: 'A comfortable, supportive position ideal for longer intimate sessions.',
      instructions: 'This position provides maximum comfort and support for both partners. Use pillows for additional support and focus on maintaining comfortable positioning. Great for partners with mobility considerations or those preferring longer, more relaxed sessions.',
      benefitsFor: ['comfort', 'stamina', 'accessibility'],
      difficultyLevel: 'beginner',
      avgRating: 4.3,
      totalRatings: 89,
      tags: ['comfortable', 'supportive', 'accessibility', 'relaxed'],
      isVerified: true,
      isPremium: false
    },
    {
      name: 'The Mindful Union',
      category: 'intermediate',
      description: 'An advanced position focusing on mindfulness and arousal control.',
      instructions: 'This position requires partners to focus on breathing techniques and mindful awareness. Take time to pause and reconnect, using the position to practice arousal control and heightened awareness. Ideal for couples working on mindfulness techniques.',
      benefitsFor: ['arousal_control', 'mindfulness', 'intimacy'],
      difficultyLevel: 'intermediate',
      avgRating: 4.7,
      totalRatings: 156,
      tags: ['mindfulness', 'arousal-control', 'advanced', 'breathing'],
      isVerified: true,
      isPremium: true
    },
    {
      name: 'The Therapeutic Touch',
      category: 'therapeutic',
      description: 'A gentle, therapeutic position designed for healing and reconnection.',
      instructions: 'This position is designed for couples working through intimacy challenges or recovering from difficulties. Focus on gentle touch, emotional safety, and rebuilding trust. Take breaks as needed and maintain open communication throughout.',
      benefitsFor: ['healing', 'trust', 'emotional_connection', 'communication'],
      difficultyLevel: 'beginner',
      avgRating: 4.8,
      totalRatings: 203,
      tags: ['therapeutic', 'healing', 'trust-building', 'gentle'],
      isVerified: true,
      isPremium: false
    },
    {
      name: 'The Advanced Harmony',
      category: 'advanced',
      description: 'A challenging position for experienced couples seeking new experiences.',
      instructions: 'This advanced position requires good communication, flexibility, and trust between partners. Start slowly and maintain constant communication. Not recommended for beginners - ensure both partners are comfortable with advanced techniques before attempting.',
      benefitsFor: ['variety', 'challenge', 'advanced_techniques'],
      difficultyLevel: 'advanced',
      avgRating: 4.2,
      totalRatings: 67,
      tags: ['advanced', 'challenging', 'experienced', 'variety'],
      isVerified: true,
      isPremium: true
    }
  ]

  // Clear existing position recommendations first
  await prisma.positionRecommendation.deleteMany({})
  
  for (const position of positions) {
    await prisma.positionRecommendation.create({
      data: position
    })
  }

  // Create educational content
  const educationalContent = [
    {
      title: 'Communication Fundamentals for Intimate Relationships',
      contentType: 'article',
      category: 'communication',
      difficultyLevel: 'beginner',
      content: `# Communication Fundamentals for Intimate Relationships

Effective communication is the cornerstone of any healthy intimate relationship. This comprehensive guide will help you and your partner develop stronger communication skills that enhance your emotional and physical connection.

## Key Communication Principles

1. **Active Listening**: Give your partner your full attention when they speak
2. **Non-Judgmental Responses**: Create a safe space for open dialogue
3. **Emotional Validation**: Acknowledge and respect your partner's feelings
4. **Clear Expression**: Share your thoughts and desires openly and honestly

## Practical Exercises

### Exercise 1: Daily Check-ins
Set aside 10 minutes each day to share your feelings, concerns, and appreciation for each other.

### Exercise 2: Desire Mapping
Create a safe space to discuss your individual desires and boundaries.

### Exercise 3: Conflict Resolution
Learn techniques for addressing disagreements constructively.

## Building Trust Through Communication

Trust is built through consistent, honest communication. Practice these techniques regularly to strengthen your relationship foundation.`,
      estimatedMinutes: 15,
      isPremium: false,
      tags: ['communication', 'trust', 'relationships', 'beginner'],
      avgRating: 4.6,
      totalViews: 1247
    },
    {
      title: 'Mindfulness and Arousal Awareness',
      contentType: 'interactive',
      category: 'techniques',
      difficultyLevel: 'intermediate',
      content: `# Mindfulness and Arousal Awareness

Developing mindfulness in intimate moments can significantly enhance your experience and help you maintain better arousal control. This interactive guide provides practical techniques for cultivating awareness.

## Understanding Arousal Awareness

Arousal awareness involves paying attention to your physical and emotional responses during intimate moments. This awareness helps you:

- Better communicate with your partner
- Maintain desired arousal levels
- Enhance overall intimate experiences
- Develop greater self-control

## Mindfulness Techniques

### Breathing Exercises
Practice synchronized breathing with your partner to enhance connection and awareness.

### Body Scanning
Learn to notice physical sensations and arousal levels throughout your body.

### Present Moment Awareness
Techniques for staying present and connected during intimate moments.

## Progressive Exercises

Start with basic awareness exercises and gradually progress to more advanced techniques as you become comfortable with mindful intimacy.`,
      estimatedMinutes: 25,
      isPremium: true,
      tags: ['mindfulness', 'arousal', 'awareness', 'techniques', 'intermediate'],
      avgRating: 4.8,
      totalViews: 892
    },
    {
      title: 'Building Emotional Intimacy',
      contentType: 'video',
      category: 'psychology',
      difficultyLevel: 'beginner',
      content: `# Building Emotional Intimacy

Emotional intimacy forms the foundation of physical intimacy. This guide helps couples develop deeper emotional connections that enhance their overall relationship satisfaction.

## What is Emotional Intimacy?

Emotional intimacy involves:
- Sharing vulnerabilities safely
- Understanding each other's emotional needs
- Creating emotional safety and trust
- Supporting each other through challenges

## Stages of Emotional Intimacy

### Stage 1: Safety and Trust
Building the foundation for emotional vulnerability.

### Stage 2: Self-Disclosure
Learning to share personal thoughts and feelings.

### Stage 3: Empathy and Understanding
Developing the ability to truly understand your partner's perspective.

### Stage 4: Deep Connection
Achieving a profound emotional bond that enhances physical intimacy.

## Practical Activities

- Daily gratitude sharing
- Vulnerability exercises
- Emotional check-ins
- Couples meditation

Remember: Emotional intimacy takes time to develop. Be patient with yourself and your partner as you grow together.`,
      videoUrl: '/videos/emotional-intimacy-guide.mp4',
      estimatedMinutes: 30,
      isPremium: false,
      tags: ['emotional', 'intimacy', 'psychology', 'trust', 'connection'],
      avgRating: 4.7,
      totalViews: 1456
    },
    {
      title: 'Advanced Intimacy Techniques',
      contentType: 'article',
      category: 'techniques',
      difficultyLevel: 'advanced',
      content: `# Advanced Intimacy Techniques

For couples ready to explore more advanced aspects of their intimate connection, this guide provides sophisticated techniques for enhancing physical and emotional intimacy.

## Prerequisites

Before exploring advanced techniques, ensure you have:
- Strong communication skills
- High level of trust and safety
- Comfort with basic intimacy practices
- Mutual enthusiasm for exploration

## Advanced Communication

### Non-Verbal Communication
Understanding and using body language, touch, and energy to communicate desires and boundaries.

### Real-Time Feedback
Techniques for giving and receiving feedback during intimate moments.

## Physical Techniques

### Sensory Exploration
Using different senses to enhance intimate experiences.

### Timing and Rhythm
Advanced concepts for synchronization and variety.

### Energy and Presence
Cultivating and sharing intimate energy between partners.

## Integration Practices

Learn how to integrate these advanced techniques into your regular intimate practice while maintaining emotional safety and connection.`,
      estimatedMinutes: 35,
      isPremium: true,
      tags: ['advanced', 'techniques', 'intimacy', 'communication', 'energy'],
      avgRating: 4.5,
      totalViews: 534
    }
  ]

  // Clear existing educational content first
  await prisma.educationalContent.deleteMany({})
  
  for (const content of educationalContent) {
    await prisma.educationalContent.create({
      data: content
    })
  }

  // Create some progress tracking data for the test user
  const progressEntries = [
    { metricType: 'overall_satisfaction', value: 7.2 },
    { metricType: 'communication_quality', value: 6.8 },
    { metricType: 'emotional_intimacy', value: 7.5 },
    { metricType: 'arousal_control', value: 6.2 },
    { metricType: 'relationship_satisfaction', value: 8.1 }
  ]

  for (const entry of progressEntries) {
    await prisma.progressTracking.create({
      data: {
        userId: testUser.id,
        ...entry,
        targetValue: 8.0,
        achievementLevel: 'intermediate',
        progressNotes: 'Making steady progress with coaching guidance'
      }
    })
  }

  // Create some sample coaching sessions
  const session = await prisma.coachingSession.create({
    data: {
      userId: testUser.id,
      sessionType: 'relationship_coaching',
      status: 'completed',
      durationMinutes: 35,
      sessionData: {
        topics: ['communication', 'intimacy_goals'],
        progress: 'positive'
      },
      aiInsights: {
        insights: ['Improved communication patterns', 'Setting realistic goals'],
        recommendations: ['Continue daily check-ins', 'Practice mindfulness techniques']
      },
      satisfactionScore: 8
    }
  })

  // Create feedback events for the session
  await prisma.feedbackEvent.create({
    data: {
      coachingSessionId: session.id,
      eventType: 'technique_tip',
      message: 'Great progress on communication exercises. Consider incorporating daily mindfulness practice.',
      aiConfidence: 0.92,
      userReaction: 'positive'
    }
  })

  console.log('Database seeding completed successfully!')
  console.log(`Created test user: john@doe.com (password: johndoe123)`)
  console.log(`Created ${positions.length} position recommendations`)
  console.log(`Created ${educationalContent.length} educational articles`)
  console.log('Created sample progress tracking data')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
