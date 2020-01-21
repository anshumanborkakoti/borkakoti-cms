import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ROLES } from 'src/app/common/util/constants';

@Injectable({ providedIn: 'root' })
export class UsersService {

  private roles: string[] = [ROLES.CHIEF_EDITOR, ROLES.ADMIN, ROLES.EDITOR];

  private users: User[] = [];
  private usersSubject: Subject<User[]> = new Subject();
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isSaved: Subject<boolean> = new Subject();

  constructor(private http: HttpClient) { }

  getIsLoadingSubject() {
    return this.isLoading;
  }

  getUsers() {
    this.isLoading.next(true);
    this.http
      .get<{ message: string; users: any }>
      (`${environment.api_url}/users`)
      .pipe(
        map(userData => {
          return {
            users: userData.users.map(user => {
              return new User(user.name, user.username, user.password, user._id, user.email, user.address, user.roles);
            })
          };
        })
      ).subscribe(userData => {
        this.users = userData.users;
        this.usersSubject.next(this.users.slice());
        this.isLoading.next(false);
      }, error => {
        console.log(error.message);
        this.isLoading.next(false);
      });
  }

  getRoles(): string[] {
    return this.roles.slice();
  }

  getUser(id: string): User {
    return this.users.find(user => {
      return user.id === id;
    });
  }

  getUsersObservable(): Observable<User[]> {
    return this.usersSubject;
  }

  getIsSavedObservable(): Observable<boolean> {
    return this.isSaved;
  }

  private saveNewUser(user: User) {
    this.isLoading.next(true);
    this.http
      .post<{ message: string; user: any }>(`${environment.api_url}/users`, user)
      .pipe(
        map(savedData => {
          const saveduser = savedData.user;
          return {
            message: savedData.message,
            user: new User(saveduser.name, saveduser.username, saveduser.password, saveduser._id, saveduser.email,
              saveduser.address, saveduser.roles)
          };
        })
      )
      .subscribe(transformedData => {
        this.users.push(transformedData.user);
        this.usersSubject.next(this.users.slice());
        this.isLoading.next(false);
        this.isSaved.next(true);
      }, error => {
        console.log('Error occurred ' + error.message);
        this.isLoading.next(false);
        this.isSaved.next(false);
      });
  }

  private updateUser(user: User, index: number) {
    this.isLoading.next(true);
    this.http
      .put<{ message: string; user: any }>(`${environment.api_url}/users/${user.id}`, user)
      .pipe(
        map(updatedData => {
          const updateUser = updatedData.user;
          return {
            message: updatedData.message,
            user: new User(updateUser.name, updateUser.username, updateUser.password, updateUser._id, updateUser.email,
              updateUser.address, updateUser.roles)
          };
        }))
      .subscribe(transformedUpdatedData => {
        this.users.splice(index, 1, transformedUpdatedData.user);
        this.usersSubject.next(this.users.slice());
        this.isLoading.next(false);
        this.isSaved.next(true);
      }, error => {
        console.log('Error occurred ' + error.message);
        this.isLoading.next(false);
        this.isSaved.next(false);
      });
  }

  saveUser(user: User) {
    const index: number = this.users.findIndex(aUser => {
      return aUser.id === user.id;
    });
    if (index === -1) {
      //New user
      this.saveNewUser(user);
    } else {
      //Existing user
      this.updateUser(user, index);
    }
  }

  deleteUser(userId: string) {
    const index = this.users.findIndex(aUser => {
      return aUser.id === userId;
    });
    if (index === -1) {
      console.log(`deleteUser() : No user found for user id ${userId}`);
      return;
    } else {
      this.isLoading.next(true);
      this.http
        .delete<{ message: string; }>(`${environment.api_url}/users/${userId}`)
        .subscribe(
          response => {
            console.log(response.message);
            this.users.splice(index, 1);
            this.usersSubject.next(this.users.slice());
            this.isLoading.next(false);
          },
          error => {
            console.log('Error occurred ' + error.message);
            this.isLoading.next(false);
          }
        );
    }
  }
}
