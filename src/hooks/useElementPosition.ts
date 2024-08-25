import { RefObject, useEffect, useState } from 'react'

export const useElementPosition = (ref: RefObject<HTMLDivElement>) => {
  const [position, setPosition] = useState(0)

  const handleScroll = () => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setPosition((rect.y + rect.height / 2) / window.innerHeight - 0.5)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return { position }
}
