import type { AlertItem } from '../../types/sse'
import { getAlertLevelLabel } from '../../utils/sseHelpers'
import InfoButton from './InfoButton'

type AlertsCardProps = {
  alerts: AlertItem[]
  onOpenGuide: () => void
}

function AlertsCard({ alerts, onOpenGuide }: AlertsCardProps) {
  return (
    <article className="card">
      <div className="card-title-row">
        <div className="title-with-info">
          <h2 className="card-title">알람</h2>
          <InfoButton onClick={onOpenGuide} label="알람" />
        </div>
        <div className="chip-row" role="group" aria-label="알람 필터">
          <button type="button" className="chip chip-active">전체</button>
          <button type="button" className="chip">경고</button>
          <button type="button" className="chip">오류</button>
        </div>
      </div>
      <ul className="alert-list">
        {alerts.length === 0 ? (
          <li className="alert-item alert-info">
            <span className="alert-time">-</span>
            <span className="alert-level">정보</span>
            <span className="alert-message">실제 notify 이벤트를 수신하면 표시됩니다.</span>
          </li>
        ) : (
          alerts.map((alert) => (
            <li key={alert.id} className={`alert-item alert-${alert.level}`}>
              <span className="alert-time">{alert.time}</span>
              <span className="alert-level">{getAlertLevelLabel(alert.level)}</span>
              <span className="alert-message">{alert.message}</span>
            </li>
          ))
        )}
      </ul>
    </article>
  )
}

export default AlertsCard
