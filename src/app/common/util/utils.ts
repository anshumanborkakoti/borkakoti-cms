import { CmsClass } from 'src/app/models/general-class.interface';
import { FormGroup } from '@angular/forms';
import { ROLES, LANDING } from './constants';

export function cloneCmsClassArray<T extends CmsClass<T>>(cArray: T[]): T[] {
  if (!cArray) {
    return null;
  }
  return [...cArray].map(a => {
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

export function makeid(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function showErrorIf(controlName: string, errorName: string, form: FormGroup) {
  const errors = form.get(controlName).errors;
  return !form.get(controlName).valid && errors && errors[errorName] && form.touched;
}

export function getLandingPageByRole(aRoles: string[]) {
  if (aRoles.findIndex(aRole => aRole === ROLES.ADMIN) > -1) {
    return LANDING[ROLES.ADMIN];
  } else if (aRoles.findIndex(aRole => aRole === ROLES.CHIEF_EDITOR) > -1) {
    return LANDING[ROLES.CHIEF_EDITOR];
  } else if (aRoles.findIndex(aRole => aRole === ROLES.EDITOR) > -1) {
    return LANDING[ROLES.EDITOR];
  }
}
