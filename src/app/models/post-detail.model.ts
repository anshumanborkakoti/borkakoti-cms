import { Thumbnail } from './thumbnail.model';

export class PostDetail extends Thumbnail {
  public get maxCharCount() {
    return 5000;
  }
}
