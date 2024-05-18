"use client" // Error components must be Client Components

import { useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="relative flex h-[450px] w-full flex-col items-center justify-center bg-background px-[2%] md:h-[500px]">
      <h2 className="text-center text-2xl text-destructive md:text-6xl">
        Something went wrong!...maybe refresh?
      </h2>
      <div className="mt-4 flex flex-row gap-4">
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
