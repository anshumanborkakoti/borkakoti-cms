import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Author } from 'src/app/models/author.model';
import { Subscription, Subject } from 'rxjs';
import { AuthorsService } from 'src/app/services/authors.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as Utils from 'src/app/common/util/utils';
import { Thumbnail } from 'src/app/models/thumbnail.model';
import { MatSnackBar } from '@angular/material';
import { DETAIL_MODES } from 'src/app/common/util/constants';

@Component({
  selector: 'app-authors-detail',
  templateUrl: './authors-detail.component.html',
  styleUrls: ['./authors-detail.component.scss']
})
export class AuthorsDetailComponent implements OnInit, OnDestroy {

  form: FormGroup;
  currentAuthor: Author;
  showErrorIf = Utils.showErrorIf;
  saveThumbnail = new Subject<void>();
  isLoading = false;
  private mode: string;
  private loadingSubscription = new Subscription();
  private isSavedSubscription = new Subscription();

  constructor(
    private authorsService: AuthorsService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    const authorId = this.activeRoute.snapshot.paramMap.get('authorid');
    this.mode = this.activeRoute.snapshot.queryParamMap.get('mode');
    this.currentAuthor = this.authorsService.getAuthor(authorId);
    if (this.mode === DETAIL_MODES.update && !this.currentAuthor) {
      this.router.navigate(['authors']);
    }
    if (!this.currentAuthor) {
      this.currentAuthor = new Author();
    }
    if (!this.currentAuthor.details) {
      this.currentAuthor.details = new Thumbnail();
    }
    this.loadingSubscription = this.authorsService.getIsLoadingSubject()
      .subscribe(aIsLoading => this.isLoading = !!aIsLoading);
    this.form = new FormGroup({
      name: new FormControl(this.currentAuthor.name, [Validators.required]),
      email: new FormControl(this.currentAuthor.email, [Validators.email, Validators.required]),
      address: new FormControl(this.currentAuthor.address),
      thumbnail: new FormControl(this.currentAuthor.details)
    });
    this.isSavedSubscription = this.authorsService.getIsSavedObservable()
      .subscribe(isSaved => {
        if (isSaved) {
          this.router.navigate(['authors']);
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
      // New author
      const author = new Author(
        values.name,
        null,
        null,
        null,
        values.email,
        values.address,
        undefined,
        thumbnail.clone()
      );
      this.authorsService.saveAuthor(author);
    } else if (this.mode === DETAIL_MODES.update) {
      // Update author
      const author = new Author(
        values.name,
        null,
        null,
        this.currentAuthor.id,
        values.email,
        values.address,
        undefined,
        thumbnail.clone()
      );
      this.authorsService.saveAuthor(author);
    }
  }

  saveAuthor() {
    this.saveThumbnail.next();
  }

  ngOnDestroy(): void {
    this.saveThumbnail.unsubscribe();
    this.loadingSubscription.unsubscribe();
    this.isSavedSubscription.unsubscribe();
  }

}
