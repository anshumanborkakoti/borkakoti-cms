import { Image } from './image.model';


export class Thumbnail {

  constructor(
    public id = Math.random().toString(32),
    public image: Image = null,
    public caption: string = '',
    public content: string = '',
    public footer: string = '',
    public header: string = '') {

  }
  public get maxCharCount() {
    return 500;
  }
}
