import { Tag } from './tag.model';
import { Thumbnail } from './thumbnail.model';
import { isCmsClassesEqual, cloneCmsClass } from '../common/util/utils';

export class Issue implements Tag<Issue> {
  equals(that: Issue): boolean {
    if (!that) {
      return false;
    }
    return this.name === that.name
      && this.id === that.id
      && this.label === that.label
      && isCmsClassesEqual(this.thumbnail, that.thumbnail)
      && this.published === that.published
      && this.archived === that.archived;
  }
  clone(): Issue {
    return new Issue(
      this.name,
      this.id,
      this.label,
      cloneCmsClass(this.thumbnail),
      this.published,
      this.archived
    );
  }
  constructor(
    public name = '',
    public id = '',
    public label = '',
    public thumbnail: Thumbnail = null,
    public published: boolean = false,
    public archived: boolean = false
  ) {

  }
}
