import { Tag } from './tag.model';
import { Thumbnail } from './thumbnail.model';
import { isCmsClassesEqual, cloneCmsClass } from '../common/util/utils';

export class Category implements Tag<Category> {

  equals(that: Category): boolean {
    if (!that) {
      return false;
    }
    return this.name === that.name
      && this.id === that.id
      && this.label === that.label
      && isCmsClassesEqual(this.thumbnail, that.thumbnail)
      && this.minPostDetail === that.minPostDetail
      && this.maxPostDetail === that.maxPostDetail;

  }
  clone(): Category {
    return new Category(
      this.name,
      this.id,
      this.label,
      cloneCmsClass(this.thumbnail),
      this.minPostDetail,
      this.maxPostDetail
    )
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
