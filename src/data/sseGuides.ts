import type { GuideItem, GuideKey } from '../types/sse'

export const guideMap: Record<GuideKey, GuideItem> = {
  connection: {
    title: '연결 상태 / 마지막 이벤트',
    frontend: [
      'SSE URL 입력값을 실제 서버 주소로 설정합니다. 예: http://localhost:8080/api/lab/stream',
      '연결 버튼을 눌러 EventSource를 열고, 연결 해제 버튼으로 닫습니다.',
      '마지막 이벤트 시각은 이벤트를 실제로 수신할 때만 갱신됩니다.',
    ],
    backend: [
      'GET /api/lab/stream 엔드포인트가 text/event-stream으로 응답해야 합니다.',
      'CORS에서 프론트 주소(예: http://localhost:5173)를 허용해야 합니다.',
      '연결 유지용 heartbeat 이벤트를 주기적으로 전송하는 것을 권장합니다.',
    ],
  },
  pipeline: {
    title: '파이프라인 단계',
    frontend: [
      'stage_update 이벤트를 수신하면 단계 타임라인 상태를 갱신합니다.',
      '지원 단계 키워드: queued, build, test, deploy, done',
      '지원 상태 키워드: pending, running, success, error',
    ],
    backend: [
      'event: stage_update 형태로 이벤트를 전송해야 합니다.',
      'data에는 stage와 status를 포함한 JSON을 넣어야 합니다. 예: {"stage":"build","status":"running"}',
      'data에 runId를 함께 보내면 카드 상단 실행 ID가 갱신됩니다.',
    ],
  },
  alerts: {
    title: '알람',
    frontend: [
      'notify 이벤트만 알람 카드에 표시됩니다.',
      '지원 레벨 키워드: info, success, warn, error',
      '실제 수신 이벤트만 표시하며, 더미 초기 알람은 없습니다.',
    ],
    backend: [
      'event: notify로 전송해야 합니다.',
      'data 필수값: level, message',
      '예: {"level":"warn","message":"테스트 경고"}',
    ],
  },
  metrics: {
    title: '실시간 지표',
    frontend: [
      '총 이벤트와 EPS는 수신 이벤트 기준으로 계산됩니다.',
      '지연 시간은 heartbeat 또는 metric 이벤트의 latencyMs를 사용합니다.',
      '수신 전에는 지연 시간 값이 비어 있습니다.',
    ],
    backend: [
      'event: heartbeat 또는 event: metric을 보낼 수 있습니다.',
      'data.latencyMs를 보내면 지연 시간 카드가 갱신됩니다.',
      'data.totalEvents를 보내면 총 이벤트 수를 서버 기준으로 동기화할 수 있습니다.',
    ],
  },
  raw_console: {
    title: '원시 이벤트 콘솔',
    frontend: [
      '수신한 원문 데이터를 그대로 표시합니다.',
      '최대 로그 크기 옵션(100/300/500)을 넘기면 오래된 로그를 제거합니다.',
      '자동 스크롤과 스트림 일시 중지 옵션을 제공합니다.',
    ],
    backend: [
      'SSE data는 JSON 문자열 형태로 보내야 파싱/시각화가 가능합니다.',
      '권장 data 필드: timestamp, runId',
      '파싱 불가 데이터는 콘솔에 남고 파싱 오류 알람이 표시됩니다.',
    ],
  },
  controls: {
    title: '제어 패널 액션 버튼',
    frontend: [
      '각 액션 버튼은 입력한 API URL로 POST 요청을 전송합니다. (상대경로 또는 절대 URL)',
      '액션 요청 Body(JSON) 입력 시 Content-Type: application/json으로 전송합니다.',
      '요청 실패 시 알람에 오류 메시지가 표시됩니다.',
      '성공 응답은 별도 더미 알람을 만들지 않고 실제 SSE 이벤트를 기다립니다.',
    ],
    backend: [
      'POST /api/lab/start, /api/lab/alert, /api/lab/error, /api/lab/reset 엔드포인트를 준비합니다.',
      '액션 처리 후 필요한 SSE 이벤트를 stream으로 발행해야 UI가 갱신됩니다.',
      '예: /start 호출 후 stage_update(queued->build...) 이벤트 순차 발행',
    ],
  },
}
