import { cn } from '@/utils/cn'
import * as React from 'react'
import { SVGProps, Ref, forwardRef, memo } from 'react'
const SvgComponent = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={9}
    viewBox="0 0 14 9"
    fill="#6A6A6A"
    ref={ref}
    {...props}
    className={cn('fill-[#6A6A6A] stroke=[#6A6A6A]', props.className)}
  >
    <path
      fill="inherit"
      stroke="inherit"
      strokeWidth={0.197}
      d="M1.191 1.259a.99.99 0 0 0 0 1.399l5.038 5.038a.99.99 0 0 0 1.399 0l5.038-5.038.001-.001a.99.99 0 0 0-1.399-1.4v.002l-4.34 4.339L2.59 1.259a.99.99 0 0 0-1.399 0Z"
    />
  </svg>
)
const ForwardRef = forwardRef(SvgComponent)
const Memo = memo(ForwardRef)
export { Memo as ChevronDown }
