import { Thumbnail } from './thumbnail.model';
import { PostDetail } from './post-detail.model';
import { Edit } from './edit.model';
import { Category } from './category.model';
import { Issue } from './issue.model';
import { CmsClass } from './general-class.interface';
import { cloneCmsClassArray, cloneCmsClass } from '../common/util/utils';
import { User } from './user.model';

export class Post implements CmsClass<Post> {
  equals(that: Post): boolean {
    if (!that) {
      return false;
    }
    //TODO find a better way
    return JSON.stringify(this) === JSON.stringify(that);
  }
  clone(): Post {
    return new Post(
      [...this.authors],
      [...this.editHistory],
      this.archived,
      this.published,
      cloneCmsClass(this.thumbnail),
      cloneCmsClassArray<PostDetail>(this.detail),
      this.approved,
      cloneCmsClassArray<Category>(this.categories),
      cloneCmsClassArray<Issue>(this.issues),
      this.label,
      this.id
    );
  }
  constructor(
    public authors: string[] = [],
    public editHistory: Edit[] = [],
    public archived: boolean = false,
    public published: boolean = false,
    public thumbnail: Thumbnail = null,
    public detail: PostDetail[] = [],
    public approved: boolean = false,
    public categories: Category[] = [],
    public issues: Issue[] = [],
    public label: string = '',
    public id: string = '',
    public assignedTo: User = null
  ) { }


}
