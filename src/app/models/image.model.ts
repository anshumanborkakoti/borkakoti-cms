import { CmsClass } from './general-class.interface';

export class Image implements CmsClass<Image> {
  equals(that: Image): boolean {
    if (!that) {
      return false;
    }
    return this.id === that.id;
  }
  clone() {
    return new Image(
      this.publicId,
      this.format,
      [...this.tags],
      this.secureUrl,
      this.url,
      this.id
    );
  }
  constructor(
    public publicId: string = '',
    public format: string = '',
    public tags: string[] = [],
    public secureUrl: string = '',
    public url: string = '',
    public id: string = null
  ) {
  }
}
