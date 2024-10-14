import { useId } from 'react'
import { useFormContext } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

import { TProps } from './type'

export const Input = <TFormValues extends Record<string, unknown>>(
  props: TProps<TFormValues>
) => {
  const generatedId = useId()
  const {
    id = generatedId,
    name,
    label,
    type = 'text',
    rules,
    onClick,
    hint,
    className,
    containerClassName,
    inputClassName,
    leftNode,
    leftNodeClassName,
    rightNode,
    rightNodeClassName,
    required,
    ...rest
  } = props
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const error = errors[name]

  return (
    <div className={twMerge('space-y-1', className)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label} {required && <sup className="text-red-500">*</sup>}
        </label>
      )}
      <div className={twMerge(containerClassName)}>
        {leftNode && (
          <div className={twMerge(leftNodeClassName)}>{leftNode}</div>
        )}
        <input
          id={id}
          type={type}
          className={twMerge(
            'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200',
            inputClassName
          )}
          onClick={onClick}
          {...register(name, rules)}
          {...rest}
        />
        {rightNode && (
          <div className={twMerge(rightNodeClassName)}>{rightNode}</div>
        )}
      </div>
      {hint && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error?.message?.toString()}
        </p>
      )}
    </div>
  )
}
