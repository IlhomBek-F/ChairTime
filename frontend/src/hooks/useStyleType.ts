import { getStyleTypes as _getStyleTypes , getStyleTypeById as _getStyleTypeById} from "@/api/styleType";
import type { StyleType } from "@/core/models/styleType";
import { toastError } from "@/lib/utils";
import { useEffect, useState } from "react";

export function useStyleType(id?: number) {
  const [styleTypes, setStyleTypes] = useState<StyleType[]>([]);
  const [loadingStyleTypes, setLoading] = useState(false);
  const [styleType, setStyleType] = useState<StyleType>()

  useEffect(() => {
    if(id) {
      getStyleTypeById(id)
    } else {
      getStyleTypes();
    }
  }, []);

  const getStyleTypes = () => {
    setLoading(true);
    _getStyleTypes()
      .then((res) => setStyleTypes(res.data))
      .catch(toastError)
      .finally(() => setLoading(false));
  };

  const getStyleTypeById = (id: number) => {
     _getStyleTypeById(id)
      .then((res) => setStyleType(res.data))
      .catch(toastError)
  }

  return { styleTypes, loadingStyleTypes, getStyleTypes, getStyleTypeById, styleType };
}
