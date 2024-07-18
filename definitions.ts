export interface CustomError extends Error {
  status?: number;
  syscall?: string;
  code?: string;
}
