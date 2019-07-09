import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  usersList: User[] = null;
  columnsToDisplay: string[] = null;

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.usersList = this.usersService.getUsers();
    this.columnsToDisplay = ['name', 'username', 'email', 'address', 'roles'];
  }

}
