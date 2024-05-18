"use client"

import { useEffect, useState, useCallback, useTransition } from "react"
import { Button } from "./ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { AiOutlineSearch } from "react-icons/ai"
import { cn, extractId } from "@/lib/utils"
import { Search } from "types/types"
import { useDebounce } from "@/hooks/useDebounce"
import { useRouter } from "next/navigation"
import {
  AiOutlineArrowUp,
  AiOutlineArrowDown,
  AiOutlineEnter,
} from "react-icons/ai"

export default function Combobox() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState<Search[] | null>(null)
  const debouncedQuery = useDebounce(query, 300)
  const router = useRouter()

  useEffect(() => {
    if (debouncedQuery.length === 0) setSearch([])

    if (debouncedQuery.length > 0) {
      startTransition(async () => {
        const res = await fetch(
          `${process.env.ANIME_API_URI}/anime/anify/${debouncedQuery}`
        )
        if (!res.ok) setSearch(null)

        const data = (await res.json()) as Search[]
        setSearch(data)

        console.log(data)
      })
    }
  }, [debouncedQuery])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((isOpen) => !isOpen)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSelect = useCallback((callback: () => unknown) => {
    setIsOpen(false)
    callback()
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setQuery("")
    }
  }, [isOpen])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setIsOpen(true)}
        aria-label="Search anime"
      >
        <AiOutlineSearch className="h-6 w-6" />
        <span className="hidden xl:inline-flex">Search anime...</span>
        <span className="sr-only">Search anime</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </Button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Search anime..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="mb-10">
          <CommandEmpty
            className={cn(isPending ? "hidden" : "py-6 text-center text-sm")}
          >
            No anime found.
          </CommandEmpty>
          {isPending ? (
            <div>Loading...</div>
          ) : search ? (
            <CommandGroup className="z-[99999]">
              {search?.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.title}
                  onSelect={() =>
                    handleSelect(() => {
                      startTransition(() => {
                        setQuery("")
                        router.push(
                          `${extractId(item.mappings)}/${item.anilistId}/1`
                        )
                      })
                    })
                  }
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="mr-4 h-14 w-10 rounded-sm"
                  />
                  <div className="flex flex-col justify-center">
                    <h3 className="text-sm font-medium leading-none">
                      {item.title}
                    </h3>
                    <p className="text-xs leading-none text-muted-foreground">
                      {item.releaseDate}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
          <div className="fixed bottom-[-2px] left-0 right-0 flex items-center gap-1 bg-background p-3 text-muted-foreground/80">
            <div className="flex flex-col">
              <div className="flex w-4 flex-col items-center justify-center rounded-md border p-0.5">
                <AiOutlineArrowUp className="h-2 w-2" />
              </div>
              <div className="h-1 w-4 border-x border-b"></div>
            </div>
            <div className="flex flex-col">
              <div className="flex w-4 flex-col items-center justify-center rounded-md border p-0.5">
                <AiOutlineArrowDown className="h-2 w-2" />
              </div>
              <div className="h-1 w-4 border-x border-b"></div>
            </div>
            <div className="text-xs">to navigate</div>
            <div className="ml-2 flex flex-col">
              <div className="flex w-4 flex-col items-center justify-center rounded-md border p-0.5">
                <AiOutlineEnter className="h-2 w-2" />
              </div>
              <div className="h-1 w-4 border-x border-b"></div>
            </div>
            <div className="text-xs">to select</div>

            <div className="ml-2 flex flex-col">
              <div className="flex w-4 flex-col items-center justify-center rounded-md border p-0.5 text-[7px]">
                ESC
              </div>
              <div className="h-1 w-4 border-x border-b"></div>
            </div>
            <div className="text-xs">to exit</div>
          </div>
        </CommandList>
      </CommandDialog>
    </>
  )
}
