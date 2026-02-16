import type { RefObject } from 'react'
import InfoButton from './InfoButton'

type RawEventsCardProps = {
  rawEvents: string[]
  maxLogSize: number
  rawConsoleRef: RefObject<HTMLDivElement | null>
  onOpenGuide: () => void
}

function RawEventsCard({ rawEvents, maxLogSize, rawConsoleRef, onOpenGuide }: RawEventsCardProps) {
  return (
    <article className="card">
      <div className="card-title-row">
        <div className="title-with-info">
          <h2 className="card-title">원시 이벤트 콘솔</h2>
          <InfoButton onClick={onOpenGuide} label="원시 이벤트 콘솔" />
        </div>
        <span className="meta">{rawEvents.length} / {maxLogSize}</span>
      </div>
      <div ref={rawConsoleRef} className="raw-console" role="log" aria-live="polite">
        {rawEvents.length === 0 ? (
          <pre className="raw-line"><code>수신된 이벤트가 없습니다.</code></pre>
        ) : (
          rawEvents.map((line, index) => (
            <pre key={`${line}-${index}`} className="raw-line"><code>{index + 1}. {line}</code></pre>
          ))
        )}
      </div>
    </article>
  )
}

export default RawEventsCard
