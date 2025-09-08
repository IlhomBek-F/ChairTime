import { getMasters as _getMasters , getMasterById as _getMasterById} from "@/api/master";
import type { MasterType } from "@/core/models/master";
import { toastError } from "@/lib/utils";
import { useEffect, useState } from "react";

export function useMaster(masterId?: number) {
    const [masters, setMasters] = useState<MasterType[]>([])
    const [loadingMaster, setLoading] = useState(false);
    const [master, setMaster] = useState<MasterType>();

    useEffect(() => {
        if(masterId) {
           getMasterById(masterId)
        } else {
            getMasters()
        }
    }, [])

   const getMasters = () => {
      setLoading(true)
       _getMasters()
       .then((res) => setMasters(res.data))
       .catch(toastError)
       .finally(() => setLoading(false))
   }

   const getMasterById = (id: number) => {
      setLoading(true)
      _getMasterById(id) 
       .then((res) => setMaster(res.data))
       .catch(toastError)
       .finally(() => setLoading(false))
   }

    return {masters, loadingMaster, getMasters, master}
}