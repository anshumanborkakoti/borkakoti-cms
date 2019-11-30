import { CmsClass } from './general-class.interface';
export class User implements CmsClass<User> {

  equals(that: User): boolean {
    return this.id === that.id;
  }
  clone(): User {
    return new User(
      this.name,
      this.username,
      this.password,
      this.id,
      this.email,
      this.address,
      [...this.roles]
    );
  }
  constructor(
    public name: string = '',
    public username: string = '',
    public password: string = '',
    public id: string = '',
    public email: string = '',
    public address: string = '',
    public roles: string[] = []
  ) { }
}

export function createUser({ name, username, password, id, _id, email, address, roles }): User {
  return new User(
    name,
    username,
    password,
    _id || id,
    email,
    address,
    [...roles]
  );
}
