import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toastError(error: unknown) {
  return () => {
    if (error instanceof Error) {
      toast.error(error.message)
    }
  }
}