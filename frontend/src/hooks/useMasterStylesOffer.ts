import { getMasterStylesOffer as _getMasterStylesOffer } from "@/api/master";
import type { MasterStylesOfferType } from "@/core/models/master";
import {  useState } from "react";

export function useMasterStylesOffer() {
  const [styleTypes, setOptions] = useState<MasterStylesOfferType[]>([]);

  const getMasterStylesOffer = (masterId: number) => {
    _getMasterStylesOffer(masterId)
      .then((res) => setOptions(res.data))
      .catch(console.log);
  };

  return { styleTypes , getMasterStylesOffer};
}
