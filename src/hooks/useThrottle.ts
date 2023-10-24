import { useEffect, useRef } from "react"

type AnyToVoidFunction = (...args: any[]) => void

export function useThrottle<F extends AnyToVoidFunction>(
  fn: F,
  delay: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): F {
  const { leading = true, trailing = true } = options
  const timeoutRef = useRef<number | undefined>()
  const savedArgsRef = useRef<any[]>([])
  const isPendingRef = useRef<boolean>(false)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return ((...args: Parameters<F>) => {
    savedArgsRef.current = args

    if (!isPendingRef.current) {
      if (leading) {
        isPendingRef.current = true
        fn(...savedArgsRef.current)
      }

      if (trailing) {
        timeoutRef.current = window.setTimeout(() => {
          isPendingRef.current = false
          if (savedArgsRef.current.length > 0) {
            fn(...savedArgsRef.current)
            savedArgsRef.current = []
          }
        }, delay)
      }
    }
  }) as F
}
