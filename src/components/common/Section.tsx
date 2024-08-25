import { cn } from '@/utils/cn'
import React, { FC } from 'react'

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  innerClassName?: string
}

export const Section: FC<Props> = ({
  children,
  className,
  innerClassName,
  ...props
}) => (
  <div
    {...props}
    className={cn(
      'flex items-center justify-center px-5 md:px-10 lg:px-20',
      className,
    )}
  >
    <div className={cn('w-full max-w-7xl', innerClassName)}>{children}</div>
  </div>
)
