type InfoButtonProps = {
  label: string
  onClick: () => void
}

function InfoButton({ label, onClick }: InfoButtonProps) {
  return (
    <button type="button" className="info-btn" onClick={onClick} aria-label={`${label} 설정 정보 보기`}>
      i
    </button>
  )
}

export default InfoButton
