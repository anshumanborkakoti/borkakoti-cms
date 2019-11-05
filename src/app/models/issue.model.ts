import { Tag } from './tag.model';
import { Thumbnail } from './thumbnail.model';
import { cloneCmsClass, cloneCmsClassArray } from '../common/util/utils';
import { Post } from './post.model';

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
      this.latest,
      cloneCmsClassArray(this.posts)
    );
  }
  constructor(
    public name = '',
    public id = null,
    public label = '',
    public thumbnail: Thumbnail = null,
    public published: boolean = false,
    public archived: boolean = false,
    public pdfUrl: string = null,
    public latest: boolean = false,
    public posts: Post[] = []
  ) {

  }
}
