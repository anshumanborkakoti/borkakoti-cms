import { Injectable } from '@angular/core';
import { Issue } from '../models/issue.model';
import { makeid } from '../common/util/utils';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  get MOCK_ISSUES(): Issue[] {
    return [
      new Issue('April 2019', '1234', 'April 2019', null, true, false),
      new Issue('May 2019', '5678', 'May 2019', null, true, false)
    ];
  }

  constructor() { }

  getAllIssues(): Issue[] {
    return [
      ...this.MOCK_ISSUES,
      new Issue('June 2019', makeid(10), 'June 2019', null, true, false),
      new Issue('Dec 2019', makeid(10), 'Dec 2019', null, true, false),
    ];
  }

  getIssue(id: string): Issue {
    return null;
  }

  saveIssue(issue: Issue) {

  }
}
