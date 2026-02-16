import { useEffect, useRef, useState } from 'react'
import type { AlertLevel, ConnectionStatus } from '../../types/sse'
import { buildStreamUrl } from '../../utils/sseHelpers'

type UseConnectionStateArgs = {
  sseUrl: string
  queryParams: string
  onEvent: (typeFromEvent: string, data: string) => void
  addAlert: (level: AlertLevel, message: string) => void
}

export function useConnectionState({ sseUrl, queryParams, onEvent, addAlert }: UseConnectionStateArgs) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected')
  const [reconnectAttempts, setReconnectAttempts] = useState(0)

  const eventSourceRef = useRef<EventSource | null>(null)
  const lastErrorNoticeAtRef = useRef(0)
  const hasConnectedOnceRef = useRef(false)

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close()
    }
  }, [])

  const connect = () => {
    if (!sseUrl.trim()) {
      setConnectionStatus('error')
      addAlert('error', 'SSE URL을 입력해주세요.')
      return
    }

    try {
      const streamUrl = buildStreamUrl(sseUrl, queryParams)

      eventSourceRef.current?.close()
      setConnectionStatus('connecting')

      const source = new EventSource(streamUrl)
      eventSourceRef.current = source

      source.onopen = () => {
        setConnectionStatus('connected')
        hasConnectedOnceRef.current = true
        addAlert('success', `SSE 구독 연결 성공: ${streamUrl}`)
      }

      source.onerror = () => {

        const now = Date.now()
        const shouldNotify = now - lastErrorNoticeAtRef.current > 4000

        if (source.readyState === EventSource.CONNECTING) {
          setConnectionStatus('connecting')
          setReconnectAttempts((prev) => prev + 1)
          if (shouldNotify) {
            addAlert(
              hasConnectedOnceRef.current ? 'warn' : 'error',
              hasConnectedOnceRef.current ? 'SSE 재연결을 시도 중입니다.' : 'SSE 연결에 실패했습니다. 서버 상태를 확인하세요.',
            )
            lastErrorNoticeAtRef.current = now
          }
          return
        }

        if (source.readyState === EventSource.CLOSED) {
          setConnectionStatus('disconnected')
          if (shouldNotify) {
            addAlert('warn', 'SSE 스트림이 종료되었습니다.')
            lastErrorNoticeAtRef.current = now
          }
          return
        }

        setConnectionStatus('error')
        if (shouldNotify) {
          addAlert('error', 'SSE 연결 오류가 발생했습니다.')
          lastErrorNoticeAtRef.current = now
        }
      }

      source.onmessage = (event) => {
        onEvent('message', event.data)
      }

      ;(['notify', 'stage_update', 'metric', 'heartbeat'] as const).forEach((type) => {
        source.addEventListener(type, (event) => {
          onEvent(type, (event as MessageEvent).data)
        })
      })
    } catch {
      setConnectionStatus('error')
      addAlert('error', 'SSE URL 형식이 올바르지 않습니다.')
    }
  }

  const disconnect = () => {

    eventSourceRef.current?.close()
    eventSourceRef.current = null
    setConnectionStatus('disconnected')
  }

  return {
    connectionStatus,
    reconnectAttempts,
    connect,
    disconnect,
  }
}
