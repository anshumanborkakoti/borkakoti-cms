import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {

  usersList: User[] = [];
  isLoading = false;
  private observerIsLoading: Subscription;
  private usersSub: Subscription;

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.usersService.getUsers();
    this.usersSub = this.usersService.getUsersObservable().subscribe((users: User[]) => {
      this.usersList = users;
    });
    this.observerIsLoading = this.usersService.getIsLoadingSubject()
      .subscribe(aIsLoading => {
        this.isLoading = aIsLoading;
      });
  }

  deleteUser(userId: string) {
    this.usersService.deleteUser(userId);
  }

  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
    this.observerIsLoading.unsubscribe();
  }
}
