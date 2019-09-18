import { Tag } from './tag.model';
import { Thumbnail } from './thumbnail.model';
import { cloneCmsClass } from '../common/util/utils';

export class Issue implements Tag<Issue> {
  equals(that: Issue): boolean {
    if (!that) {
      return false;
    }
    return this.id === that.id;
  }
  clone(): Issue {
    return new Issue(
      this.name,
      this.id,
      this.label,
      cloneCmsClass(this.thumbnail),
      this.published,
      this.archived,
      this.pdfUrl,
      this.latest
    );
  }
  constructor(
    public name = '',
    public id = '',
    public label = '',
    public thumbnail: Thumbnail = null,
    public published: boolean = false,
    public archived: boolean = false,
    public pdfUrl: string = null,
    public latest: boolean = false
  ) {

  }
}
