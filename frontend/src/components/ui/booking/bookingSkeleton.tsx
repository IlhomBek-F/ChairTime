import { Skeleton } from "../skeleton";

export function BookingSkeleton() {
  return [1, 2, 3].map((key) => (
    <div key={key} className="mb-4">
      <Skeleton className="h-[140px] w-full rounded-2xl shadow-sm">
        <div className="p-4 flex justify-between items-center">
          {/* Left info (like card content) */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-[18px] w-[180px] rounded-md bg-gray-300" />
            <Skeleton className="h-[16px] w-[140px] rounded-md bg-gray-300" />
            <Skeleton className="h-[16px] w-[120px] rounded-md bg-gray-300" />
          </div>

          {/* Right action buttons (placeholder circles) */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-9 w-9 rounded-full bg-gray-300" />
            <Skeleton className="h-9 w-9 rounded-full bg-gray-300" />
          </div>
        </div>
      </Skeleton>
    </div>
  ));
}

