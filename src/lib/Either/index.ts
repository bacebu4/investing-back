import { ControllerResponse } from '../../ports/http/BaseController';

export type Either<T, U> = [T, null] | [null, U];

export function left<T>(data: T): [T, null] {
  return [data, null];
}

export function right<U>(data: U): [null, U] {
  return [null, data];
}

type MapLeft<T> = (error: T) => ControllerResponse;
type MapRight<U> = (data: U) => ControllerResponse;

export function fold<T, U>(
  [error, data]: Either<T, U>,
  mapLeft: MapLeft<T>,
  mapRight: MapRight<U>
) {
  if (error) {
    return mapLeft(error);
  } else {
    return mapRight(data);
  }
}
