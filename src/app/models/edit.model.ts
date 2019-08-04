import { CmsClass } from './general-class.interface';

export class Edit implements CmsClass<Edit>{
  equals(that: Edit): boolean {
    if (!that) {
      return false;
    }
    return this.editor === that.editor
      && this.comment === that.comment
      && (this.date === that.date || this.date.getTime() === that.date.getTime());
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
    public editor: string,
    public comment: string,
    public date: Date
  ) {
  }
}
