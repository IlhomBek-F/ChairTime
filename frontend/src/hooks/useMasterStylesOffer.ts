import { getMasterStylesOffer as _getMasterStylesOffer } from "@/api/master";
import type { MasterStylesOfferType } from "@/core/models/master";
import {  useEffect, useState } from "react";

export function useMasterStylesOffer(masterId: number) {
  const [styleTypes, setOptions] = useState<MasterStylesOfferType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      if(masterId) {
        getMasterStylesOffer(masterId)
      }
  }, [masterId])

  const getMasterStylesOffer = (masterId: number) => {
     setLoading(true)
    _getMasterStylesOffer(masterId)
      .then((res) => setOptions(res.data))
      .catch(console.log)
      .finally(() => setLoading(false))
  };

  return { styleTypes , getMasterStylesOffer, loading};
}
