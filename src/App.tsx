import './App.css'
import AlertsCard from './components/sse/AlertsCard'
import ControlPanel from './components/sse/ControlPanel'
import GuideModal from './components/sse/GuideModal'
import HeaderBar from './components/sse/HeaderBar'
import MetricsCard from './components/sse/MetricsCard'
import PipelineCard from './components/sse/PipelineCard'
import RawEventsCard from './components/sse/RawEventsCard'
import { useSseLab } from './hooks/useSseLab'

function App() {
  const {
    connectionStatus,
    lastReceived,
    runId,
    currentStage,
    stageStatus,
    alerts,
    rawEvents,
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
    totalEvents,
    latencyMs,
    reconnectAttempts,
    errorCount,
    eps,
    heartbeatText,
    rawConsoleRef,
    currentGuide,
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
    setActiveGuide,
    connect,
    disconnect,
    triggerAction,
    resetSession,
  } = useSseLab()

  return (
    <div className="lab-page">
      <HeaderBar
        connectionStatus={connectionStatus}
        lastReceived={lastReceived}
        onOpenGuide={() => setActiveGuide('connection')}
        onConnect={connect}
        onDisconnect={disconnect}
      />

      <main className="main-layout">
        <section className="left-pane">
          <PipelineCard runId={runId} stageStatus={stageStatus} onOpenGuide={() => setActiveGuide('pipeline')} />
          <AlertsCard alerts={alerts} onOpenGuide={() => setActiveGuide('alerts')} />
          <MetricsCard
            totalEvents={totalEvents}
            eps={eps}
            latencyMs={latencyMs}
            heartbeatText={heartbeatText}
            onOpenGuide={() => setActiveGuide('metrics')}
          />
          <RawEventsCard
            rawEvents={rawEvents}
            maxLogSize={maxLogSize}
            rawConsoleRef={rawConsoleRef}
            onOpenGuide={() => setActiveGuide('raw_console')}
          />
        </section>

        <ControlPanel
          sseUrl={sseUrl}
          queryParams={queryParams}
          startApiPath={startApiPath}
          alertApiPath={alertApiPath}
          errorApiPath={errorApiPath}
          resetApiPath={resetApiPath}
          actionBodyText={actionBodyText}
          autoScroll={autoScroll}
          pauseStream={pauseStream}
          maxLogSize={maxLogSize}
          currentStage={currentStage}
          errorCount={errorCount}
          reconnectAttempts={reconnectAttempts}
          setSseUrl={setSseUrl}
          setQueryParams={setQueryParams}
          setStartApiPath={setStartApiPath}
          setAlertApiPath={setAlertApiPath}
          setErrorApiPath={setErrorApiPath}
          setResetApiPath={setResetApiPath}
          setActionBodyText={setActionBodyText}
          setAutoScroll={setAutoScroll}
          setPauseStream={setPauseStream}
          setMaxLogSize={setMaxLogSize}
          onOpenGuide={() => setActiveGuide('controls')}
          onStartPipeline={() => triggerAction(startApiPath)}
          onSendAlert={() => triggerAction(alertApiPath)}
          onSimulateError={() => triggerAction(errorApiPath)}
          onResetSession={resetSession}
        />
      </main>

      {currentGuide ? <GuideModal guide={currentGuide} onClose={() => setActiveGuide(null)} /> : null}
    </div>
  )
}

export default App
