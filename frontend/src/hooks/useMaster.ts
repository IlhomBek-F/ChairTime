import { getMasters } from "@/api/master";
import type { MasterType } from "@/core/models/master";
import { useEffect, useState } from "react";

export function useMaster() {
    const [masters, setMasters] = useState<MasterType[]>([])

    useEffect(() => {
       getMasters()
       .then((res) => setMasters(res.data))
       .catch(console.log)
    }, [])

    return {masters}
}