import { Component, OnInit } from '@angular/core';
import { IssuesService } from 'src/app/services/issues.service';

@Component({
  selector: 'app-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss']
})
export class IssuesListComponent implements OnInit {

  constructor(private issuesService: IssuesService) { }

  ngOnInit() {
  }

}
