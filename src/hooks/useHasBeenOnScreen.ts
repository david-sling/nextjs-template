import { RefObject, useEffect, useRef, useState } from 'react'

export function useHasBeenOnScreen(ref: RefObject<any>): boolean {
  const [isOnScreen, setIsOnScreen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsOnScreen(true)
    })
  }, [])

  useEffect(() => {
    if (isOnScreen) observerRef?.current?.disconnect()
  }, [isOnScreen])

  useEffect(() => {
    if (ref.current) observerRef?.current?.observe(ref.current)

    return () => {
      observerRef?.current?.disconnect()
    }
  }, [ref])

  return isOnScreen
}
