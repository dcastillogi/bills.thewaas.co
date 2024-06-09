import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { getSession } from "./session"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}