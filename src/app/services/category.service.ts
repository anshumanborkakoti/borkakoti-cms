import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor() { }

  get CATEGORY_NONE(): Category {
    return new Category('none', '-1', 'None');
  }

  get MOCK_CATEGORY(): Category {
    return new Category('Poetry', '123', 'Poetry');
  }

  getAllCategories(): Category[] {
    return [
      this.CATEGORY_NONE,
      this.MOCK_CATEGORY,
      new Category('Story', '456', 'Story'),
      new Category('Photography', '789', 'Photography')
    ];
  }

  getCategory(id: string) {
    return null;
  }

  saveCategory(category: Category) {

  }
}
