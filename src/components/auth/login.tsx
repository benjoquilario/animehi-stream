"use client"

import { signIn } from "next-auth/react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useRouter } from "next/navigation"
import { Input } from "../ui/input"
import { toast } from "sonner"
import {
  Credentials,
  credentialsValidator,
} from "@/lib/validations/credentials"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Button } from "../ui/button"
import { DialogFooter } from "../ui/dialog"
import { useAuthStore } from "@/store"

const Login = () => {
  const router = useRouter()
  const form = useForm<Credentials>({
    resolver: zodResolver(credentialsValidator),
  })
  const setIsAuthOpen = useAuthStore((store) => store.setIsAuthOpen)

  const { isSubmitSuccessful, isSubmitting } = form.formState

  useEffect(() => {
    if (isSubmitSuccessful) {
      form.reset()
    }
  }, [isSubmitSuccessful, form])

  async function handleOnSubmit({ email, password }: Credentials) {
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (response?.ok) {
      router.refresh()
      setIsAuthOpen(false)
      toast.success("Signed in successfully")
    }

    toast.dismiss()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleOnSubmit)}>
        <div className="flex flex-col gap-3.5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-3.5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Password"
                    type="password"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter className="mt-4">
          <Button disabled={isSubmitting} type="submit">
            Sign In
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export default Login
