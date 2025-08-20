import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ErrorResponse } from "../types/error";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: ErrorResponse) => {
  const { data } = error.response || {};

  if (data?.issues) {
    return data.issues.map((issue) => issue.message).join("\n");
  }
  return data?.message || error.message;
};
