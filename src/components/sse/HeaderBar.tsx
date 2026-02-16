import type { ConnectionStatus } from '../../types/sse'
import { getStatusLabel } from '../../utils/sseHelpers'
import InfoButton from './InfoButton'

type HeaderBarProps = {
  connectionStatus: ConnectionStatus
  lastReceived: string | null
  onOpenGuide: () => void
  onConnect: () => void
  onDisconnect: () => void
}

function HeaderBar({ connectionStatus, lastReceived, onOpenGuide, onConnect, onDisconnect }: HeaderBarProps) {
  return (
    <header className="header-bar card">
      <div>
        <p className="eyebrow">실시간 백엔드 실습</p>
        <h1 className="title">SSE 실습 랩</h1>
      </div>
      <div className="header-controls">
        <div className="meta-with-info">
          <span className={`status-badge status-${connectionStatus}`}>{getStatusLabel(connectionStatus)}</span>
          <span className="meta">마지막 이벤트: {lastReceived ?? '수신 없음'}</span>
          <InfoButton onClick={onOpenGuide} label="연결 상태" />
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onConnect}
          disabled={connectionStatus === 'connected' || connectionStatus === 'connecting'}
        >
          연결
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onDisconnect}
          disabled={connectionStatus === 'disconnected'}
        >
          연결 해제
        </button>
      </div>
    </header>
  )
}

export default HeaderBar
