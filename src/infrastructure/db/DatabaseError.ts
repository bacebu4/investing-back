export enum DatabaseErrorCode {
  NOT_FOUND = 'The record was not found',
  NOT_ESTABLISHED_DB_CONNECTION = 'DB connection was not established yet.',
}

export class DatabaseError extends Error {
  message: DatabaseErrorCode;

  constructor(message: DatabaseErrorCode) {
    super(message);
    this.message = message;
  }
}
