import { useMemo, useRef, useState } from 'react'

export function useMetricsState() {
  const [totalEvents, setTotalEvents] = useState(0)
  const [latencyMs, setLatencyMs] = useState<number | null>(null)
  const [lastHeartbeatAt, setLastHeartbeatAt] = useState<number | null>(null)
  const epsWindowRef = useRef<number[]>([])

  const trackEvent = (nowMs: number, payload?: Record<string, unknown>) => {
    epsWindowRef.current = [...epsWindowRef.current, nowMs].filter((point) => nowMs - point <= 1000)
    setTotalEvents((prev) => prev + 1)

    if (payload && typeof payload.latencyMs === 'number') {
      setLatencyMs(payload.latencyMs)
    }
  }

  const applyMetricPayload = (payload?: Record<string, unknown>) => {
    if (!payload) return

    if (typeof payload.totalEvents === 'number') {
      setTotalEvents(payload.totalEvents)
    }

    if (typeof payload.latencyMs === 'number') {
      setLatencyMs(payload.latencyMs)
    }
  }

  const applyHeartbeatPayload = (nowMs: number, payload?: Record<string, unknown>) => {
    setLastHeartbeatAt(nowMs)
    if (payload && typeof payload.latencyMs === 'number') {
      setLatencyMs(payload.latencyMs)
    }
  }

  const resetMetrics = () => {
    epsWindowRef.current = []
    setTotalEvents(0)
    setLatencyMs(null)
    setLastHeartbeatAt(null)
  }

  const eps = useMemo(() => {
    const now = Date.now()
    const active = epsWindowRef.current.filter((point) => now - point <= 1000)
    return active.length.toFixed(1)
  }, [totalEvents])

  const heartbeatText = useMemo(() => {
    if (!lastHeartbeatAt) return 'Heartbeat 수신 없음'
    return `Heartbeat 수신 ${Math.max(0, Math.floor((Date.now() - lastHeartbeatAt) / 1000))}초 전`
  }, [lastHeartbeatAt, totalEvents])

  return {
    totalEvents,
    latencyMs,
    eps,
    heartbeatText,
    trackEvent,
    applyMetricPayload,
    applyHeartbeatPayload,
    resetMetrics,
  }
}
