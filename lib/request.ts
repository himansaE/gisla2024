export type ResponseDone = {
  done: true;
  data: { [key: string]: any };
};
export type ResponseError = {
  done: false;
  error_text: string;
  error: any;
};

export type ResponseOutput = ResponseDone | ResponseError;

export const ResponseDone = (data?: ResponseDone["data"]): ResponseDone => {
  return { done: true, data: data ?? {} };
};

export const ResponseError = (
  error_text: string,
  error?: any
): ResponseError => {
  return { done: false, error: error, error_text };
};

export const NewResponse = (res: ResponseOutput | null, status?: number) => {
  return new Response(res == null ? null : JSON.stringify(res), {
    status: status,
  });
};

export const getJsonBody = async (req: Request): Promise<[boolean, any]> => {
  try {
    return [false, await req.json()];
  } catch (e) {
    return [
      true,
      ResponseError(
        "Something went wrong. Please try again later or contact support if the issue persists."
      ),
    ];
  }
};
