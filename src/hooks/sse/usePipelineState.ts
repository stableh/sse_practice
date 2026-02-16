import { useState } from 'react'
import type { PipelineStage, StageStatusMap } from '../../types/sse'
import { initialStageStatus, isStage, stageOrder } from '../../utils/sseHelpers'

export function usePipelineState() {
  const [runId, setRunId] = useState<string | null>(null)
  const [currentStage, setCurrentStage] = useState<PipelineStage | null>(null)
  const [stageStatus, setStageStatus] = useState<StageStatusMap>(initialStageStatus)

  const updateRunId = (nextRunId?: string) => {
    if (nextRunId) setRunId(nextRunId)
  }

  const updateStage = (payload?: Record<string, unknown>) => {
    if (!payload) return

    const stage = payload.stage
    const status = payload.status

    if (!isStage(stage) || typeof status !== 'string') return

    setCurrentStage(stage)
    setStageStatus((prev) => {
      const next = { ...prev }
      const currentIndex = stageOrder.indexOf(stage)

      stageOrder.forEach((entry, index) => {
        if (index < currentIndex && next[entry] !== 'error') {
          next[entry] = 'success'
        }
        if (index > currentIndex && next[entry] === 'idle') {
          next[entry] = 'pending'
        }
      })

      if (status === 'pending') next[stage] = 'pending'
      if (status === 'running') next[stage] = 'running'
      if (status === 'success') next[stage] = 'success'
      if (status === 'error') next[stage] = 'error'

      return next
    })
  }

  const resetPipeline = () => {
    setRunId(null)
    setCurrentStage(null)
    setStageStatus(initialStageStatus)
  }

  return {
    runId,
    currentStage,
    stageStatus,
    updateRunId,
    updateStage,
    resetPipeline,
  }
}
