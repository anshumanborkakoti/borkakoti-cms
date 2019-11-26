import { CmsClass } from './general-class.interface';
import { makeid } from '../common/util/utils';
import { User, createUser } from './user.model';

export class Edit implements CmsClass<Edit> {
  equals(that: Edit): boolean {
    if (!that) {
      return false;
    }
    return this.id === that.id;
  }
  clone(): Edit {
    const newdate = new Date();
    newdate.setTime(this.date.getTime());
    return new Edit(
      this.editor,
      this.comment,
      newdate
    );
  }
  constructor(
    public editor: User,
    public comment: string,
    public date: Date,
    public id: string = makeid(10)
  ) {
  }
}

export function createEdit({ editor, comment, date, id, _id }): Edit {
  return new Edit(
    createUser(editor),
    comment,
    new Date(date),
    _id || id
  );
}

export function createEdits(edits: Array<any>): Edit[] {
  return edits.map(aEdit => createEdit(aEdit));
}
