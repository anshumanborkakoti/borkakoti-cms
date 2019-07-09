import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';

export class UsersService {

  private dummyUsers: User[] = [
    new User('Anshuman', 'ansb', '123', '23232323dsd', 'abc@dfdf.com', 'dfdfds df ds ', ['admin']),
    new User('Anshumdsdan', 'ansb', '123', '23232323dsd', 'abc@dfdf.com', 'dfdfds df ds ', ['Chief editor', 'admin']),
    new User('Prarthana', 'ansb', '123', '23232323dsd', 'abc@dfdf.com', 'dfdfds df ds ', ['editor']),
  ];

  getUsers(): User[] {
    return this.dummyUsers.slice();
  }

}
