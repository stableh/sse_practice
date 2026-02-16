import InfoButton from './InfoButton'

type MetricsCardProps = {
  totalEvents: number
  eps: string
  latencyMs: number | null
  heartbeatText: string
  onOpenGuide: () => void
}

function MetricsCard({ totalEvents, eps, latencyMs, heartbeatText, onOpenGuide }: MetricsCardProps) {
  return (
    <article className="card">
      <div className="title-with-info">
        <h2 className="card-title">실시간 지표</h2>
        <InfoButton onClick={onOpenGuide} label="실시간 지표" />
      </div>
      <div className="metric-grid">
        <div className="metric-item">
          <p className="metric-label">총 이벤트</p>
          <p className="metric-value">{totalEvents}</p>
          <p className="metric-hint">현재 세션 기준</p>
        </div>
        <div className="metric-item">
          <p className="metric-label">EPS</p>
          <p className="metric-value">{eps}</p>
          <p className="metric-hint">초당 이벤트</p>
        </div>
        <div className="metric-item">
          <p className="metric-label">지연 시간</p>
          <p className="metric-value">{latencyMs === null ? '-' : `${latencyMs}ms`}</p>
          <p className="metric-hint">마지막 Heartbeat</p>
        </div>
      </div>
      <p className="meta">{heartbeatText}</p>
    </article>
  )
}

export default MetricsCard
