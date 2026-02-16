import { useEffect, useRef, useState } from 'react'

export function useConsoleState() {
  const [rawEvents, setRawEvents] = useState<string[]>([])
  const [autoScroll, setAutoScroll] = useState(true)
  const [pauseStream, setPauseStream] = useState(false)
  const [maxLogSize, setMaxLogSizeState] = useState(300)
  const rawConsoleRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (autoScroll && rawConsoleRef.current) {
      rawConsoleRef.current.scrollTop = rawConsoleRef.current.scrollHeight
    }
  }, [rawEvents, autoScroll])

  const addRawLine = (line: string) => {
    setRawEvents((prev) => [...prev, line].slice(-maxLogSize))
  }

  const clearRawEvents = () => {
    setRawEvents([])
  }

  const setMaxLogSize = (value: number) => {
    setMaxLogSizeState(value)
    setRawEvents((prev) => prev.slice(-value))
  }

  return {
    rawEvents,
    autoScroll,
    pauseStream,
    maxLogSize,
    rawConsoleRef,
    addRawLine,
    clearRawEvents,
    setAutoScroll,
    setPauseStream,
    setMaxLogSize,
  }
}
