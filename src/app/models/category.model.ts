import { Tag } from './tag.model';
import { Thumbnail } from './thumbnail.model';

export class Category implements Tag {
  constructor(public name = '', public id = '', public label = '',
    public thumbnail: Thumbnail = null, public minPostDetail: number = 1, public maxPostDetail: number = 10) {

  }
}
