import { createImage, Image } from './image.model';
import { CmsClass } from './general-class.interface';
import { cloneCmsClass, isCmsClassesEqual, makeid } from '../common/util/utils';

export class Thumbnail implements CmsClass<Thumbnail> {
  *[Symbol.iterator]() {
    yield this.id;
    yield* this.image;
    yield this.caption;
    yield this.content;
    yield this.footer;
    yield this.header;
  }
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
    public id: string = null,
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
    return this.id === that.id;
  }
}
export function createThumbnail({ _id, id, image, caption, content, footer, header }): Thumbnail {
  return new Thumbnail(
    _id || id || null,
    createImage(image),
    caption,
    content,
    footer,
    header
  );
}
