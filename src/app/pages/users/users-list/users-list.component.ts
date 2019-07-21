import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from 'src/app/models/user.model';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  usersList: User[] = null;
  columnsToDisplay: string[] = null;
  dataSource: MatTableDataSource<User>;

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.usersList = this.usersService.getUsers();
    this.dataSource = new MatTableDataSource(this.usersList);
    this.columnsToDisplay = ['name', 'username', 'email', 'address', 'roles'];
  }

}
