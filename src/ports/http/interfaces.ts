export interface Request {
  body: any;
  params: any;
  headers: any;
}

export interface Response {
  code(codeNumber: number): Response;
  send(payload: any): void;
}
