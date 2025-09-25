import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

if (!admin.apps.length) {
  admin.initializeApp()
}

const db = admin.firestore()

export const scheduledRecommendations = functions.pubsub.schedule('every monday 09:00').timeZone('UTC').onRun(async () => {
  // For simplicity, iterate pairKeys present in chats collection recently
  const recentChats = await db.collection('chats').orderBy('timestamp', 'desc').limit(100).get()
  const pairKeys = new Set<string>()
  recentChats.forEach((d) => {
    const v = d.data() as any
    if (v.pairKey) pairKeys.add(v.pairKey)
  })

  for (const key of pairKeys) {
    const [a, b] = key.split('__')
    const loveA = (await db.collection('users').doc(a).get()).data()?.loveLanguage
    const loveB = (await db.collection('users').doc(b).get()).data()?.loveLanguage
    const love = loveA || loveB || 'Quality Time'
    const suggestion = buildSuggestion(love)
    await db.collection('recommendations').add({ pairKey: key, text: suggestion, createdAt: admin.firestore.FieldValue.serverTimestamp() })
  }
  return null
})

function buildSuggestion(love: string): string {
  switch (love) {
    case 'Words of Affirmation':
      return 'Plan a night to exchange appreciation notes and read them aloud.'
    case 'Receiving Gifts':
      return 'Curate a small surprise care package aligned with recent interests.'
    case 'Acts of Service':
      return 'Pick a helpful task your partner dislikes and handle it this week.'
    case 'Physical Touch':
      return 'Schedule a massage exchange evening with calming music.'
    default:
      return 'Plan a device-free hour walk together and share highlights of your week.'
  }
}

export const onNewChatMessage = functions.firestore.document('chats/{id}').onCreate(async (snap) => {
  const data = snap.data() as any
  const receiverId = data.receiverId
  const tokensSnap = await db.collection('fcm_tokens').where('userId', '==', receiverId).get()
  const tokens = tokensSnap.docs.map((d) => d.data().token).filter(Boolean)
  if (tokens.length === 0) return null
  await admin.messaging().sendEachForMulticast({
    tokens,
    notification: {
      title: 'New message',
      body: data.text?.slice(0, 120) || 'You have a new message'
    }
  })
  return null
})

export const onNewCalendarEvent = functions.firestore.document('calendars/{id}').onCreate(async (snap) => {
  const data = snap.data() as any
  const userIds: string[] = data.userIds || []
  const tokensSnap = await db.collection('fcm_tokens').where('userId', 'in', userIds).get()
  const tokens = tokensSnap.docs.map((d) => d.data().token).filter(Boolean)
  if (tokens.length === 0) return null
  await admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title: 'New Calendar Event', body: data.title || 'A new event was added' }
  })
  return null
})

export const dailyMoodReminder = functions.pubsub.schedule('every day 18:00').timeZone('UTC').onRun(async () => {
  const users = await db.collection('users').limit(200).get()
  for (const u of users.docs) {
    const tokensSnap = await db.collection('fcm_tokens').where('userId', '==', u.id).get()
    const tokens = tokensSnap.docs.map((d) => d.data().token).filter(Boolean)
    if (tokens.length === 0) continue
    await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title: 'How are you feeling today?', body: 'Log your mood in the dashboard.' }
    })
  }
  return null
})

