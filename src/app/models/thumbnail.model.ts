import { Image } from './image.model';


export class Thumbnail {

  constructor(
    public image: Image = null,
    public caption: string = '',
    public content: string = '',
    public footer: string = '',
    public header: string = '') {

  }
}
