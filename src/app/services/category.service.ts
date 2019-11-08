import { Injectable, OnDestroy } from '@angular/core';
import { Category } from '../models/category.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Image } from '../models/image.model';
import { Thumbnail } from '../models/thumbnail.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService implements OnDestroy {

  get CATEGORY_NONE(): Category {
    return new Category('none', '-1', 'None');
  }

  get MOCK_CATEGORY(): Category {
    return new Category('Poetry', '123', 'Poetry');
  }

  private categoriesChanged = new Subject<Category[]>();
  private isLoading = new BehaviorSubject(false);
  private allCategories: Category[];
  private isSaved = new Subject<boolean>();
  private isDeleted = new Subject<boolean>();

  constructor(private http: HttpClient) {
  }

  getCategoriesChanged(): Subject<Category | Category[]> {
    return this.categoriesChanged;
  }

  getIsLoading(): BehaviorSubject<boolean> {
    return this.isLoading;
  }

  getIsSaved(): Subject<boolean> {
    return this.isSaved;
  }

  getIsDeleted(): Subject<boolean> {
    return this.isDeleted;
  }

  getAllCategories(): void {
    this.isLoading.next(true);
    this.http.get<{ message: string, categories: any }>
      (`${environment.api_url}/categories`)
      .pipe(
        map(result => {
          return {
            categories: result.categories.map(category => {
              const img = new Image(
                category.thumbnail.image.publicId,
                category.thumbnail.image.format,
                category.thumbnail.image.tags,
                category.thumbnail.image.secureUrl,
                category.thumbnail.image.url,
                category.thumbnail.image._id
              );
              return new Category(
                category.name,
                category._id,
                category.label,
                new Thumbnail(
                  category.thumbnail._id,
                  img,
                  category.thumbnail.caption,
                  category.thumbnail.content,
                  category.thumbnail.footer,
                  category.thumbnail.header
                )
              );
            })
          };
        })
      ).subscribe(categoryData => {
        this.allCategories = categoryData.categories.slice();
        this.categoriesChanged.next(this.allCategories.slice());
        this.isLoading.next(false);
        this.isSaved.next(true);
      }, error => {
        console.log(error.message);
        this.isLoading.next(false);
        this.isSaved.next(false);
      });
  }

  getCategory(id: string): Category {
    return this.allCategories.find(aCategory => aCategory.id === id);
  }

  private mapSavedCategory = savedData => {
    const savedCategory = savedData.category;
    return {
      message: savedData.message,
      category: new Category(
        savedCategory.name,
        savedCategory._id,
        savedCategory.label,
        new Thumbnail(
          savedCategory.thumbnail._id,
          new Image(
            savedCategory.thumbnail.image.publicId,
            savedCategory.thumbnail.image.format,
            savedCategory.thumbnail.image.tags,
            savedCategory.thumbnail.image.secureUrl,
            savedCategory.thumbnail.image.url,
            savedCategory.thumbnail.image._id
          ),
          savedCategory.thumbnail.caption,
          savedCategory.thumbnail.content,
          savedCategory.thumbnail.footer,
          savedCategory.thumbnail.header
        )
      )
    }
  }

  saveCategory(aCategoryToSave: Category) {
    this.isLoading.next(true);
    this.http.post<{ message: string, category: any }>
      (`${environment.api_url}/categories`, aCategoryToSave.clone())
      .pipe(
        map(this.mapSavedCategory)
      )
      .subscribe(transformedData => {
        console.log(`Category services.saveCategory() ${{ ...transformedData.category }}`);
        this.allCategories.push(aCategoryToSave);
        this.categoriesChanged.next(this.allCategories.slice());
        this.isLoading.next(false);
        this.isSaved.next(true);
      }, error => {
        console.log('Error occurred ' + error.message);
        this.isLoading.next(false);
        this.isSaved.next(false);
      });
  }

  updateCategory(aCategory: Category) {
    this.isLoading.next(true);
    const clonedCategory = aCategory.clone();
    this.http.put<{ message: string, category: any }>
      (`${environment.api_url}/categories`, clonedCategory)
      .pipe(
        map(this.mapSavedCategory)
      )
      .subscribe(transformedData => {
        console.log(`Category services.updateCategory() ${{ ...transformedData.category }}`);
        const categoryIndex = this.allCategories.findIndex(aCurrentCategory => aCurrentCategory.id === clonedCategory.id);
        this.allCategories.splice(categoryIndex, 1, clonedCategory);
        this.categoriesChanged.next(this.allCategories.slice());
        this.isLoading.next(false);
        this.isSaved.next(true);
      }, error => {
        console.log('Error occurred ' + error.message);
        this.isLoading.next(false);
        this.isSaved.next(false);
      });
  }

  deleteCategory(aCategoryId: string) {
    this.isLoading.next(true);
    const deleted = this.allCategories.filter(aCategory => aCategory
      .id !== aCategoryId);
    this.allCategories = deleted;
    this.deleteCategories([aCategoryId]);
  }

  deleteCategories(aCategoryIds: string[]) {
    this.isLoading.next(true);
    this.http.delete<{ message: string, deleteCount: number }>
      (`${environment.api_url}/categories/${aCategoryIds}`)
      .subscribe(deletedData => {
        console.log(`Categories ${aCategoryIds} deleted successfully`);
        const deleted = this.allCategories.filter(aCategory => {
          return !aCategoryIds.some(id => id === aCategory.id);
        });
        this.allCategories = deleted;
        this.isLoading.next(false);
        this.categoriesChanged.next(this.allCategories.slice());
        this.isDeleted.next(true);
      }, error => {
        console.log('Error occurred ' + error.message);
        this.isLoading.next(false);
        this.isDeleted.next(false);
      });
  }
  ngOnDestroy() {
    this.categoriesChanged = null;
  }
}
