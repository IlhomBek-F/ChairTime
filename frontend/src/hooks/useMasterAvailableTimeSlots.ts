import { getMasterAvailableTimeSlots as _getMasterAvailableTimeSlots } from "@/api/master";
import { toastError } from "@/lib/utils";
import { useEffect, useState } from "react";

export function useMasterAvailableTimeSlots(masterId: number, date: string) {
    const [timeSlots, setTimeSlots] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(masterId && date) {
          getMasterAvailableTimeSlots(masterId, date)
        }
    }, [masterId, date])

    const getMasterAvailableTimeSlots = (masterId: number, date: string) => {
        setLoading(true)
        _getMasterAvailableTimeSlots(masterId, date)
        .then((res) => {
            setTimeSlots(res.data)
        })
        .catch(toastError)
        .finally(() => setLoading(false))
    }

    return {timeSlots, loading}
}