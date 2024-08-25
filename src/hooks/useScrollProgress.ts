'use client'

import { useEffect, useState, RefObject } from 'react'

const useScrollProgress = (elementRef: RefObject<HTMLElement>) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      if (!elementRef.current) {
        return
      }

      const element = elementRef.current
      const elementRect = element.getBoundingClientRect()
      const scrollTop = window.pageYOffset
      const elementTop = scrollTop + elementRect.top // Element's top relative to the document
      const elementBottom = elementTop + elementRect.height

      const viewportHeight = window.innerHeight
      const totalScroll = elementBottom - viewportHeight
      const currentScroll = Math.max(scrollTop - elementTop, 0)

      // Adjust progress calculation
      const progress = totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0
      setProgress(Math.min(Math.max(progress, 0), 100))
    }

    window.addEventListener('scroll', updateScrollProgress)
    window.addEventListener('resize', updateScrollProgress)

    // Initialize progress on component mount
    updateScrollProgress()

    return () => {
      window.removeEventListener('scroll', updateScrollProgress)
      window.removeEventListener('resize', updateScrollProgress)
    }
  }, [elementRef])

  return progress
}

export default useScrollProgress
