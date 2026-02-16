import { useMemo, useState } from 'react'
import type { AlertItem, AlertLevel } from '../../types/sse'
import { formatClock } from '../../utils/sseHelpers'

export function useAlertsState() {
  const [alerts, setAlerts] = useState<AlertItem[]>([])

  const addAlert = (level: AlertLevel, message: string) => {
    const next: AlertItem = {
      id: crypto.randomUUID(),
      time: formatClock(new Date()),
      level,
      message,
    }
    setAlerts((prev) => [next, ...prev].slice(0, 100))
  }

  const clearAlerts = () => {
    setAlerts([])
  }

  const errorCount = useMemo(() => alerts.filter((item) => item.level === 'error').length, [alerts])

  return {
    alerts,
    addAlert,
    clearAlerts,
    errorCount,
  }
}
