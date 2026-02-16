import type { AlertLevel, ConnectionStatus, PipelineStage, StageStatusMap, StageVisual } from '../types/sse'

export const stageOrder: PipelineStage[] = ['queued', 'build', 'test', 'deploy', 'done']

export const initialStageStatus: StageStatusMap = {
  queued: 'idle',
  build: 'idle',
  test: 'idle',
  deploy: 'idle',
  done: 'idle',
}

export function getStatusLabel(status: ConnectionStatus) {
  switch (status) {
    case 'connected':
      return '연결됨'
    case 'connecting':
      return '연결 중'
    case 'error':
      return '오류'
    default:
      return '연결 끊김'
  }
}

export function getStageLabel(stage: PipelineStage) {
  switch (stage) {
    case 'queued':
      return '대기'
    case 'build':
      return '빌드'
    case 'test':
      return '테스트'
    case 'deploy':
      return '배포'
    default:
      return '완료'
  }
}

export function getStageStateLabel(state: StageVisual) {
  switch (state) {
    case 'idle':
      return '미수신'
    case 'pending':
      return '대기'
    case 'running':
      return '진행 중'
    case 'success':
      return '완료'
    default:
      return '오류'
  }
}

export function getAlertLevelLabel(level: AlertLevel) {
  switch (level) {
    case 'info':
      return '정보'
    case 'success':
      return '성공'
    case 'warn':
      return '경고'
    default:
      return '오류'
  }
}

export function isStage(value: unknown): value is PipelineStage {
  return typeof value === 'string' && stageOrder.includes(value as PipelineStage)
}

export function formatClock(value: Date) {
  return value.toLocaleTimeString('ko-KR', { hour12: false })
}

export function buildStreamUrl(sseUrl: string, queryParams: string) {
  const url = new URL(sseUrl, window.location.origin)
  if (queryParams.trim()) {
    const extraParams = new URLSearchParams(queryParams)
    extraParams.forEach((val, key) => {
      url.searchParams.set(key, val)
    })
  }
  return url.toString()
}
