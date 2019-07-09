import { Tag } from './tag.model';
import { Thumbnail } from './thumbnail.model';

export class Issue implements Tag {
  constructor(public posts = [], public name = '', public id = '', public label = '', public thumbnail: Thumbnail = null,
    public published: boolean = false, public archived: boolean = false) {

  }
}
