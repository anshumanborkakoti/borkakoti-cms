import { CmsClass } from './general-class.interface';
import { makeid } from '../common/util/utils';
import { User } from './user.model';

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
