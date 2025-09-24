// Simple on-device analysis worker scaffold (mocked metrics)

let t = 0

self.onmessage = (event: MessageEvent) => {
  const { type } = event.data || {}
  if (type === 'frame') {
    // In a real implementation, run WASM/MediaPipe/TFLite here on the frame
    const arousal = 60 + Math.random() * 20
    const connection = 65 + Math.random() * 20
    const communication = 70 + Math.random() * 15
    // Post back per-frame metrics
    ;(self as unknown as Worker).postMessage({
      type: 'metrics',
      payload: { t: t++, arousal, connection, communication }
    })
  }
}

