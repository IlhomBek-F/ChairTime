import type { ReactNode } from "react";

export function PageTitle({ title, icon }: { title: string; icon: ReactNode }) {
  return (
    <h1 className="font-bold text-xl text-gray-800 mb-3 font-mono flex gap-2 items-center">
      {icon}
      {title}
    </h1>
  );
}
