import { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { FieldValues, Path, RegisterOptions } from 'react-hook-form'

export type TProps<TFormValues extends FieldValues> = {
  id?: string
  name: Path<TFormValues>
  label?: string
  type?: string
  onClick?: MouseEventHandler<HTMLInputElement>
  hint?: ReactNode
  maxLength?: number
  leftNode?: ReactNode
  rightNode?: ReactNode
  className?: HTMLAttributes<HTMLInputElement>['className']
  labelClassName?: HTMLAttributes<HTMLLabelElement>['className']
  containerClassName?: HTMLAttributes<HTMLDivElement>['className']
  inputClassName?: HTMLAttributes<HTMLInputElement>['className']
  leftNodeClassName?: HTMLAttributes<HTMLDivElement>['className']
  rightNodeClassName?: HTMLAttributes<HTMLDivElement>['className']
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode']
  rules?: RegisterOptions
}
