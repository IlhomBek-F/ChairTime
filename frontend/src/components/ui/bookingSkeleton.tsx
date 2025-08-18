import { Skeleton } from "./skeleton";

export function BookingSkeleton() {
  return [1, 2, 3].map((key) => {
    return <div key={key} className="mb-2">
      <Skeleton className="h-[160px]  rounded-xl bg-[#e8e8e8]">
        <div className="p-6">
          <Skeleton className="h-[20px] mb-3 w-[240px] rounded-md bg-[#cacaca]" />
          <Skeleton className="h-[18px] mb-3 w-[200px] rounded-md bg-[#cacaca]" />
          <Skeleton className="h-[18px] mb-3 w-[160px] rounded-md bg-[#cacaca]" />
          <Skeleton className="h-[18px] w-[140px]  rounded-md bg-[#cacaca]" />
        </div>
      </Skeleton>
    </div>;
  });
}
