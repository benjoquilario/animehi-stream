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
import { useTransition, useState } from "react"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { useAuthStore } from "@/store"
import { login } from "@/server/auth"

const Login = () => {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>(undefined)
  const [isPending, startTransition] = useTransition()
  const [isAnilistLoading, startTransitionAnilist] = useTransition()
  const form = useForm<Credentials>({
    resolver: zodResolver(credentialsValidator),
  })
  const setIsAuthOpen = useAuthStore((store) => store.setIsAuthOpen)

  function handleOnSubmit(values: Credentials) {
    startTransition(() => {
      login(values).then((data) => {
        if (data.ok) {
          window.location.reload()
          setIsAuthOpen(false)
          toast.success("Signed in successfully")
        }

        if (data?.error) {
          setError(data?.error)
        }
      })
    })

    toast.dismiss()
  }

  return (
    <>
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
                      type="email"
                      disabled={isPending}
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
            <div className="flex w-full flex-col items-center gap-1 md:flex-row">
              <Button
                className="w-full"
                disabled={isPending || isAnilistLoading}
                type="submit"
              >
                Sign In
              </Button>
              <span className="text-xs text-muted-foreground/80">or</span>
              {/* <Button
                disabled={isAnilistLoading || isPending}
                type="button"
                className="w-full"
                onClick={() => {
                  startTransitionAnilist(async () => {
                    await loginAnilist().then(() =>
                      toast.success("Signed in successfully")
                    )
                  })
                }}
              >
                Sign In with Anilist
              </Button> */}
            </div>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}

export default Login
