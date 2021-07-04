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
