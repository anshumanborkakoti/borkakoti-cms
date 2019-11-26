import { Tag } from './tag.model';
import { Thumbnail, createThumbnail } from './thumbnail.model';
import { cloneCmsClass } from '../common/util/utils';

export class Category implements Tag<Category> {

  equals(that: Category): boolean {
    if (!that) {
      return false;
    }
    return this.id === that.id;

  }
  *[Symbol.iterator]() {
    yield this.name;
    yield this.id;
    yield this.label;
    yield* this.thumbnail;
    yield this.minPostDetail;
    yield this.maxPostDetail;
  }
  clone(): Category {
    return new Category(
      this.name,
      this.id,
      this.label,
      cloneCmsClass(this.thumbnail),
      this.minPostDetail,
      this.maxPostDetail
    );
  }
  constructor(
    public name = '',
    public id = '',
    public label = '',
    public thumbnail: Thumbnail = null,
    public minPostDetail: number = 1,
    public maxPostDetail: number = 10) {

  }
}

export function createCategory({ name, _id, id, label, thumbnail, minPostDetail, maxPostDetail }): Category {
  return new Category(
    name,
    _id || id || null,
    label,
    createThumbnail(thumbnail),
    minPostDetail,
    maxPostDetail
  );
}
