import { Button } from "@/components/ui/button";
import { UserIcon, Pencil, Trash2, PhoneIcon } from "lucide-react";
import { ScrollArea } from "../scroll-area";

const masters = [
  { id: 1, name: "John Doe", phone: "+1 555 123 4567" },
  { id: 2, name: "Jane Smith", phone: "+1 555 987 6543" },
  { id: 2, name: "Jane Smith", phone: "+1 555 987 6543" },
  { id: 2, name: "Jane Smith", phone: "+1 555 987 6543" },
  { id: 2, name: "Jane Smith", phone: "+1 555 987 6543" },
  { id: 2, name: "Jane Smith", phone: "+1 555 987 6543" },
  { id: 2, name: "Jane Smith", phone: "+1 555 987 6543" },
  { id: 2, name: "Jane Smith", phone: "+1 555 987 6543" },
  { id: 2, name: "Jane Smith", phone: "+1 555 987 6543" },
  { id: 2, name: "Jane Smith", phone: "+1 555 987 6543" },
];

export default function MastersList() {
  return (
    <ul className="divide-y divide-gray-200 rounded-xl border">
      {masters.map((m) => (
        <li key={m.id} className="flex items-center justify-between p-4">
          <div>
            <div className="font-semibold flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-pink-600" />
              {m.name}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <PhoneIcon className="w-3 h-3" />
              {m.phone}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
