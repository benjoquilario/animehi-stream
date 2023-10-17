import * as z from "zod"

export const credentialsValidator = z.object({
  email: z.string().email(),
  password: z.string().min(4),
})

export const registerValidator = credentialsValidator
  .extend({
    userName: z.string().min(4),
    confirmPassword: z.string().min(4),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      })
    }
  })

export type Register = z.infer<typeof registerValidator>
export type Credentials = z.infer<typeof credentialsValidator>
