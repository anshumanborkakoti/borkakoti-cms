import { Thumbnail } from './thumbnail.model';
import { PostDetail } from './post-detail.model';
import { Edit } from './edit.model';
import { Category } from './category.model';
import { Issue } from './issue.model';

export class Post {
  constructor(public authors: string[],
    public editHistory: Edit[],
    public archived: boolean,
    public published: boolean,
    public thumbnail: Thumbnail,
    public detail: PostDetail,
    public approved: boolean,
    public categories: Category[],
    public issues: Issue[],
    public label: string) {

  }
}
