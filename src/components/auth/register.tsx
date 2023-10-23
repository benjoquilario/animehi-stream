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
import {
  Register as RegisterT,
  registerValidator,
} from "@/lib/validations/credentials"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Button } from "../ui/button"
import { DialogFooter } from "../ui/dialog"
import { useAuthStore } from "@/store"

const Register = () => {
  const router = useRouter()
  const form = useForm<RegisterT>({
    resolver: zodResolver(registerValidator),
  })
  const setIsAuthOpen = useAuthStore((store) => store.setIsAuthOpen)

  const { isSubmitSuccessful, isSubmitting } = form.formState

  useEffect(() => {
    if (isSubmitSuccessful) {
      form.reset()
    }
  }, [isSubmitSuccessful, form])

  async function handleOnSubmit({
    email,
    password,
    confirmPassword,
    userName,
  }: RegisterT) {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        email,
        password,
        confirmPassword,
      }),
    })

    if (res.ok) {
      console.log("Success")
      router.refresh()
      setIsAuthOpen(false)
    }

    if (!res.ok) return console.log("Something went wrong!")
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
                    placeholder="Email"
                    disabled={isSubmitting}
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
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
                    disabled={isSubmitting}
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
        <div className="flex flex-col gap-3.5">
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm Password"
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
            Sign Up
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export default Register
