import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge tailwind class
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}