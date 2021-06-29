export type Either<T, U> = [T, null] | [null, U];

export function left<T>(data: T): [T, null] {
  return [data, null];
}

export function right<U>(data: U): [null, U] {
  return [null, data];
}
