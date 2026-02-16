import type { PipelineStage, StageStatusMap } from '../../types/sse'
import { getStageLabel, getStageStateLabel, stageOrder } from '../../utils/sseHelpers'
import InfoButton from './InfoButton'

type PipelineCardProps = {
  runId: string | null
  stageStatus: StageStatusMap
  onOpenGuide: () => void
}

function PipelineCard({ runId, stageStatus, onOpenGuide }: PipelineCardProps) {
  return (
    <article className="card">
      <div className="card-title-row">
        <div className="title-with-info">
          <h2 className="card-title">파이프라인 단계</h2>
          <InfoButton onClick={onOpenGuide} label="파이프라인 단계" />
        </div>
        <span className="meta">{runId ?? 'runId 수신 전'}</span>
      </div>
      <div className="timeline" role="list" aria-label="파이프라인 진행 타임라인">
        {stageOrder.map((stage: PipelineStage) => {
          const visual = stageStatus[stage]
          return (
            <div key={stage} className={`timeline-item stage-${visual}`} role="listitem">
              <span className="timeline-dot" aria-hidden="true" />
              <div>
                <p className="timeline-stage">{getStageLabel(stage)}</p>
                <p className="timeline-state">{getStageStateLabel(visual)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default PipelineCard
