import { Post } from './post.model';
import { Thumbnail } from './thumbnail.model';

export interface Tag {
  name: string;
  id: string;
  label: string;
  thumbnail: Thumbnail;
}
