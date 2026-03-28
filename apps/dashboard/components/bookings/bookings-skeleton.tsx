import { Skeleton } from "@workspace/ui/components/skeleton"

export function BookingsSkeleton() {
  return (
    <div className="flex-1 overflow-auto p-6">
      <Skeleton className="mb-4 h-10 w-full rounded-xl" />
      <Skeleton className="mb-6 h-8 w-48 rounded-lg" />
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}
