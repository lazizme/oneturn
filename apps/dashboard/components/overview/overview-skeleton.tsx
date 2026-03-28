import { Skeleton } from "@workspace/ui/components/skeleton"

export function OverviewSkeleton() {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mb-8 grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[120px] rounded-xl" />
        ))}
      </div>
      <div className="mb-8 grid grid-cols-5 gap-6">
        <Skeleton className="col-span-3 h-[320px] rounded-xl" />
        <Skeleton className="col-span-2 h-[320px] rounded-xl" />
      </div>
      <div className="grid grid-cols-5 gap-6">
        <Skeleton className="col-span-3 h-[300px] rounded-xl" />
        <Skeleton className="col-span-2 h-[300px] rounded-xl" />
      </div>
    </div>
  )
}
