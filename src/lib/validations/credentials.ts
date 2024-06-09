import * as z from "zod"

export const credentialsValidator = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(4, {
    message: "Password is required",
  }),
})

export const registerValidator = credentialsValidator
  .extend({
    userName: z.string().min(4),
    confirmPassword: z.string().min(4, {
      message: "Password must be at least 4 character",
    }),
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
