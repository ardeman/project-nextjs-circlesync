import { Eye, EyeClosed } from 'lucide-react'
import { useId, useState } from 'react'
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
    ...rest
  } = props
  const { control } = useFormContext()
  const [newType, setNewType] = useState(type)

  const toggleEye = () => {
    setNewType((prev) => (prev === 'password' ? 'text' : 'password'))
  }

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
            <FormControl>
              <UIInput
                id={id}
                type={newType}
                className={cn('pr-10', inputClassName)}
                onClick={onClick}
                {...field}
                {...rest}
              />
            </FormControl>
            {type === 'password' &&
              (newType === 'password' ? (
                <EyeClosed
                  className="text-muted-foreground absolute right-3.5 h-4 w-4 hover:cursor-pointer"
                  onClick={toggleEye}
                />
              ) : (
                <Eye
                  className="text-muted-foreground absolute right-3.5 h-4 w-4 hover:cursor-pointer"
                  onClick={toggleEye}
                />
              ))}
          </div>
          {hint && <FormDescription>{hint}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
