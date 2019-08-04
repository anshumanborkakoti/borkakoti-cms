import { Thumbnail } from './thumbnail.model';
import { CmsClass } from './general-class.interface';

export interface Tag<T> extends CmsClass<T> {
  name: string;
  id: string;
  label: string;
  thumbnail: Thumbnail;
}
