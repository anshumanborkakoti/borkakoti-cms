import { Tag } from './tag.model';
import { Thumbnail } from './thumbnail.model';
import { cloneCmsClass } from '../common/util/utils';

export class Category implements Tag<Category> {

  equals(that: Category): boolean {
    if (!that) {
      return false;
    }
    return this.id === that.id;

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
