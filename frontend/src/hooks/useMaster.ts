import { getMasters as _getMasters } from "@/api/master";
import type { MasterType } from "@/core/models/master";
import { toastError } from "@/lib/utils";
import { useEffect, useState } from "react";

export function useMaster() {
    const [masters, setMasters] = useState<MasterType[]>([])
    const [loadingMaster, setLoading] = useState(false);

    useEffect(() => {
       getMasters()
    }, [])

   const getMasters = () => {
      setLoading(true)
       _getMasters()
       .then((res) => setMasters(res.data))
       .catch(toastError)
       .finally(() => setLoading(false))
   }

    return {masters, loadingMaster, getMasters}
}