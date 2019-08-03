import { Thumbnail } from 'src/app/models/thumbnail.model';
import { PostDetail } from 'src/app/models/post-detail.model';

export interface ThumbnailDialogData {
  thumbnail: Thumbnail | PostDetail;
  mode: string;
}
