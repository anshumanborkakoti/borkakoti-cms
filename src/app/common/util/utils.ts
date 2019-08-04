import { CmsClass } from 'src/app/models/general-class.interface';

export function cloneCmsClassArray<T extends CmsClass<T>>(cArray: T[]): T[] {
  if (!cArray) {
    return null;
  }
  return cArray.slice().map(a => {
    return a.clone();
  });
}

export function isCmsClassesEqual<T extends CmsClass<T>>(thisClassToCompare: T, thatClassToCompareWith: T): boolean {
  return (thisClassToCompare === thatClassToCompareWith)
    || (thisClassToCompare !== null && thatClassToCompareWith !== null && thisClassToCompare.equals(thatClassToCompareWith));
}

export function cloneCmsClass<T extends CmsClass<T>>(toClone: T) {
  if (toClone === null) {
    return null;
  }
  return toClone.clone();
}
