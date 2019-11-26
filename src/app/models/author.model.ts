import { User } from './user.model';
import { Thumbnail, createThumbnail } from './thumbnail.model';
import { cloneCmsClass } from '../common/util/utils';
import { CmsClass } from './general-class.interface';

export class Author extends User implements CmsClass<Author> {

  *[Symbol.iterator]() {
    yield this.name;
    yield this.username;
    yield this.id;
    yield this.email;
    yield this.address;
    yield this.roles;
    yield* this.details;
  }

  constructor(
    name: string = '',
    username: string = '',
    password: string = '',
    id: string = null,
    email: string = '',
    address: string = '',
    roles: string[] = ['Author'],
    public details: Thumbnail = null
  ) {
    super(name, username, password, id, email, address, roles);
  }
  clone(): Author {
    return new Author(
      this.name,
      this.username,
      this.password,
      this.id,
      this.email,
      this.address,
      [...this.roles],
      cloneCmsClass(this.details)
    );
  }
}


export function createAuthor({ name, username, password, id, _id, email, address, roles, details }): Author {
  return new Author(
    name,
    username,
    password,
    _id || id || null,
    email,
    address,
    roles,
    createThumbnail(details)
  );
}

export function createAuthors(authorArray: [{ name, username, password, id, _id, email, address, roles, details }]): Author[] {
  return authorArray.map(aAuthorOb => {
    return createAuthor(aAuthorOb);
  });
}
