import { forwardRef } from "react"

export const Input = forwardRef((props, ref) => {
  return (
    <Input type="text" className="bg-zinc-800 px-3 py-2 block my-2 w-full"
    {...props} ref=(ref)/>
  )
})


export default imput