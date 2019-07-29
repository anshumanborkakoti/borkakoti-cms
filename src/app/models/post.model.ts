import { Thumbnail } from './thumbnail.model';
import { PostDetail } from './post-detail.model';
import { Edit } from './edit.model';
import { Category } from './category.model';
import { Issue } from './issue.model';

export class Post {
  constructor(
    public authors: string[] = [],
    public editHistory: Edit[] = [],
    public archived: boolean = false,
    public published: boolean = false,
    public thumbnail: Thumbnail = new Thumbnail(),
    public detail: PostDetail = new PostDetail(),
    public approved: boolean = false,
    public categories: Category[] = [],
    public issues: Issue[] = [],
    public label: string = '',
    public id: string = '') {

  }
}
