import { CmsClass } from './general-class.interface';
import { makeid } from '../common/util/utils';

export class User implements CmsClass<User>{

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
    public id: string = makeid(10),
    public email: string = '',
    public address: string = '',
    public roles: string[] = []
  ) { }
}
