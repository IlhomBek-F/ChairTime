import { getMasterStylesOffer as _getMasterStylesOffer } from "@/api/master";
import type { MasterStylesOfferType } from "@/core/models/master";
import {  useEffect, useState } from "react";

export function useMasterStylesOffer(masterId: number) {
  const [styleTypes, setOptions] = useState<MasterStylesOfferType[]>([]);

  useEffect(() => {
      if(masterId) {
        getMasterStylesOffer(masterId)
      }
  }, [masterId])

  const getMasterStylesOffer = (masterId: number) => {
    _getMasterStylesOffer(masterId)
      .then((res) => setOptions(res.data))
      .catch(console.log);
  };

  return { styleTypes , getMasterStylesOffer};
}
