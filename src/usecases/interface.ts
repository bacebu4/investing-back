export interface Usecase {
  invoke(...args: any[]): Promise<[Error[], null] | [null, any]>;
}
