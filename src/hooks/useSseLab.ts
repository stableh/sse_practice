import { useState } from 'react'
import { guideMap } from '../data/sseGuides'
import { useAlertsState } from './sse/useAlertsState'
import { useConnectionState } from './sse/useConnectionState'
import { useConsoleState } from './sse/useConsoleState'
import { useMetricsState } from './sse/useMetricsState'
import { usePipelineState } from './sse/usePipelineState'
import type { GuideKey, SseEventType } from '../types/sse'

export function useSseLab() {
  const [sseUrl, setSseUrl] = useState('http://localhost:8080/api/sse/sub/c1')
  const [queryParams, setQueryParams] = useState('')
  const [startApiPath, setStartApiPath] = useState('/api/sse/send/pipeline/c1')
  const [alertApiPath, setAlertApiPath] = useState('/api/sse/send/alert/c1')
  const [errorApiPath, setErrorApiPath] = useState('/api/lab/error')
  const [resetApiPath, setResetApiPath] = useState('/api/lab/reset')
  const [actionBodyText, setActionBodyText] = useState('')
  const [lastReceived, setLastReceived] = useState<string | null>(null)
  const [activeGuide, setActiveGuide] = useState<GuideKey | null>(null)

  const alertsState = useAlertsState()
  const pipelineState = usePipelineState()
  const metricsState = useMetricsState()
  const consoleState = useConsoleState()

  const parseAndProcess = (typeFromEvent: string, data: string) => {
    try {
      const parsed = JSON.parse(data) as Record<string, unknown>
      const type = (
        (typeFromEvent === 'message' ? parsed.event : typeFromEvent) ??
        parsed.event
      ) as SseEventType
      const payload = (typeof parsed.data === 'object' && parsed.data !== null
        ? (parsed.data as Record<string, unknown>)
        : parsed)

      if (!['notify', 'stage_update', 'metric', 'heartbeat'].includes(type)) {
        alertsState.addAlert('warn', `알 수 없는 이벤트 타입을 받았습니다: ${type}`)
        return
      }

      if (consoleState.pauseStream) return

      const nowMs = Date.now()

      consoleState.addRawLine(data)
      metricsState.trackEvent(nowMs, payload)
      setLastReceived(new Date(nowMs).toLocaleTimeString('ko-KR', { hour12: false }))
      pipelineState.updateRunId(
        typeof payload.runId === 'string'
          ? payload.runId
          : typeof parsed.id === 'string'
            ? parsed.id
            : undefined,
      )

      if (type === 'notify') {
        const level = payload.level
        const message = payload.message
        if ((level === 'info' || level === 'success' || level === 'warn' || level === 'error') && typeof message === 'string') {
          alertsState.addAlert(level, message)
        }
      }

      if (type === 'stage_update') {
        pipelineState.updateStage(payload)
      }

      if (type === 'metric') {
        metricsState.applyMetricPayload(payload)
      }

      if (type === 'heartbeat') {
        metricsState.applyHeartbeatPayload(nowMs, payload)
      }
    } catch {
      alertsState.addAlert('error', '이벤트 JSON 파싱에 실패했습니다.')
      consoleState.addRawLine(data)
    }
  }

  const connectionState = useConnectionState({
    sseUrl,
    queryParams,
    onEvent: parseAndProcess,
    addAlert: alertsState.addAlert,
  })

  const resolveApiUrl = (pathOrUrl: string) => {
    const path = pathOrUrl.trim()
    if (/^https?:\/\//i.test(path)) return path
    const base = new URL(sseUrl, window.location.origin)
    return new URL(path.startsWith('/') ? path : `/${path}`, base.origin).toString()
  }

  const triggerAction = async (pathOrUrl: string) => {
    const path = pathOrUrl.trim()
    if (!path) {
      alertsState.addAlert('error', '액션 API URL을 입력해주세요.')
      return
    }

    try {
      const requestUrl = resolveApiUrl(path)
      const fetchOptions: RequestInit = { method: 'POST' }

      if (actionBodyText.trim()) {
        try {
          const parsedBody = JSON.parse(actionBodyText)
          fetchOptions.body = JSON.stringify(parsedBody)
          fetchOptions.headers = { 'Content-Type': 'application/json' }
        } catch {
          alertsState.addAlert('error', '요청 Body는 올바른 JSON 형식이어야 합니다.')
          return
        }
      }

      const res = await fetch(requestUrl, fetchOptions)
      if (!res.ok) {
        alertsState.addAlert('error', `${path} 요청 실패 (${res.status})`)
      }
    } catch {
      alertsState.addAlert('error', `${path} 요청 중 네트워크 오류가 발생했습니다.`)
    }
  }

  const resetSession = () => {
    triggerAction(resetApiPath)
    pipelineState.resetPipeline()
    consoleState.clearRawEvents()
    alertsState.clearAlerts()
    metricsState.resetMetrics()
    setLastReceived(null)
  }

  const currentGuide = activeGuide ? guideMap[activeGuide] : null

  return {
    connectionStatus: connectionState.connectionStatus,
    lastReceived,
    runId: pipelineState.runId,
    currentStage: pipelineState.currentStage,
    stageStatus: pipelineState.stageStatus,
    alerts: alertsState.alerts,
    rawEvents: consoleState.rawEvents,
    sseUrl,
    queryParams,
    startApiPath,
    alertApiPath,
    errorApiPath,
    resetApiPath,
    actionBodyText,
    autoScroll: consoleState.autoScroll,
    pauseStream: consoleState.pauseStream,
    maxLogSize: consoleState.maxLogSize,
    totalEvents: metricsState.totalEvents,
    latencyMs: metricsState.latencyMs,
    reconnectAttempts: connectionState.reconnectAttempts,
    errorCount: alertsState.errorCount,
    eps: metricsState.eps,
    heartbeatText: metricsState.heartbeatText,
    rawConsoleRef: consoleState.rawConsoleRef,
    currentGuide,
    setSseUrl,
    setQueryParams,
    setStartApiPath,
    setAlertApiPath,
    setErrorApiPath,
    setResetApiPath,
    setActionBodyText,
    setAutoScroll: consoleState.setAutoScroll,
    setPauseStream: consoleState.setPauseStream,
    setMaxLogSize: consoleState.setMaxLogSize,
    setActiveGuide,
    connect: connectionState.connect,
    disconnect: connectionState.disconnect,
    triggerAction,
    resetSession,
  }
}
