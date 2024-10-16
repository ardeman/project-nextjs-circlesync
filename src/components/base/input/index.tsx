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
    LeftNode,
    RightNode,
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
            {LeftNode && (
              <LeftNode className="text-muted-foreground absolute left-3.5 h-4 w-4 hover:cursor-pointer" />
            )}
            <FormControl>
              <UIInput
                id={id}
                type={type}
                className={cn(
                  LeftNode && 'pl-10',
                  RightNode && 'pr-10',
                  inputClassName
                )}
                onClick={onClick}
                {...field}
                {...rest}
              />
            </FormControl>
            {RightNode && (
              <RightNode className="text-muted-foreground absolute right-3.5 h-4 w-4 hover:cursor-pointer" />
            )}
          </div>
          {hint && <FormDescription>{hint}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
