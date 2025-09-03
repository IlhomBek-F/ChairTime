import type { MasterBookingType } from "@/core/models/booking";
import { Clock, MessageSquare, Phone, Scissors, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Button } from "../button";

export function MasterBookingItem({username, date, time, description, phone, style_type}: MasterBookingType) {
  return (
    <Card className="w-full shadow-lg rounded-3xl border border-gray-200 mb-4 hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex justify-between items-center pb-1">
        <div className="flex items-center gap-3">
          <User size={20} className="text-indigo-500" />
          <CardTitle className="text-lg font-semibold text-gray-900">
            {username}
          </CardTitle>
        </div>
        <div className="text-sm text-gray-500">{date}</div>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <Phone size={16} className="text-green-500" /> {phone}
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Clock size={16} className="text-yellow-500" /> {time}
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Scissors size={16} className="text-pink-500" /> {style_type}
        </div>

        {description && (
          <div className="flex items-start gap-2 text-gray-600 bg-gray-50 p-2 rounded-lg">
            <MessageSquare size={16} className="mt-0.5 text-blue-500" />{" "}
            {description}
          </div>
        )}

        {/* Optional Action Button */}
        <Button variant="outline" className="w-full mt-3 cursor-pointer">
          Cancel Booking
        </Button>
      </CardContent>
    </Card>
  );
}
