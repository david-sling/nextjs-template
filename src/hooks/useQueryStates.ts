/* eslint-disable react-hooks/rules-of-hooks */

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

const decode = (str: string) =>
  decodeURI(str)
    .replaceAll('%2C', ',')
    .replaceAll('%20', ' ')
    .replaceAll('+', ' ')

const parse = (str: string): unknown => {
  try {
    return JSON.parse(decode(str))
  } catch (error) {
    return decode(str)
  }
}
const stringify = (v: unknown) => {
  try {
    return typeof v === 'string' ? v : JSON.stringify(v)
  } catch (error) {
    return ''
  }
}

export type SetQuery<T> = (v: Partial<T>, o?: Options) => void

interface Options {
  isPush?: boolean
  scroll?: boolean
  noServer?: boolean
}

export const useQueryStates = <T>(
  initialValue: T,
  options: Options = {},
): [T, SetQuery<T>] => {
  const { push, replace } = useRouter()
  const pathname = usePathname()
  const searchParams =
    options.noServer && typeof window === 'undefined' ? null : useSearchParams()
  const params = searchParams?.toString() ?? ''
  const query = useMemo(
    () =>
      params
        .split('&')
        .map(i => i.split('='))
        .reduce((acc, [key, value]) => {
          const parsed = parse(value)
          return {
            ...acc,
            [key]:
              typeof initialValue[key as keyof T] === 'string' ? value : parsed,
          }
        }, initialValue),
    [params],
  )
  const setQuery: SetQuery<T> = (v, o = {}) => {
    const { isPush = false, scroll = false } = { ...options, ...o }
    const newQuery = {
      ...query,
      ...v,
    }
    const newParams = Object.entries(newQuery)
      .map(([key, value]) => [key, stringify(value)].join('='))
      .join('&')
    const newRoute = [pathname, newParams].join('?')
    const redirect = isPush ? push : replace
    redirect(newRoute, { scroll })
  }
  return [query, setQuery]
}
