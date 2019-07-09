import { Tag } from './tag.model';
import { Thumbnail } from './thumbnail.model';

export class Category implements Tag {
  constructor(public posts = [], public name = '', public id = '', public label = '',
    public thumbnail: Thumbnail = null) {

  }
}
