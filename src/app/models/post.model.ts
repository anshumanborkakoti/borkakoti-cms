import { Thumbnail } from './thumbnail.model';
import { PostDetail } from './post-detail.model';
import { Edit } from './edit.model';
import { Category } from './category.model';
import { Issue } from './issue.model';
import { CmsClass } from './general-class.interface';
import { cloneCmsClassArray, cloneCmsClass } from '../common/util/utils';
import { User } from './user.model';
import { Author } from './author.model';

export class Post implements CmsClass<Post> {
  equals(that: Post): boolean {
    if (!that) {
      return false;
    }
    return this.id === that.id;
  }
  clone(): Post {
    return new Post(
      cloneCmsClassArray<Author>(this.authors),
      [...this.editHistory],
      this.archived,
      cloneCmsClass(this.thumbnail),
      cloneCmsClassArray<PostDetail>(this.detail),
      this.approved,
      cloneCmsClass<Category>(this.category),
      cloneCmsClassArray<Issue>(this.issues),
      this.label,
      this.id,
      this.content,
      this.assignedTo
    );
  }
  constructor(
    public authors: Author[] = [],
    public editHistory: Edit[] = [],
    public archived: boolean = false,
    public thumbnail: Thumbnail = null,
    public detail: PostDetail[] = [],
    public approved: boolean = false,
    public category: Category = null,
    public issues: Issue[] = [],
    public label: string = '',
    public id: string = '',
    public content: PostDetail = null,
    public assignedTo: User = new User('NONE')
  ) { }

  /**
   * Post is published if an issue that it is tagged to is published
   */
  public get published() {
    if (this.issues === null || this.issues.length === 0) {
      return false;
    }
    return this.issues.some(issue => issue.published === true);
  }

}
