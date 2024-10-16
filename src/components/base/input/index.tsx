import { useId } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input as UIInput,
} from '@/components/ui'
import { cn } from '@/utils'

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
    onClick,
    hint,
    className,
    containerClassName,
    inputClassName,
    labelClassName,
    required,
    leftNode,
    rightNode,
    ...rest
  } = props
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('space-y-1', className)}>
          {label && (
            <FormLabel
              htmlFor={id}
              className={cn(labelClassName)}
            >
              {label} {required && <sup className="text-red-500">*</sup>}
            </FormLabel>
          )}
          <div className={cn('relative flex items-center', containerClassName)}>
            {leftNode && (
              <div className="text-muted-foreground absolute left-2.5 hover:cursor-pointer">
                {leftNode}
              </div>
            )}
            <FormControl>
              <UIInput
                id={id}
                type={type}
                className={cn('pr-10', inputClassName)}
                onClick={onClick}
                {...field}
                {...rest}
              />
            </FormControl>
            {rightNode && (
              <div className="text-muted-foreground absolute right-2.5 hover:cursor-pointer">
                {rightNode}
              </div>
            )}
          </div>
          {hint && <FormDescription>{hint}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
