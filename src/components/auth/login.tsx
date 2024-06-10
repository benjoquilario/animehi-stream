"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  Credentials,
  credentialsValidator,
} from "@/lib/validations/credentials"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { useAuthStore } from "@/store"
import { login } from "@/server/auth"

const Login = () => {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>(undefined)
  const [isPending, startTransition] = useTransition()
  const form = useForm<Credentials>({
    resolver: zodResolver(credentialsValidator),
  })
  const setIsAuthOpen = useAuthStore((store) => store.setIsAuthOpen)

  function handleOnSubmit(values: Credentials) {
    startTransition(() => {
      login(values).then((data) => {
        if (data.ok) {
          setIsAuthOpen(false)
          toast.success("Signed in successfully")
          router.refresh()
          toast.dismiss()
        }

        if (data.error) {
          setError(data.error)
        }
      })
    })
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
                  <Input disabled={isPending} placeholder="Email" {...field} />
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
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-3 text-destructive">{error}</div>
        <DialogFooter className="mt-4">
          <Button disabled={isPending} type="submit">
            Sign In
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export default Login
