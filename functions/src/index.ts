import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()

export const weeklyRecommendations = functions.pubsub.schedule('every monday 09:00').onRun(async () => {
  const couplesSnapshot = await db.collection('users').get() // replace with couples mapping if available
  const batch = db.batch()
  for (const docSnap of couplesSnapshot.docs) {
    const userId = docSnap.id
    const [quizRes, events, moods, goals] = await Promise.all([
      db.collection('quiz_results').where('userId', '==', userId).get(),
      db.collection('calendars').where('userIds', 'array-contains', userId).get(),
      db.collection('mood_logs').where('userId', '==', userId).get(),
      db.collection('goals').where('userIds', 'array-contains', userId).get(),
    ])
    const loveLanguage = quizRes.docs.find(d => d.get('quizKey') === 'love_languages')?.get('loveLanguage') || 'Quality Time'
    const suggestion = `Plan a date aligned with ${loveLanguage}. Try a walk and talk this week.`
    const targetRef = db.collection('recommendations').doc()
    batch.set(targetRef, { userId, suggestion, createdAt: admin.firestore.FieldValue.serverTimestamp() })
  }
  await batch.commit()
})

export const notifyOnChat = functions.firestore.document('chats/{messageId}').onCreate(async (snap) => {
  const data = snap.data() as any
  const receiverId = data.receiverId
  const tokensSnap = await db.collection('users').doc(receiverId).collection('deviceTokens').get()
  const tokens = tokensSnap.docs.map(d => d.id)
  if (tokens.length) {
    await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title: 'New message', body: data.text?.slice(0, 80) || 'New message received' },
    })
  }
})

export const notifyOnCalendar = functions.firestore.document('calendars/{eventId}').onCreate(async (snap) => {
  const data = snap.data() as any
  const userIds: string[] = data.userIds || []
  for (const uid of userIds) {
    const tokensSnap = await db.collection('users').doc(uid).collection('deviceTokens').get()
    const tokens = tokensSnap.docs.map(d => d.id)
    if (tokens.length) {
      await admin.messaging().sendEachForMulticast({
        tokens,
        notification: { title: 'New calendar event', body: data.title || 'New event added' },
      })
    }
  }
})

export const dailyMoodReminder = functions.pubsub.schedule('every day 18:00').onRun(async () => {
  const usersSnap = await db.collection('users').get()
  for (const user of usersSnap.docs) {
    const tokensSnap = await db.collection('users').doc(user.id).collection('deviceTokens').get()
    const tokens = tokensSnap.docs.map(d => d.id)
    if (tokens.length) {
      await admin.messaging().sendEachForMulticast({
        tokens,
        notification: { title: 'Daily mood', body: 'How are you feeling today?' },
      })
    }
  }
})

