import { AxiosError } from "axios";

export type ErrorIssue = { field?: string; message: string; code?: string };

export type ErrorData = {
  error: string;
  message?: string;
  issues?: ErrorIssue[];
};

export type ErrorResponse = AxiosError<ErrorData>;
