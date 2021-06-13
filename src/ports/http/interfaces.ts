export interface Request {
  body: any;
  params: any;
}

export interface Response {
  code(codeNumber: number): Response;
  send(payload: any): void;
}
