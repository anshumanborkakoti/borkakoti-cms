import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IssuesService } from 'src/app/services/issues.service';
import { ActivatedRoute } from '@angular/router';
import { Issue } from 'src/app/models/issue.model';
import { Thumbnail } from 'src/app/models/thumbnail.model';
import * as utils from 'src/app/common/util/utils';
import { Subject } from 'rxjs';
import { DETAIL_MODES } from 'src/app/common/util/constants';

@Component({
  selector: 'app-issues-detail',
  templateUrl: './issues-detail.component.html',
  styleUrls: ['./issues-detail.component.scss']
})
export class IssuesDetailComponent implements OnInit, OnDestroy {

  form: FormGroup;
  currentIssue: Issue;
  showErrorIf = utils.showErrorIf;
  saveThumbnail = new Subject<void>();
  private mode: string;

  constructor(private issuesService: IssuesService, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    const issueId = this.activeRoute.snapshot.paramMap.get('id');
    this.mode = this.activeRoute.snapshot.queryParamMap.get('mode');
    this.currentIssue = this.issuesService.getIssue(issueId);
    if (!this.currentIssue) {
      this.currentIssue = new Issue();
    }
    if (!this.currentIssue.thumbnail) {
      this.currentIssue.thumbnail = new Thumbnail();
    }
    this.form = new FormGroup({
      name: new FormControl(this.currentIssue.name, [Validators.required]),
      label: new FormControl(this.currentIssue.label, [Validators.required]),
      published: new FormControl(this.currentIssue.published),
      archived: new FormControl(this.currentIssue.archived),
      pdfUrl: new FormControl(this.currentIssue.pdfUrl, [Validators.required]),
      latest: new FormControl(this.currentIssue.latest),
      thumbnail: new FormControl(this.currentIssue.thumbnail)
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
      // New issue
      const issue = new Issue(
        values.name,
        null,
        values.label,
        thumbnail.clone(),
        values.published,
        values.archived,
        values.pdfUrl,
        values.latest,
        //TODO posts
      );
      this.issuesService.saveIssue(issue);
    } else if (this.mode === DETAIL_MODES.update) {
      // Update issue
      const issue = new Issue(
        values.name,
        this.currentIssue.id,
        values.label,
        thumbnail.clone(),
        values.published,
        values.archived,
        values.pdfUrl,
        values.latest,
        //TODO posts
      );
      this.issuesService.updateIssue(issue);
    }
  }

  saveIssue() {
    this.saveThumbnail.next();
  }

  ngOnDestroy(): void {
    this.saveThumbnail.unsubscribe();

  }
}
