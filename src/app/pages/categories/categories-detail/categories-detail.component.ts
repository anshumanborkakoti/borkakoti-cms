import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category.model';
import * as utils from 'src/app/common/util/utils';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { MatSnackBar } from '@angular/material';
import { Thumbnail } from 'src/app/models/thumbnail.model';
import { DETAIL_MODES } from 'src/app/common/util/constants';

@Component({
  selector: 'app-categories-detail',
  templateUrl: './categories-detail.component.html',
  styleUrls: ['./categories-detail.component.scss']
})
export class CategoriesDetailComponent implements OnInit, OnDestroy {


  form: FormGroup;
  currentCategory: Category;
  showErrorIf = utils.showErrorIf;
  saveThumbnail = new Subject<void>();
  isLoading = false;
  private mode: string;
  private loadingSubscription = new Subscription();
  private isSavedSubscription = new Subscription();

  constructor(
    private categoriesService: CategoryService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    const categoryId = this.activeRoute.snapshot.paramMap.get('id');
    this.mode = this.activeRoute.snapshot.queryParamMap.get('mode');
    this.currentCategory = this.categoriesService.getCategory(categoryId);
    if (!this.currentCategory) {
      this.currentCategory = new Category();
    }
    if (!this.currentCategory.thumbnail) {
      this.currentCategory.thumbnail = new Thumbnail();
    }
    this.loadingSubscription = this.categoriesService.getIsLoading()
      .subscribe(aIsLoading => this.isLoading = !!aIsLoading);
    this.form = new FormGroup({
      name: new FormControl(this.currentCategory.name, [Validators.required]),
      label: new FormControl(this.currentCategory.label, [Validators.required]),
      thumbnail: new FormControl(this.currentCategory.thumbnail)
      // TODO max and min posts?
    });
    this.isSavedSubscription = this.categoriesService.getIsSaved()
      .subscribe(isSaved => {
        if (isSaved) {
          this.router.navigate(['categories']);
          this.snackBar.open('Saved successfully', 'Saved', { duration: 5000 });
        }
      });
  }

  onThumbnailStatusChanged(status: string) {
    if (status === 'INVALID') {
      this.form.get('thumbnail').setErrors({
        invalid: true
      });
    } else if (status === 'VALID') {
      this.form.get('thumbnail').setErrors(null);
    }
  }

  onThumbnailSaved(thumbnail: Thumbnail) {
    const values = this.form.value;

    if (this.mode === DETAIL_MODES.create) {
      // New category
      const category = new Category(
        values.name,
        null,
        values.label,
        thumbnail.clone()
      );
      this.categoriesService.saveCategory(category);
    } else if (this.mode === DETAIL_MODES.update) {
      // Update category
      const category = new Category(
        values.name,
        this.currentCategory.id,
        values.label,
        thumbnail.clone()
      );
      this.categoriesService.updateCategory(category);
    }
  }

  saveCategory() {
    this.saveThumbnail.next();
  }

  ngOnDestroy(): void {
    this.saveThumbnail.unsubscribe();
    this.loadingSubscription.unsubscribe();
    this.isSavedSubscription.unsubscribe();
  }
}
