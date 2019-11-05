import { Injectable, OnDestroy } from '@angular/core';
import { Issue } from '../models/issue.model';
import { makeid } from '../common/util/utils';
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Thumbnail } from '../models/thumbnail.model';
import { Image } from '../models/image.model';


@Injectable({
  providedIn: 'root'
})
export class IssuesService implements OnDestroy {

  get MOCK_ISSUES(): Issue[] {
    return this.mocks;
  }

  private mocks = [
    new Issue('April 2019', makeid(10), 'April 2019', null, true, false),
    new Issue('May 2019', makeid(10), 'May 2019', null, true, false),
    new Issue('June 2019', makeid(10), 'June 2019', null, true, false),
    new Issue('Dec 2019', makeid(10), 'Dec 2019', null, true, false),
    new Issue('June 2019', makeid(10), 'June 2019', null, true, false),
    new Issue('Dec 2019', makeid(10), 'Dec 2019', null, true, false),
    new Issue('June 2019', makeid(10), 'June 2019', null, true, false),
    new Issue('Dec 2019', makeid(10), 'Dec 2019', null, true, false)
  ];

  private issuesChanged = new Subject<Issue[]>();
  private isLoading = new BehaviorSubject(false);
  private allIssues: Issue[];
  private isSaved = new Subject<boolean>();

  constructor(private http: HttpClient) {

    this.issuesChanged.subscribe(aIssues => {
      this.mocks = aIssues;
    });
  }

  getIssuesChanged(): Subject<Issue | Issue[]> {
    return this.issuesChanged;
  }

  getAllIssues(): void {
    this.isLoading.next(true);
    this.http.get<{ message: string, issues: any }>
      (`${environment.api_url}/issues`)
      .pipe(
        map(result => {
          return {
            issues: result.issues.map(issue => {
              let img = null;
              //TODO remove unnecessary check
              if (!issue.thumbnail.image) {
                img = new Image();
              } else {
                img = new Image(
                  issue.thumbnail.image.publicId,
                  issue.thumbnail.image.format,
                  issue.thumbnail.image.tags,
                  issue.thumbnail.image.secureUrl,
                  issue.thumbnail.image.url,
                  issue.thumbnail.image._id
                );
              }
              return new Issue(
                issue.name,
                issue._id,
                issue.label,
                new Thumbnail(
                  issue.thumbnail._id,
                  img,
                  issue.thumbnail.caption,
                  issue.thumbnail.content,
                  issue.thumbnail.footer,
                  issue.thumbnail.header
                ),
                issue.published,
                issue.archived,
                issue.pdfUrl,
                issue.latest,
                issue.posts
              );
            })
          };
        })
      ).subscribe(issueData => {
        this.allIssues = issueData.issues.slice();
        this.issuesChanged.next(this.allIssues);
        this.isLoading.next(false);
        this.isSaved.next(true);
      }, error => {
        console.log(error.message);
        this.isLoading.next(false);
        this.isSaved.next(false);
      });
  }

  getIssue(id: string): Issue {
    return this.mocks.find(aIssue => aIssue.id === id);
  }

  private mapSavedIssue = savedData => {
    const savedIssue = savedData.issue;
    return {
      message: savedData.message,
      issue: new Issue(
        savedIssue.name,
        savedIssue._id,
        savedIssue.label,
        new Thumbnail(
          savedIssue.thumbnail._id,
          new Image(
            savedIssue.thumbnail.image.publicId,
            savedIssue.thumbnail.image.format,
            savedIssue.thumbnail.image.tags,
            savedIssue.thumbnail.image.secureUrl,
            savedIssue.thumbnail.image.url,
            savedIssue.thumbnail.image._id
          ),
          savedIssue.thumbnail.caption,
          savedIssue.thumbnail.content,
          savedIssue.thumbnail.footer,
          savedIssue.thumbnail.header
        ),
        savedIssue.published,
        savedIssue.archived,
        savedIssue.pdfUrl,
        savedIssue.latest,
        // TODO clone posts savedIssue.posts
      )
    }
  }

  saveIssue(issue: Issue) {
    this.isLoading.next(true);
    this.http.post<{ message: string, issue: any }>
      (`${environment.api_url}/issues`, issue.clone())
      .pipe(
        map(this.mapSavedIssue)
      )
      .subscribe(transformedData => {
        console.log(`Issue services.saveIssue() ${{ ...transformedData.issue }}`);
        this.allIssues.push(transformedData.issue);
        this.issuesChanged.next(this.allIssues.slice());
        this.isLoading.next(false);
      }, error => {
        console.log('Error occurred ' + error.message);
        this.isLoading.next(false);
        this.isSaved.next(false);
      })
  }

  updateIssue(issue: Issue) {
    this.isLoading.next(true);
    this.http.put<{ message: string, issue: any }>
      (`${environment.api_url}/issues`, issue.clone())
      .pipe(
        map(this.mapSavedIssue)
      )
      .subscribe(transformedData => {
        console.log(`Issue services.updateIssue() ${{ ...transformedData.issue }}`);
        this.issuesChanged.next(this.allIssues.slice());
        this.isLoading.next(false);
      }, error => {
        console.log('Error occurred ' + error.message);
        this.isLoading.next(false);
        this.isSaved.next(false);
      })
  }

  deleteIssue(issueid: string) {
    const deleted = this.mocks.filter(aIssue => aIssue
      .id !== issueid);
    this.issuesChanged.next(deleted);
  }

  deleteIssues(issueIds: string[]) {
    this.http.delete<{ message: string, deleteCount: number }>
      (`${environment.api_url}/issues/${issueIds}`)
      .subscribe(deletedData => {
        console.log(`Issues ${issueIds} deleted successfully`);
        //this.issuesChanged.next();
      }, error => {
        console.log('Error occurred ' + error.message);
      });
  }
  ngOnDestroy() {
    this.issuesChanged = null;
  }
}
