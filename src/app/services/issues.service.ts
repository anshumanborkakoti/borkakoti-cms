import { Injectable, OnDestroy } from '@angular/core';
import { Issue } from '../models/issue.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { createThumbnail } from '../models/thumbnail.model';


@Injectable({
  providedIn: 'root'
})
export class IssuesService implements OnDestroy {
  private issuesChanged = new Subject<Issue[]>();
  private isLoading = new BehaviorSubject(false);
  private allIssues: Issue[];
  private isSaved = new Subject<boolean>();
  private isDeleted = new Subject<boolean>();

  constructor(private http: HttpClient) {
  }

  getIssuesChanged(): Subject<Issue | Issue[]> {
    return this.issuesChanged;
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

  getAllIssues(): void {
    this.isLoading.next(true);
    this.http.get<{ message: string, issues: any }>
      (`${environment.api_url}/issues`)
      .pipe(
        map(result => {
          return {
            issues: result.issues.map(issue => {
              return new Issue(
                issue.name,
                issue._id,
                issue.label,
                createThumbnail(issue.thumbnail),
                issue.published,
                issue.archived,
                issue.pdfUrl,
                issue.latest
              );
            })
          };
        })
      ).subscribe(issueData => {
        this.allIssues = issueData.issues.slice();
        this.issuesChanged.next(this.allIssues.slice());
        this.isLoading.next(false);
        this.isSaved.next(true);
      }, error => {
        console.log(error.message);
        this.isLoading.next(false);
        this.isSaved.next(false);
      });
  }

  getIssue(id: string): Issue {
    return this.allIssues.find(aIssue => aIssue.id === id);
  }

  private mapSavedIssue = savedData => {
    const savedIssue = savedData.issue;
    return {
      message: savedData.message,
      issue: new Issue(
        savedIssue.name,
        savedIssue._id,
        savedIssue.label,
        createThumbnail(savedIssue.thumbnail),
        savedIssue.published,
        savedIssue.archived,
        savedIssue.pdfUrl,
        savedIssue.latest
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
        this.allIssues.push(issue);
        this.issuesChanged.next(this.allIssues.slice());
        this.isLoading.next(false);
        this.isSaved.next(true);
      }, error => {
        console.log('Error occurred ' + error.message);
        this.isLoading.next(false);
        this.isSaved.next(false);
      });
  }

  updateIssue(issue: Issue) {
    this.isLoading.next(true);
    const clonedIssue = issue.clone();
    this.http.put<{ message: string, issue: any }>
      (`${environment.api_url}/issues`, clonedIssue)
      .pipe(
        map(this.mapSavedIssue)
      )
      .subscribe(transformedData => {
        console.log(`Issue services.updateIssue() ${{ ...transformedData.issue }}`);
        const issueIndex = this.allIssues.findIndex(currentIssue => currentIssue.id === clonedIssue.id);
        this.allIssues.splice(issueIndex, 1, clonedIssue);
        this.issuesChanged.next(this.allIssues.slice());
        this.isLoading.next(false);
        this.isSaved.next(true);
      }, error => {
        console.log('Error occurred ' + error.message);
        this.isLoading.next(false);
        this.isSaved.next(false);
      });
  }

  deleteIssue(issueid: string) {
    this.isLoading.next(true);
    const deleted = this.allIssues.filter(aIssue => aIssue
      .id !== issueid);
    this.allIssues = deleted;
    this.deleteIssues([issueid]);
  }

  deleteIssues(issueIds: string[]) {
    this.isLoading.next(true);
    this.http.delete<{ message: string, deleteCount: number }>
      (`${environment.api_url}/issues/${issueIds}`)
      .subscribe(deletedData => {
        console.log(`Issues ${issueIds} deleted successfully`);
        const deleted = this.allIssues.filter(aIssue => {
          return !issueIds.some(id => id === aIssue.id);
        });
        this.allIssues = deleted;
        this.isLoading.next(false);
        this.issuesChanged.next(this.allIssues.slice());
        this.isDeleted.next(true);
      }, error => {
        console.log('Error occurred ' + error.message);
        this.isLoading.next(false);
        this.isDeleted.next(false);
      });
  }
  ngOnDestroy() {
    this.issuesChanged = null;
  }
}
