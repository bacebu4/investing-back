export enum SymbolRepositoryErrorCode {
  NOT_FOUND = 'The symbol not supported or not exists',
  UNEXPECTED_ERROR = 'Unexpected error occurred',
}

export class SymbolRepositoryError extends Error {
  message: SymbolRepositoryErrorCode;

  constructor(message: SymbolRepositoryErrorCode) {
    super(message);
    this.message = message;
  }
}
