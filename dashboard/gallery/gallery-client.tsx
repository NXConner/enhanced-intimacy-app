'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Trash2, Lock, Unlock, Upload, Image as ImageIcon, Video } from 'lucide-react'

interface MediaItem {
  id: string
  originalName: string
  storedFilename: string
  mimeType: string
  storagePath: string
  fileSizeBytes: number
  createdAt: string
}

export default function GalleryClient() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [unlockOpen, setUnlockOpen] = useState(false)
  const [passcode, setPasscode] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/media', { cache: 'no-store' })
      if (res.status === 423) {
        setUnlockOpen(true)
        setItems([])
        return
      }
      if (!res.ok) throw new Error('Failed to load media')
      const data = await res.json()
      setItems(data.items)
    } catch (e: any) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const onUnlock = async () => {
    setError(null)
    const res = await fetch('/api/media-vault/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode })
    })
    if (res.ok) {
      setUnlockOpen(false)
      setPasscode('')
      fetchItems()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Unlock failed')
    }
  }

  const onUploadClick = () => fileInputRef.current?.click()

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/media', { method: 'POST', body: fd })
      if (res.status === 423) {
        setUnlockOpen(true)
        return
      }
      if (!res.ok) throw new Error('Upload failed')
      await fetchItems()
    } catch (e: any) {
      setError(e.message || 'Upload failed')
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const onDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/media?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setItems(prev => prev.filter(i => i.id !== id))
    } catch (e: any) {
      setError(e.message || 'Delete failed')
    } finally {
      setLoading(false)
    }
  }

  const isVideo = (mime: string) => mime.startsWith('video/') || /mp4|webm|ogg/.test(mime)
  const isImage = (mime: string) => mime.startsWith('image/') || /gif/.test(mime)

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Private Gallery</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchItems} disabled={loading}>Refresh</Button>
          <input ref={fileInputRef} type="file" className="hidden" onChange={onFileChange} />
          <Button onClick={onUploadClick} disabled={loading}>
            <Upload className="h-4 w-4 mr-2" /> Upload
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}

      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2" /> Vault Contents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No media yet. Upload to get started.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map(item => (
                <div key={item.id} className="group relative border rounded-md overflow-hidden bg-white/80">
                  <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="destructive" onClick={() => onDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="aspect-video w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {isImage(item.mimeType) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.storagePath} alt={item.originalName} className="w-full h-full object-cover" />
                    ) : isVideo(item.mimeType) ? (
                      <video src={item.storagePath} className="w-full h-full object-cover" controls />
                    ) : (
                      <div className="text-muted-foreground text-sm p-4 text-center">
                        Unsupported: {item.mimeType}
                      </div>
                    )}
                  </div>
                  <div className="p-2 text-xs flex items-center justify-between">
                    <span className="truncate" title={item.originalName}>{item.originalName}</span>
                    <Badge variant="secondary">{(item.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={unlockOpen} onOpenChange={setUnlockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Vault</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input type="password" placeholder="Enter passcode" value={passcode} onChange={(e) => setPasscode(e.target.value)} />
            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>
          <DialogFooter>
            <Button onClick={onUnlock} disabled={!passcode}>Unlock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

