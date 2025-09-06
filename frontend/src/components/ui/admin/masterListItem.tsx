import { Loader2Icon, Pencil, PhoneIcon, Trash2, UserIcon } from "lucide-react";
import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import type { MasterType } from "@/core/models/master";
import { useState } from "react";
import { deleteMaster } from "@/api/master";
import { toast } from "sonner";
import { toastError } from "@/lib/utils";

export function MasterListItem({ username, phone, id }: MasterType) {
  const [openPopover, setOpenPopover] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
   const handleDeleteMaster = (masterId: number) => {
    setDeleting(true);
    deleteMaster(masterId)
    .then(() => toast.success("Master deleted successfully"))
    .catch(toastError)
    .finally(() => setDeleting(false))
  }

  return (
    <li className="flex items-center justify-between p-4">
      <div>
        <div className="font-semibold flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-pink-600" />
          {username}
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <PhoneIcon className="w-3 h-3" />
          {phone}
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Pencil className="w-4 h-4" />
        </Button>
        <Popover open={openPopover}>
          <PopoverTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="rounded-full shadow-md cursor-pointer"
              onClick={() => setOpenPopover(true)}
            >
              <Trash2 />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-3 text-sm flex flex-col gap-2 mr-10 z-10 bg-white border rounded-lg shadow-lg">
            <span className="text-gray-700">
              Are you sure you want to delete this master?
            </span>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => handleDeleteMaster(id)}
              >
                {deleting && (
                  <Loader2Icon className="animate-spin mr-2" />
                )}
                Yes
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => setOpenPopover(false)}
              >
                No
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </li>
  );
}
