import { useMaster } from "@/hooks/useMaster";
import { MasterListItem } from "./masterListItem";

export default function MasterList() {
  const { masters, loadingMaster } = useMaster();
  
  return (
    <ul className="divide-y divide-gray-200 rounded-xl border">
      {loadingMaster ? (
        <MasterListSkeleton />
      ) : loadingMaster ? <MasterListSkeleton /> : masters.map((m) => (
        <MasterListItem {...m}/>
      ))} 
    </ul>
  );
}

function MasterListSkeleton() {
  return [1,2,3,4,5,6].map((key) => {
    return <li className="flex items-center justify-between p-4 animate-pulse" key={key}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 bg-pink-300 rounded-full" />
              <div className="h-4 bg-gray-300 rounded w-24" />
            </div>
            <div className="flex items-center gap-1 text-sm">
              <div className="w-3 h-3 bg-gray-300 rounded-full" />
              <div className="h-3 bg-gray-300 rounded w-20" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded" />
            <div className="w-8 h-8 bg-gray-300 rounded" />
          </div>
        </li>
  })
}
