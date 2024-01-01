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

export const ResponseDone = (data: ResponseDone["data"]): ResponseDone => {
  return { done: true, data };
};

export const ResponseError = (
  error_text: string,
  error?: any
): ResponseError => {
  return { done: false, error: error, error_text };
};
