import React from 'react'

export default function App() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Mobile Static Shell</h1>
      <p>This UI is exported as static files for Capacitor offline packaging.</p>
      <ul>
        <li>Keep Option 1 (online mode) for full-featured app</li>
        <li>Use this Option 2 when you want offline UI</li>
      </ul>
    </div>
  )
}

