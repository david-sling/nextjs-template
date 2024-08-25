import { useEffect, useRef, useState } from 'react'

export const useDeferredValue = <T>(
  value: T,
  timeoutMs = 200,
  deps?: any[],
): T => {
  const [deferredValue, setDeferredValue] = useState(value)
  const timeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timeout.current !== null) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setDeferredValue(value), timeoutMs)
  }, [...(deps ?? [value]), timeoutMs])

  return deferredValue
}
