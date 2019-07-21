export class User {
  constructor(
    public name: string = '',
    public username: string = '',
    public password: string = '',
    public id: string = Math.random().toString(32),
    public email: string = '',
    public address: string = '',
    public roles: string[] = []
  ) { }
}
