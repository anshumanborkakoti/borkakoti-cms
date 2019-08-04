export interface CmsClass<T> {
  equals(that: T): boolean;
  clone(): T;
}
