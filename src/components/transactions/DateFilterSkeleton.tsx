import { Skeleton } from "@/components/ui/skeleton";

export default function DateFilterSkeleton() {
  return (
    <div className="space-y-3">
      {/* Mobile skeleton*/}
      <div className="lg:hidden space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="flex-1">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-[44px] rounded-md shrink-0" />
          ))}
        </div>
      </div>

      {/* Desktop skeleton */}
      <div className="hidden lg:flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>

        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-12 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
