export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'
export type PipelineStage = 'queued' | 'build' | 'test' | 'deploy' | 'done'
export type AlertLevel = 'info' | 'success' | 'warn' | 'error'
export type StageVisual = 'idle' | 'pending' | 'running' | 'success' | 'error'

export type AlertItem = {
  id: string
  time: string
  level: AlertLevel
  message: string
}

export type SseEventType = 'notify' | 'stage_update' | 'metric' | 'heartbeat'

export type StageStatusMap = Record<PipelineStage, StageVisual>

export type GuideKey = 'connection' | 'pipeline' | 'alerts' | 'metrics' | 'raw_console' | 'controls'

export type GuideItem = {
  title: string
  frontend: string[]
  backend: string[]
}
