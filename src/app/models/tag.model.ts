import { Post } from './post.model';
import { Thumbnail } from './thumbnail.model';

export interface Tag {
  posts: Post[];
  name: string;
  id: string;
  label: string;
  thumbnail: Thumbnail;
}
