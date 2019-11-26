import { Thumbnail, createThumbnail } from './thumbnail.model';
import { PostDetail, createPostDetails, createPostDetail } from './post-detail.model';
import { Edit, createEdits } from './edit.model';
import { Category, createCategory } from './category.model';
import { Issue, createIssues } from './issue.model';
import { CmsClass } from './general-class.interface';
import { cloneCmsClassArray, cloneCmsClass } from '../common/util/utils';
import { User } from './user.model';
import { Author, createAuthors } from './author.model';

export class Post implements CmsClass<Post> {
  equals(that: Post): boolean {
    if (!that) {
      return false;
    }
    return this.id === that.id;
  }

  // *[Symbol.iterator]() {
  //   yield* this.authors;
  //   yield* this.editHistory;
  //   yield this.archived;
  //   yield* this.thumbnail;
  //   yield* this.detail;
  //   yield this.approved;
  //   yield* this.category;
  //   yield* this.issues;
  //   yield this.label;
  //   yield this.id;
  //   yield* this.content;
  //   yield this.assignedTo;
  // }
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
      cloneCmsClass(this.content),
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

export function createPost(
  {
    authors,
    editHistory,
    archived,
    thumbnail,
    approved,
    detail,
    category,
    issues,
    label,
    id,
    _id,
    content,
    assignedTo
  }): Post {
  return new Post(
    createAuthors(authors),
    createEdits([...editHistory]),
    archived,
    createThumbnail(thumbnail),
    createPostDetails(detail),
    approved,
    createCategory(category),
    createIssues(issues),
    label,
    _id || id || null,
    createPostDetail(content),
    assignedTo
  );
}
