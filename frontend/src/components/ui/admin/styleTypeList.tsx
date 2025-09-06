import { useStyleType } from "@/hooks/useStyleType";
import { ListSkeleton } from "./listSkeleton";
import { StyleTypeItem } from "./styleTypeItem";
import { useState } from "react";
import { deleteStyleType } from "@/api/styleType";
import { toast } from "sonner";
import { toastError } from "@/lib/utils";

export function StyleTypeList() {
 const {styleTypes, loadingStyleTypes, getStyleTypes} = useStyleType()
 const [deletingItemId, setDeletingItemId] = useState(-1)

 const handleDeleteStyleType = (id: number) => {
    setDeletingItemId(id);
    deleteStyleType(id)
    .then(() => {
      toast.success("style type deleted successfully")
      getStyleTypes()
    })
    .catch(toastError)
    .finally(() => setDeletingItemId(-1))
  }

 return (
     <ul className="divide-y divide-gray-200 rounded-xl border">
          {loadingStyleTypes ? <ListSkeleton /> : styleTypes.map((st) => (
            <StyleTypeItem {...st} key={st.id} handleDeleteStyleType={handleDeleteStyleType} deleteLoading={deletingItemId === st.id}/>
          ))} 
     </ul>
 )
}