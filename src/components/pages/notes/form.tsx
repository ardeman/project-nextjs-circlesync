import { TFormProps } from './type'

export const Form = (props: TFormProps) => {
  const { selectedNote } = props
  return <div>Form {selectedNote}</div>
}
