export enum DatabaseErrorCode {
  NOT_FOUND = 'The record was not found',
}

export class DatabaseError extends Error {
  message: DatabaseErrorCode;

  constructor(message: DatabaseErrorCode) {
    super(message);
    this.message = message;
  }
}
