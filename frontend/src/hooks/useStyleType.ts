import { getStyleTypes } from "@/api/styleType";
import type { StyleType } from "@/core/models/styleType";
import { toastError } from "@/lib/utils";
import { useEffect, useState } from "react";

export function useStyleType() {
    const [styleTypes, setStyleTypes] = useState<StyleType[]>([])
    const [loadingStyleTypes, setLoading] = useState(false);

    useEffect(() => {
       setLoading(true)
       getStyleTypes()
       .then((res) => setStyleTypes(res.data))
       .catch(toastError)
       .finally(() => setLoading(false))
    }, [])

    return {styleTypes, loadingStyleTypes}
}