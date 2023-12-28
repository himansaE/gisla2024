import { User } from "next-auth";

export type AuthError = {
  done: false;
  error: string;
  err_in: string;
};

export type AuthDone = {
  done: true;
  user: User;
};

export type AuthResponse = AuthDone | AuthError;

export const NewResponse = (
  body: AuthResponse,
  statusCode?: number,
  headers?: HeadersInit
) => {
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: headers,
  });
};

export const authError = (text: string, err_in?: string): AuthError => {
  return {
    done: false,
    error: text,
    err_in: err_in ?? "all",
  };
};
