import { Injectable, OnDestroy } from '@angular/core';
import { Issue } from '../models/issue.model';
import { makeid } from '../common/util/utils';
import { Subject } from 'rxjs';


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

  constructor() {

    this.issuesChanged.subscribe(aIssues => {
      this.mocks = aIssues;
    });
  }

  getIssuesChanged(): Subject<Issue | Issue[]> {
    return this.issuesChanged;
  }

  getAllIssues(): Issue[] {
    return [
      ...this.mocks
    ];
  }

  getIssue(id: string): Issue {
    return this.mocks.find(aIssue => aIssue.id === id);
  }

  saveIssue(issue: Issue) {

  }

  deleteIssue(issueid: string) {
    const deleted = this.mocks.filter(aIssue => aIssue
      .id !== issueid);
    this.issuesChanged.next(deleted);
  }

  deleteIssues(issueIds: string[]) {
    const deleted = this.mocks.filter(aIssue => {
      let isIncluded = true;
      for (const id of issueIds) {
        if (id === aIssue.id) {
          isIncluded = false;
          break;
        }
      }
      return isIncluded;
    });
    this.issuesChanged.next(deleted);
  }
  ngOnDestroy() {
    this.issuesChanged = null;
  }
}
