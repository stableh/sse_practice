# SSE Practice Lab

SSE(Server-Sent Events) 실습을 위한 프론트엔드 대시보드입니다.  
왼쪽에서 실시간 결과(알람, 파이프라인, 지표, 원시 이벤트)를 보고, 오른쪽 제어 패널에서 SSE 구독 및 백엔드 액션 요청을 테스트할 수 있습니다.

## 주요 기능

- SSE 연결/해제 및 상태 표시 (`연결됨`, `연결 중`, `오류`, `연결 끊김`)
- 이벤트 타입별 UI 반영
  - `notify` -> 알람
  - `stage_update` -> 파이프라인 단계
  - `metric` -> 실시간 지표
  - `heartbeat` -> 연결 상태/지연 추적
- 원시 이벤트 콘솔 + 자동 스크롤/일시중지/최대 로그 크기
- 액션 API URL 개별 편집
  - 파이프라인 시작
  - 테스트 알람 전송
  - 오류 시뮬레이션
  - 세션 초기화
- 액션 요청 Body(JSON) 입력 지원

## 실행 방법

```bash
npm install
npm run dev
```

기본 개발 서버: `http://localhost:5173`

## SSE 구독 URL

제어 패널의 기본 SSE URL은 아래로 설정되어 있습니다.

```text
http://localhost:8080/api/sse/sub/c1
```

필요하면 UI에서 직접 수정할 수 있습니다.

## SSE 이벤트 규약

이 프로젝트는 **SSE 표준 방식(event 필드)** 으로 이벤트 타입을 구분합니다.

### 1) notify

```text
event: notify
data: {"level":"info","message":"알림 메시지","runId":"c1"}

```

- `level`: `info | success | warn | error`
- `message`: 문자열

### 2) stage_update

```text
event: stage_update
data: {"stage":"build","status":"running","runId":"c1"}

```

- `stage`: `queued | build | test | deploy | done`
- `status`: `pending | running | success | error`

### 3) metric

```text
event: metric
data: {"totalEvents":12,"latencyMs":84}

```

### 4) heartbeat

```text
event: heartbeat
data: {"latencyMs":80}

```

## 백엔드 체크리스트

- SSE 엔드포인트가 `Content-Type: text/event-stream`으로 응답
- 이벤트는 반드시 빈 줄(`\n\n`)로 종료
- CORS에서 프론트 주소(`http://localhost:5173`) 허용
- 연결 유지를 위해 heartbeat 주기 전송 권장

## 액션 API 호출 규칙

제어 패널 액션 버튼은 입력한 URL로 `POST` 요청을 보냅니다.

- 상대경로: 현재 SSE URL의 origin 기준으로 해석
- 절대경로: 그대로 호출
- Body(JSON) 입력 시 `Content-Type: application/json`으로 전송

예시 Body:

```json
{
  "clientId": "c1",
  "message": "테스트 알림"
}
```

## 프로젝트 구조

```text
src/
  components/sse/        # 화면 컴포넌트
  hooks/sse/             # 도메인별 상태 훅(연결/알람/파이프라인/지표/콘솔)
  hooks/useSseLab.ts     # 오케스트레이션 훅
  data/sseGuides.ts      # 정보 모달 가이드 데이터
  types/sse.ts           # 타입 정의
  utils/sseHelpers.ts    # 공용 헬퍼
```

## 빌드

```bash
npm run build
npm run preview
```
