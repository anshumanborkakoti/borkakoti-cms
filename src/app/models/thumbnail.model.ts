import { Image } from './image.model';
import { CmsClass } from './general-class.interface';
import { cloneCmsClass, isCmsClassesEqual } from '../common/util/utils';


export class Thumbnail implements CmsClass<Thumbnail>{
  clone(): Thumbnail {
    return new Thumbnail(
      this.id,
      cloneCmsClass(this.image),
      this.caption,
      this.content,
      this.footer,
      this.header
    );
  }

  constructor(
    public id = Math.random().toString(32),
    public image: Image = new Image(),
    public caption: string = '',
    public content: string = '',
    public footer: string = '',
    public header: string = '') {

  }
  public get maxCharCount() {
    return 500;
  }

  public equals(that: Thumbnail): boolean {
    if (!that) {
      return false;
    }
    return this.id === that.id
      && isCmsClassesEqual(this.image, that.image)
      && this.caption === that.caption
      && this.content === that.content
      && this.footer === that.footer
      && this.header === that.header
      && this.maxCharCount === that.maxCharCount;
  }
}
