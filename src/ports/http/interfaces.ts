export interface Request {
  body: any;
  params: any;
  headers: any;
}

export interface Response {
  code(codeNumber: number): Response;
  send(payload: any): void;
}

export enum ControllerStatus {
  clientError = 'clientError',
  ok = 'ok',
  fail = 'fail',
  created = 'created',
  unauthorized = 'unauthorized',
  forbidden = 'forbidden',
  notFound = 'notFound',
  conflict = 'conflict',
}
export interface ControllerResponse {
  status: ControllerStatus;
  data: any;
}
