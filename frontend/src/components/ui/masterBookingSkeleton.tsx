import { Card, CardContent, CardHeader } from "./card";

export function MasterBookingSkeleton() {
  return [1, 2, 3].map((key) => (
    <Card className="w-full shadow-lg rounded-3xl border border-gray-200 mb-4 animate-pulse" key={key}>
      <CardHeader className="flex justify-between items-center pb-1">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="h-5 w-32 bg-gray-300 rounded-md"></div>
        </div>
        <div className="h-4 w-16 bg-gray-300 rounded-md"></div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="h-4 w-48 bg-gray-300 rounded-md"></div>
        <div className="h-4 w-24 bg-gray-300 rounded-md"></div>
        <div className="h-4 w-32 bg-gray-300 rounded-md"></div>
        <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
      </CardContent>
    </Card>
  ));
}
