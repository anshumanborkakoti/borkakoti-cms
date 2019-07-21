import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';

export class UsersService {

  private roles: string[] = ['Chief editor', 'admin', 'editor'];

  private dummyUsers: User[] = [
    new User('Anshuman', 'ansb', '123', Math.random().toString(32), 'abc@dfdf.com', 'dfdfds df ds ', ['admin']),
    new User('Hello', 'ansb', '123', Math.random().toString(32), 'abc@dfdf.com', 'dfdfds df ds ', ['Chief editor', 'admin']),
    new User('Prarthana', 'ansb', '123', Math.random().toString(32), 'abc@dfdf.com', 'dfdfds df ds ', ['editor']),
  ];

  getUsers(): User[] {
    return this.dummyUsers.slice();
  }

  getRoles(): string[] {
    return this.roles.slice();
  }

  getUser(id: string): User {
    return this.dummyUsers.find(user => {
      return user.id === id;
    });
  }

  saveUser(user: User) {
    const index = this.dummyUsers.findIndex(aUser => {
      return aUser.id === user.id;
    });
    if (index === -1) {
      this.dummyUsers.push(user);
    } else {
      this.dummyUsers.splice(index, 1, user);
    }
  }
}
