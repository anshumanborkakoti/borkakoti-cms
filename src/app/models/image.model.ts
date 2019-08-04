import { CmsClass } from './general-class.interface';

export class Image implements CmsClass<Image> {
  equals(that: Image): boolean {
    if (!that) {
      return false;
    }
    return this.publicId === that.publicId
      && this.format === that.format
      && this.secureUrl === that.secureUrl
      && this.url === that.url
      && JSON.stringify(this.tags) === JSON.stringify(that.tags);
  }
  clone() {
    return new Image(
      this.publicId,
      this.format,
      [...this.tags],
      this.secureUrl,
      this.url
    );
  }
  constructor(
    public publicId: string = '',
    public format: string = '',
    public tags: string[] = [],
    public secureUrl: string = '',
    public url: string = ''
  ) {
  }
}
