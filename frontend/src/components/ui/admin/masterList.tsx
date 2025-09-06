import { useMaster } from "@/hooks/useMaster";
import { MasterListItem } from "./masterListItem";
import { ListSkeleton } from "./listSkeleton";
import { useState } from "react";
import { deleteMaster } from "@/api/master";
import { toast } from "sonner";
import { toastError } from "@/lib/utils";

export default function MasterList() {
  const { masters, loadingMaster } = useMaster();
  const [deletingItemId, setDeletingItemId] = useState(-1);
  
  const handleDeleteMaster = (masterId: number) => {
    setDeletingItemId(masterId);
    deleteMaster(masterId)
    .then(() => toast.success("Master deleted successfully"))
    .catch(toastError)
    .finally(() => setDeletingItemId(-1))
  }

  return (
    <ul className="divide-y divide-gray-200 rounded-xl border">
      {loadingMaster ? <ListSkeleton /> : masters.map((m) => (
        <MasterListItem {...m} deleteLoading={deletingItemId === m.id} handleDeleteMaster={handleDeleteMaster} key={m.id}/>
      ))} 
    </ul>
  );
}


