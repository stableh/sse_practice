import type { GuideItem } from '../../types/sse'

type GuideModalProps = {
  guide: GuideItem
  onClose: () => void
}

function GuideModal({ guide, onClose }: GuideModalProps) {
  return (
    <div className="guide-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="guide-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${guide.title} 안내`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="guide-modal-header">
          <h3>{guide.title}</h3>
          <button type="button" className="close-btn" onClick={onClose} aria-label="안내 닫기">
            닫기
          </button>
        </div>
        <div className="guide-grid">
          <div>
            <p className="guide-title">프론트 설정</p>
            <ul className="guide-list">
              {guide.frontend.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="guide-title">백엔드 설정</p>
            <ul className="guide-list">
              {guide.backend.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

export default GuideModal
