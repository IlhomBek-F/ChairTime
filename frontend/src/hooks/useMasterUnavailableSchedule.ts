import { getMasterUnavailableSchedules } from "@/api/master";
import type { MasterUnavailableScheduleType } from "@/core/models/master";
import { toastError } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { Matcher } from "react-day-picker";

export function useMasterUnavailableSchedule(masterId: number) {
    const [dateMathcer, setDateMatcher] = useState<Matcher[]>([]);
    const [unavailableSchedules, setUnavailableSchedules] = useState<MasterUnavailableScheduleType[]>([]);

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
            setUnavailableSchedules(res.data)
            const matcher = res.data.reduce((matchers, sch) => {
                if(sch.date) {
                    const [day, month, year] = sch.date.split("-");
                    matchers.push(new Date(+year, +month - 1, +day))
                }
                return matchers
            }, [{before: new Date() }] as Matcher[])
            setDateMatcher(matcher)
        })
        .catch(toastError)
        .finally(() => setLoading(false))
    }

    return {dateMathcer, loading, unavailableSchedules}
}