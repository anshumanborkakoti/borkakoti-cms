import { Injectable, OnDestroy } from '@angular/core';
import { Category } from '../models/category.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { createThumbnail } from '../models/thumbnail.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService implements OnDestroy {

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
              return new Category(
                category.name,
                category._id,
                category.label,
                createThumbnail(category.thumbnail)
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
        createThumbnail(savedCategory.thumbnail)
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
