"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "../ui/skeleton"

function RowSkeleton() {
  return (
    <div className="mt-4">
      <Carousel
        opts={{
          align: "start",
        }}
        className="relative w-full"
      >
        <CarouselContent className="relative ml-2 md:ml-5">
          {Array.from({ length: 20 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-[155px] md:basis-[185px]"
            >
              <div className="flex flex-col gap-2">
                <Skeleton className="h-[194px] w-[139px] md:h-[236px] md:w-[169px]" />
                <Skeleton className="h-[30px] w-[139px] md:w-[169px]" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export default RowSkeleton
