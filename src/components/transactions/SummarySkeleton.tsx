import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function SummarySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 mb-6">
      {/* Mobile layout */}
      <div className="lg:hidden">
        <Card className="relative shadow-md text-primary-foreground mb-3 py-0">
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-8 w-36 mt-1 rounded" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-2">
          <Card>
            <CardContent className="p-3 flex items-center justify-between">
              <div className="min-w-0">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-6 w-24 mt-1" />
              </div>
              <Skeleton className="h-6 w-6 rounded-full" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 flex items-center justify-between">
              <div className="min-w-0">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-6 w-24 mt-1" />
              </div>
              <Skeleton className="h-6 w-6 rounded-full" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex gap-4 lg:flex-row lg:col-span-3 justify-start items-center">
        <Card className="w-64">
          <CardContent className="px-4 py-1 flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32 mt-1" />
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </CardContent>
        </Card>

        <Card className="w-64">
          <CardContent className="px-4 py-1 flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-28 mt-1" />
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </CardContent>
        </Card>

        <Card className="w-64">
          <CardContent className="px-4 py-1 flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-28 mt-1" />
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
