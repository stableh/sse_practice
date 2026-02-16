import type { PipelineStage } from '../../types/sse'
import { getStageLabel } from '../../utils/sseHelpers'
import InfoButton from './InfoButton'

type ControlPanelProps = {
  sseUrl: string
  queryParams: string
  startApiPath: string
  alertApiPath: string
  errorApiPath: string
  resetApiPath: string
  actionBodyText: string
  autoScroll: boolean
  pauseStream: boolean
  maxLogSize: number
  currentStage: PipelineStage | null
  errorCount: number
  reconnectAttempts: number
  setSseUrl: (value: string) => void
  setQueryParams: (value: string) => void
  setStartApiPath: (value: string) => void
  setAlertApiPath: (value: string) => void
  setErrorApiPath: (value: string) => void
  setResetApiPath: (value: string) => void
  setActionBodyText: (value: string) => void
  setAutoScroll: (value: boolean) => void
  setPauseStream: (value: boolean) => void
  setMaxLogSize: (value: number) => void
  onOpenGuide: () => void
  onStartPipeline: () => void
  onSendAlert: () => void
  onSimulateError: () => void
  onResetSession: () => void
}

function ControlPanel({
  sseUrl,
  queryParams,
  startApiPath,
  alertApiPath,
  errorApiPath,
  resetApiPath,
  actionBodyText,
  autoScroll,
  pauseStream,
  maxLogSize,
  currentStage,
  errorCount,
  reconnectAttempts,
  setSseUrl,
  setQueryParams,
  setStartApiPath,
  setAlertApiPath,
  setErrorApiPath,
  setResetApiPath,
  setActionBodyText,
  setAutoScroll,
  setPauseStream,
  setMaxLogSize,
  onOpenGuide,
  onStartPipeline,
  onSendAlert,
  onSimulateError,
  onResetSession,
}: ControlPanelProps) {
  return (
    <aside className="right-pane card">
      <div className="title-with-info">
        <h2 className="card-title">제어 패널</h2>
        <InfoButton onClick={onOpenGuide} label="제어 패널" />
      </div>

      <section className="control-section">
        <h3 className="section-title">연결 설정</h3>
        <label className="field-label" htmlFor="sse-url">SSE URL</label>
        <input
          id="sse-url"
          className="text-input"
          type="text"
          value={sseUrl}
          onChange={(event) => setSseUrl(event.target.value)}
        />

        <label className="field-label" htmlFor="sse-query">쿼리 파라미터</label>
        <input
          id="sse-query"
          className="text-input"
          type="text"
          value={queryParams}
          onChange={(event) => setQueryParams(event.target.value)}
          placeholder="예: runId=real-run-001"
        />
      </section>

      <section className="control-section">
        <h3 className="section-title">실습 액션</h3>
        <label className="field-label" htmlFor="start-api-url">파이프라인 시작 API URL</label>
        <input
          id="start-api-url"
          className="text-input"
          type="text"
          value={startApiPath}
          onChange={(event) => setStartApiPath(event.target.value)}
        />

        <label className="field-label" htmlFor="alert-api-url">테스트 알람 API URL</label>
        <input
          id="alert-api-url"
          className="text-input"
          type="text"
          value={alertApiPath}
          onChange={(event) => setAlertApiPath(event.target.value)}
        />

        <label className="field-label" htmlFor="error-api-url">오류 시뮬레이션 API URL</label>
        <input
          id="error-api-url"
          className="text-input"
          type="text"
          value={errorApiPath}
          onChange={(event) => setErrorApiPath(event.target.value)}
        />

        <label className="field-label" htmlFor="reset-api-url">세션 초기화 API URL</label>
        <input
          id="reset-api-url"
          className="text-input"
          type="text"
          value={resetApiPath}
          onChange={(event) => setResetApiPath(event.target.value)}
        />

        <label className="field-label" htmlFor="action-body">액션 요청 Body(JSON)</label>
        <textarea
          id="action-body"
          className="text-input text-area"
          value={actionBodyText}
          onChange={(event) => setActionBodyText(event.target.value)}
          placeholder={'예: {\"clientId\":\"c1\",\"message\":\"테스트\"}'}
        />

        <div className="action-grid">
          <button type="button" className="btn btn-primary" onClick={onStartPipeline}>
            파이프라인 시작
          </button>
          <button type="button" className="btn btn-secondary" onClick={onSendAlert}>
            테스트 알람 전송
          </button>
          <button type="button" className="btn btn-secondary" onClick={onSimulateError}>
            오류 시뮬레이션
          </button>
          <button type="button" className="btn btn-secondary" onClick={onResetSession}>
            세션 초기화
          </button>
        </div>
      </section>

      <section className="control-section">
        <h3 className="section-title">표시 옵션</h3>
        <label className="toggle-row" htmlFor="auto-scroll">
          <span>자동 스크롤</span>
          <input
            id="auto-scroll"
            type="checkbox"
            checked={autoScroll}
            onChange={(event) => setAutoScroll(event.target.checked)}
          />
        </label>
        <label className="toggle-row" htmlFor="pause-stream">
          <span>스트림 일시 중지</span>
          <input
            id="pause-stream"
            type="checkbox"
            checked={pauseStream}
            onChange={(event) => setPauseStream(event.target.checked)}
          />
        </label>

        <label className="field-label" htmlFor="max-log">최대 로그 크기</label>
        <select
          id="max-log"
          className="text-input"
          value={maxLogSize}
          onChange={(event) => setMaxLogSize(Number(event.target.value))}
        >
          <option value={100}>100</option>
          <option value={300}>300</option>
          <option value={500}>500</option>
        </select>
      </section>

      <section className="control-section">
        <h3 className="section-title">세션 스냅샷</h3>
        <dl className="snapshot-grid">
          <div>
            <dt>현재 단계</dt>
            <dd>{currentStage ? getStageLabel(currentStage) : '-'}</dd>
          </div>
          <div>
            <dt>오류 수</dt>
            <dd>{errorCount}</dd>
          </div>
          <div>
            <dt>재연결 시도</dt>
            <dd>{reconnectAttempts}</dd>
          </div>
        </dl>
      </section>
    </aside>
  )
}

export default ControlPanel
