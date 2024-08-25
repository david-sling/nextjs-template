import * as React from 'react'
import { SVGProps, Ref, forwardRef, memo } from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

const SvgComponent = (
  { title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
  ref: Ref<SVGSVGElement>,
) => (
  <svg
    width={20}
    height={19}
    viewBox="0 0 20 19"
    fill="none"
    stroke="#636363"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M18.507 17.845 14.568 13.9m2.183-5.273a7.462 7.462 0 1 1-14.925 0 7.462 7.462 0 0 1 14.925 0v0Z"
      stroke="inherit"
      strokeWidth={1.756}
      strokeLinecap="round"
    />
  </svg>
)

const ForwardRef = forwardRef(SvgComponent)
const SearchIcon = memo(ForwardRef)
export default SearchIcon as typeof ForwardRef
