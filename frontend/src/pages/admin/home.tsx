import MastersTable from "@/components/ui/admin/mastersTable";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/ui/pageTitle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserStar } from "lucide-react";

export function Home() {
  return <>
      <PageTitle
        title="Admin"
        icon={<UserStar size={20} className="text-purple-600" />}
      />
      <Tabs defaultValue="masters" className="w-full h-full">
        <TabsList className="w-full">
          <TabsTrigger value="masters">Masters</TabsTrigger>
          <TabsTrigger value="style_types">Style Types</TabsTrigger>
        </TabsList>
         <ScrollArea className="pr-2 h-[78%]">
              <TabsContent value="masters">
          <MastersTable />
        </TabsContent>
        <TabsContent value="style_types"></TabsContent>
          </ScrollArea>
      </Tabs>
       <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[95%] max-w-lg">
        <Button
          className="w-full py-5 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition text-white shadow-lg cursor-pointer"
        >+ Add new master</Button>
      </div>
    </>
}
