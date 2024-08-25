'use client'

import { Registered } from '@/hooks/useForm'
import { FC, HTMLAttributes, Ref } from 'react'
import { ErrorMessage } from './ErrorMessage'
import { cn } from '@/utils/cn'
import { Button } from '../common/Button'

interface Props extends Registered<string> {
  placeholder?: string
  multiline?: boolean
  Icon1?: JSX.Element
  size?: 1 | 3 | 5
  className?: string
  innerClassName?: string
  type?: 'text' | 'password' | 'email' | 'number'
  name?: string
  hideError?: boolean
  highlightErrorState?: boolean
  inputRef?: Ref<HTMLInputElement>
  autoFocus?: boolean
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode']
  label?: string
  required?: boolean
  isLive?: boolean
}

export const TextField: FC<Props> = ({
  onChange,
  value,
  placeholder,
  multiline,
  error,
  isTouched,
  Icon1,
  size = 5,
  className,
  innerClassName,
  type = 'text',
  name,
  hideError,
  highlightErrorState,
  inputRef,
  autoFocus,
  inputMode,
  label,
  required,
  isLive,
}) => {
  const Input = multiline ? 'textarea' : 'input'
  return (
    <div className={cn('rounded-[10px]', className)}>
      {label && (
        <div className="flex items-center mb-2">
          <p className="font-semibold">
            {required && <span className="text-red-500">* </span>}
            {label}
          </p>
        </div>
      )}
      <div
        className={cn(
          'flex items-center rounded-[10px] border',
          innerClassName,
          highlightErrorState && error && isTouched && 'border-tm-red',
          error && isTouched ? 'border-red-500 bg-red-50' : '',
        )}
      >
        {Icon1 && (
          <div className="ml-3 flex items-center justify-center">{Icon1}</div>
        )}
        <Input
          ref={inputRef as any}
          inputMode={inputMode}
          value={value}
          autoFocus={autoFocus}
          type={type}
          onChange={e => {
            onChange?.(e.target.value)
          }}
          className={cn(
            'flex-1 p-5 bg-transparent',
            multiline
              ? 'min-h-[200px] h-[200px]'
              : [
                  size === 5 && 'h-14',
                  size === 3 && 'h-7',
                  size === 1 && 'h-5',
                ],
          )}
          placeholder={placeholder}
          name={name}
        />
        {isLive && (
          <Button
            className="mr-3 px-4 py-2 text-base"
            color="primary"
            type="submit"
          >
            Join Now
          </Button>
        )}
      </div>
      {!hideError && <ErrorMessage isTouched={isTouched} error={error} />}
    </div>
  )
}
