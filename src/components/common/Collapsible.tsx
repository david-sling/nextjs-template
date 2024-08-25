'use client'

import { cn } from '@/utils/cn'
import {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react'

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  collapsed?: boolean
  deps?: unknown[]
}

export const Collapsible: FC<Props> = ({
  collapsed,
  children,
  className,
  deps = [],
  ...props
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = useState<string | undefined>(
    collapsed ? '0' : undefined,
  )

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(collapsed ? '0' : `${contentRef.current.scrollHeight}px`)
    }
  }, [collapsed, children, ...deps])

  return (
    <div
      {...props}
      ref={contentRef}
      className={cn(
        'transition-max-height overflow-hidden duration-500',
        collapsed ? 'max-h-0' : `max-h-${maxHeight}`,
        className,
      )}
      style={{ maxHeight }}
    >
      <div className="w-full">{children}</div>
    </div>
  )
}
