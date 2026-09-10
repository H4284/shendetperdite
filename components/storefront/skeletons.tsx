import { Skeleton } from "@/components/ui/skeleton";

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-9 w-64" />
      <ProductGridSkeleton />
    </div>
  );
}

export function ProductPageLoading() {
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-11 w-48" />
      </div>
    </div>
  );
}

export function HomeLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-[320px] w-full md:h-[420px]" />
      <div className="mx-auto max-w-7xl px-4">
        <ProductGridSkeleton count={4} />
      </div>
    </div>
  );
}
