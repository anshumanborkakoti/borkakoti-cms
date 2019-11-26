import { Thumbnail } from './thumbnail.model';
import { CmsClass } from './general-class.interface';
import { cloneCmsClass } from '../common/util/utils';
import { createImage } from './image.model';

export class PostDetail extends Thumbnail implements CmsClass<PostDetail> {
  *[Symbol.iterator]() {
    yield this.id;
    yield* this.image;
    yield this.caption;
    yield this.content;
    yield this.footer;
    yield this.header;
  }

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

export function createPostDetail({ _id, id, image, caption, content, footer, header }): PostDetail {
  return new PostDetail(
    _id || id || null,
    createImage(image),
    caption,
    content,
    footer,
    header
  );
}

export function createPostDetails(postDetailArray: { _id, id, image, caption, content, footer, header }[]): PostDetail[] {
  return postDetailArray.map(aDetail => {
    return createPostDetail(aDetail);
  });
}
