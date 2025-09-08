import { updateMaster } from "@/api/master";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multiSelect";
import { PageTitle } from "@/components/ui/pageTitle";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { MasterType } from "@/core/models/master";
import { useMaster } from "@/hooks/useMaster";
import { useStyleType } from "@/hooks/useStyleType";
import { getToken } from "@/lib/token";
import { toastError } from "@/lib/utils";
import { Loader2Icon, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

export function MasterSetting() {
  const params = useParams();
  const masterId = Number(params["id"]);
  const { master, loadingMaster } = useMaster(masterId);
  const { styleTypes } = useStyleType();
  const [offerStyleIds, setOfferStyleIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  const options = styleTypes.map((st) => ({
    value: st.id,
    label: st.name,
    description: st.description,
  }));

  const handleSaveChanges = () => {
    setSaving(true);
    updateMaster({ ...master, offer_style_ids: offerStyleIds } as MasterType)
      .then(() => {
        toast.success("Offer style types updated");
      })
      .catch(toastError)
      .finally(() => setSaving(false));
  };

  useEffect(() => {
    if (master) {
      setOfferStyleIds(master.offer_style_ids ?? []);
    }
  }, [master]);

  return (
    <>
      {/* Page header */}
      <PageTitle
        title="Master setting"
        icon={<Settings className="text-purple-600" />}
      />
      <Separator className="mb-4" />
      {loadingMaster ? <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-14 w-14 rounded-full bg-gray-300" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-32 bg-gray-300" />
          <Skeleton className="h-4 w-48 bg-gray-300" />
        </div>
      </div> : <div className="flex items-center gap-4 mb-6">
           <Avatar className="border-2 border-purple-200 shadow-sm">
            <AvatarImage
              className="cursor-pointer"
              src={`http://localhost:8080/api/file/${getToken()}`}
            />
            <AvatarFallback
              className="cursor-pointer bg-purple-100 text-purple-600 font-semibold"
            >
              {master?.username[0]}
            </AvatarFallback>
          </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{master?.username}</h2>
        </div>
      </div>}

      {/* Service multi-select */}
      <MultiSelect
        options={options}
        value={offerStyleIds}
        onChange={setOfferStyleIds}
        className="mb-2"
        placeholder="Choose services"
        searchPlaceholder="Search services..."
        emptyMessage="No services match"
        maxVisibleBadges={2}
        withSelectAll
        maxHeight={240}
        label="Services"
      />

      {/* Save button */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[95%] max-w-lg">
        <Button
          disabled={saving}
          onClick={handleSaveChanges}
          className="w-full py-5 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition text-white shadow-lg cursor-pointer"
        >
          {saving && <Loader2Icon className="animate-spin mr-2" />}
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </>
  );
}
