import { Thumbnail } from './thumbnail.model';
import { CmsClass } from './general-class.interface';
import { cloneCmsClass } from '../common/util/utils';

export class PostDetail extends Thumbnail implements CmsClass<PostDetail> {
  public get maxCharCount() {
    return 5000;
  }
  clone(): PostDetail {
    return new PostDetail(
      this.id,
      cloneCmsClass(this.image),
      this.caption,
      this.content,
      this.footer,
      this.header
    );
  }
}
