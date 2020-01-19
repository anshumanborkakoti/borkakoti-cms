import { CmsClass } from './general-class.interface';

export class Comment implements CmsClass<Comment> {

  constructor(
    public id = '',
    public postId: string = '',
    public author: string = '',
    public comment: string = '',
    public approved: boolean = false,
    public timestamp: Date = null
  ) { }

  equals(that: Comment): boolean {
    return this.id === that.id;
  }


  clone(): Comment {
    return new Comment(
      this.id,
      this.postId,
      this.author,
      this.comment,
      this.approved,
      this.timestamp
    );
  }
}

export const createComment = ({ id, _id, postId, author, comment, approved, timestamp }): Comment => {
  return new Comment(
    id || id || null,
    postId,
    author,
    comment,
    approved,
    timestamp
  );
}
