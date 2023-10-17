"use client"

import { useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-9xl font-bold">404</h3>
        <p>Oh no, something went wrong... maybe refresh?</p>
      </div>
      <div className="flex flex-row gap-4">
        <Button
          disabled={isPending}
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
        <Button
          disabled={isPending}
          variant={"secondary"}
          onClick={() => {
            startTransition(() => {
              router.push("/")
            })
          }}
        >
          {isPending ? "Going" : "Go "} to Home
        </Button>
      </div>
    </div>
  )
}
