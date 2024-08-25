import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'

import { AnySchema } from 'yup'

import { useAsyncMemo } from './useAsyncMemo'
import { useDeferredValue } from './useDeferredValue'
import { useLocalStorage } from './useLocalStorage'

interface Props<Data> {
  initialValue: Data
  storeLocal?: string
  schema?: AnySchema
}

export type Validated<Errors extends string | number | symbol> = {
  isValid: boolean
  errors?: Partial<Record<Errors, string>> | null
}

export const validateAsync = async <
  Data extends {},
  Errors extends string | number | symbol = '',
>(
  data: Data,
  schema: AnySchema,
): Promise<Validated<keyof Data | Errors>> => {
  try {
    await schema.validate(data, { abortEarly: false })
    return { isValid: true }
  } catch (error: any) {
    if (error.inner) {
      return {
        errors: error.inner.reduce((acc: any, curr: any) => {
          acc[curr.path || curr.type] = curr.message
          return acc
        }, {}),
        isValid: false,
      }
    }
    return { errors: null, isValid: false }
  }
}
export const validate = <
  Data extends {},
  Errors extends string | number | symbol = '',
>(
  data: Data,
  schema: AnySchema,
): Validated<keyof Data | Errors> => {
  try {
    schema.validateSync(data, { abortEarly: false })
    return { isValid: true }
  } catch (error: any) {
    if (error.inner) {
      return {
        errors: error.inner.reduce((acc: any, curr: any) => {
          acc[curr.path || curr.type] = curr.message
          return acc
        }, {}),
        isValid: false,
      }
    }
    return { errors: null, isValid: false }
  }
}
export type SetFormData<Data> = (
  key: keyof Data,
  value: Data[keyof Data],
) => void
export type Register<Data, T = any> = (key: keyof Data) => Registered<T>
export interface Registered<T> {
  value: T
  onChange: (value: T) => void | Promise<void>
  isTouched?: boolean
  error?: string | undefined
}
export type Touched<Data> = Partial<Record<keyof Data, boolean>>
export type Touch<Data> = (keys: (keyof Data)[]) => void

export const useForm = <
  Data extends {},
  Errors extends string | number | symbol = keyof Data,
>({
  initialValue,
  storeLocal,
  schema,
}: Props<Data>): FormProps<Data, Errors> => {
  const [formData, setData] = useLocalStorage<Data>(
    storeLocal ?? '',
    initialValue,
  )
  const data = formData ?? initialValue
  const [touched, setTouched] = useState<Touched<Data>>({})
  const touch: Touch<Data> = keys =>
    setTouched(p => ({
      ...p,
      ...keys.reduce((acc, curr) => ({ ...acc, [curr]: true }), {}),
    }))

  const deferredData = useDeferredValue(data, 300)
  const [{ errors, isValid }] = useAsyncMemo<
    Validated<Errors>,
    Validated<Errors>
  >(
    () =>
      schema
        ? validateAsync<Data, Errors>(deferredData, schema)
        : { errors: {}, isValid: true },
    [deferredData, schema],
    { defaultValue: { errors: {}, isValid: false } },
  )
  const setValue: SetFormData<Data> = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }))
  }
  const register: Register<Data> = useMemo(
    () => name => {
      return {
        value: data[name],
        onChange: value => setValue(name, value),
        isTouched: !!touched[name],
        error: errors?.[name as unknown as Errors],
      }
    },
    [errors, data, touched],
  )
  const reset = (override?: Partial<Data>) => {
    setData({ ...initialValue, ...(override ?? {}) })
    setTouched({})
  }
  const touchAll = () => {
    setTouched(
      Object.keys(initialValue).reduce(
        (acc, curr) => ({ ...acc, [curr]: true }),
        {},
      ),
    )
  }
  return {
    data: data ?? initialValue,
    register,
    touch,
    touched,
    errors,
    setData,
    setTouched,
    isValid,
    setValue,
    reset,
    touchAll,
  }
}

interface FormProps<
  Data extends {},
  Errors extends string | number | symbol = keyof Data,
> {
  data: Data
  register: Register<Data, any>
  touch: Touch<Data>
  touchAll: () => void
  touched: Partial<Record<keyof Data, boolean>>
  errors: Partial<Record<Errors, string>> | null | undefined
  setData: Dispatch<SetStateAction<Data>>
  setTouched: Dispatch<SetStateAction<Partial<Record<keyof Data, boolean>>>>
  isValid: boolean
  setValue: SetFormData<Data>
  reset: (override?: Partial<Data> | undefined) => void
}

export const FormContext = createContext<FormProps<any>>(null as any)

export const useFormContext = <Data extends {}>() =>
  useContext<FormProps<Data>>(FormContext as any)

export const FormProvider = <
  Data extends {},
  Errors extends string | number | symbol = keyof Data,
>({
  children,
  ...props
}: FormProps<Data, Errors> & {
  children?: ReactNode
}) => <FormContext.Provider value={props}>{children}</FormContext.Provider>

export const Form = <
  Data extends {},
  Errors extends string | number | symbol = keyof Data,
>({
  children,
  ...props
}: Props<Data> & { children: ReactNode }) => {
  const formProps = useForm<Data, Errors>(props)
  return <FormProvider {...formProps}>{children}</FormProvider>
}
