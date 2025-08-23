import { getMasterUnavailableSchedules } from "@/api/master";
import { toastError } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { Matcher } from "react-day-picker";



export function useMasterUnavailableSchedule(masterId: number) {
    const [dateMathcer, setDateMatcher] = useState<Matcher[]>([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(masterId) {
          getMasterOffSchedules(masterId)
        }
    }, [masterId])

    const getMasterOffSchedules = (masterId: number) => {
        setLoading(true)
        getMasterUnavailableSchedules(masterId)
        .then((res) => {
            const matcher = res.data.map((sch) => {
                const [day, month, year] = sch.date.split("-");
                return new Date(+year, +month - 1, +day);
            }) as Matcher[]
            
            matcher.push({before: new Date() })
            setDateMatcher(matcher)
        })
        .catch(toastError)
        .finally(() => setLoading(false))
    }

    return {dateMathcer, loading}
}