/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: self?.ENV?.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: self?.ENV?.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: self?.ENV?.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: self?.ENV?.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: self?.ENV?.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: self?.ENV?.NEXT_PUBLIC_FIREBASE_APP_ID
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload?.notification || {}
  self.registration.showNotification(title || 'New notification', {
    body: body || '',
    icon: icon || '/icons/icon-192x192.png'
  })
})

