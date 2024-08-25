import { useState, useEffect } from 'react'

interface WindowSize {
  width: number | undefined
  height: number | undefined
}

function useWindowSize(): WindowSize {
  // Initialize state with undefined to accommodate server-side rendering
  const [size, setSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    // Handler to call on window resize
    function updateSize() {
      // Set window size
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Set initial size
    updateSize()

    // Bind the event listener
    window.addEventListener('resize', updateSize)
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', updateSize)
  }, []) // Empty array ensures that effect is only run on mount and unmount

  return size
}

export default useWindowSize
