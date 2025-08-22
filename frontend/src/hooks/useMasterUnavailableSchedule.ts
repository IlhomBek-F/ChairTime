import { getMasterUnavailableSchedules } from "@/api/master";
import type { MasterUnavailableScheduleType } from "@/core/models/master";
import { toastError } from "@/lib/utils";
import { useEffect, useState } from "react";



export function useMasterUnavailableSchedule(masterId: number) {
    const [offSchedules, setOffSchedules] = useState<MasterUnavailableScheduleType[]>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(masterId) {
          getMasterOffSchedules(masterId)
        }
    }, [masterId])

    const getMasterOffSchedules = (masterId: number) => {
        setLoading(true)
        getMasterUnavailableSchedules(masterId)
        .then((res) => setOffSchedules(res.data))
        .catch(toastError)
        .finally(() => setLoading(false))
    }

    return {offSchedules, loading}
}