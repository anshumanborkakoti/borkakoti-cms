import { Injectable } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { PostDetail } from 'src/app/models/post-detail.model';
import { Category } from 'src/app/models/category.model';
import { Issue } from 'src/app/models/issue.model';
import { BehaviorSubject } from 'rxjs';
import { makeid } from 'src/app/common/util/utils';
import { Edit } from 'src/app/models/edit.model';
import { User } from 'src/app/models/user.model';
import { Author } from 'src/app/models/author.model';

const categories = new Category('Poetry', '123', 'Poetry');

const issues: Issue[] = [
  new Issue('April 2019', '1234', 'April 2019', null, true, false),
  new Issue('May 2019', '5678', 'May 2019', null, true, false)
];

const anshuman = new User('Anshuman');
const prarthana = new User('Prarthana');
const shiron = new User('Shiron');
const juti = new User('Juti');

const anshumanAuthor = new Author('Anshuman author');
const prarthanaAuthor = new Author('Prarthana author');

let posts: Post[] = [
  new Post(
    [anshumanAuthor, prarthanaAuthor],
    [
      new Edit(anshuman, 'Hi There', new Date()),
      new Edit(shiron, 'Edit 1', new Date()),
      new Edit(prarthana, 'Redo', new Date()),
      new Edit(juti, 'Edit 2', new Date()),
      new Edit(prarthana, 'Approved!', new Date()),
      new Edit(anshuman, 'Hi There', new Date()),
      new Edit(shiron, 'Edit 1', new Date()),
      new Edit(prarthana, 'Redo', new Date()),
      new Edit(juti, 'Edit 2', new Date()),
      new Edit(prarthana, 'Approved!', new Date())
    ],
    false,
    null,
    [new PostDetail()],
    false,
    categories,
    issues,
    'Post 1',
    makeid(10)
  ),
  new Post(
    [anshumanAuthor, prarthanaAuthor],
    [
      new Edit(anshuman, 'Hi There', new Date()),
      new Edit(shiron, 'Edit 1', new Date()),
      new Edit(prarthana, 'Redo', new Date()),
      new Edit(juti, 'Edit 2', new Date()),
      new Edit(prarthana, 'Approved!', new Date())
    ],
    true,
    null,
    [new PostDetail()],
    true,
    categories,
    issues,
    'Post 2',
    makeid(10)
  ),
  new Post(
    [anshumanAuthor, prarthanaAuthor],
    [
      new Edit(anshuman, 'Hi There', new Date()),
      new Edit(shiron, 'Edit 1', new Date()),
      new Edit(prarthana, 'Redo', new Date()),
      new Edit(juti, 'Edit 2', new Date()),
      new Edit(prarthana, 'Approved!', new Date())
    ],
    false,
    null,
    [new PostDetail()],
    false,
    categories,
    issues,
    'Post 3',
    makeid(10)
  ), new Post(
    [anshumanAuthor, prarthanaAuthor],
    [
      new Edit(anshuman, 'Hi There', new Date()),
      new Edit(shiron, 'Edit 1', new Date()),
      new Edit(prarthana, 'Redo', new Date()),
      new Edit(juti, 'Edit 2', new Date()),
      new Edit(prarthana, 'Approved!', new Date())
    ],
    true,
    null,
    [new PostDetail()],
    true,
    categories,
    issues,
    'Post 4',
    makeid(10)
  ),
  new Post(
    [anshumanAuthor, prarthanaAuthor],
    [
      new Edit(anshuman, 'Hi There', new Date()),
      new Edit(shiron, 'Edit 1', new Date()),
      new Edit(prarthana, 'Redo', new Date()),
      new Edit(juti, 'Edit 2', new Date()),
      new Edit(prarthana, 'Approved!', new Date())
    ],
    false,
    null,
    [new PostDetail()],
    false,
    categories,
    issues,
    'Post 1',
    makeid(10)
  ),
  new Post(
    [anshumanAuthor, prarthanaAuthor],
    [
      new Edit(anshuman, 'Hi There', new Date()),
      new Edit(shiron, 'Edit 1', new Date()),
      new Edit(prarthana, 'Redo', new Date()),
      new Edit(juti, 'Edit 2', new Date()),
      new Edit(prarthana, 'Approved!', new Date())
    ],
    true,
    null,
    [new PostDetail()],
    true,
    categories,
    issues,
    'Post 2',
    makeid(10)
  ),
  new Post(
    [anshumanAuthor, prarthanaAuthor],
    [
      new Edit(anshuman, 'Hi There', new Date()),
      new Edit(shiron, 'Edit 1', new Date()),
      new Edit(prarthana, 'Redo', new Date()),
      new Edit(juti, 'Edit 2', new Date()),
      new Edit(prarthana, 'Approved!', new Date())
    ],
    false,
    null,
    [new PostDetail()],
    false,
    categories,
    issues,
    'Post 3',
    makeid(10)
  ), new Post(
    [anshumanAuthor, prarthanaAuthor],
    [
      new Edit(anshuman, 'Hi There', new Date()),
      new Edit(shiron, 'Edit 1', new Date()),
      new Edit(prarthana, 'Redo', new Date()),
      new Edit(juti, 'Edit 2', new Date()),
      new Edit(prarthana, 'Approved!', new Date())
    ],
    true,
    null,
    [new PostDetail()],
    true,
    categories,
    issues,
    'Post 4',
    makeid(10)
  ),
  new Post(
    [anshumanAuthor, prarthanaAuthor],
    [
      new Edit(anshuman, 'Hi There', new Date()),
      new Edit(shiron, 'Edit 1', new Date()),
      new Edit(prarthana, 'Redo', new Date()),
      new Edit(juti, 'Edit 2', new Date()),
      new Edit(prarthana, 'Approved!', new Date())
    ],
    false,
    null,
    [new PostDetail()],
    false,
    categories,
    issues,
    'Post 1',
    makeid(10)
  ),
  new Post(
    [anshumanAuthor, prarthanaAuthor],
    [
      new Edit(anshuman, 'Hi There', new Date()),
      new Edit(shiron, 'Edit 1', new Date()),
      new Edit(prarthana, 'Redo', new Date()),
      new Edit(juti, 'Edit 2', new Date()),
      new Edit(prarthana, 'Approved!', new Date())
    ],
    true,
    null,
    [new PostDetail()],
    true,
    categories,
    issues,
    'Post 2',
    makeid(10)
  ),
  new Post(
    [anshumanAuthor, prarthanaAuthor],
    [
      new Edit(anshuman, 'Hi There', new Date()),
      new Edit(shiron, 'Edit 1', new Date()),
      new Edit(prarthana, 'Redo', new Date()),
      new Edit(juti, 'Edit 2', new Date()),
      new Edit(prarthana, 'Approved!', new Date())
    ],
    false,
    null,
    [new PostDetail()],
    false,
    categories,
    issues,
    'Post 3',
    makeid(10)
  ), new Post(
    [anshumanAuthor, prarthanaAuthor],
    [
      new Edit(anshuman, 'Hi There', new Date()),
      new Edit(shiron, 'Edit 1', new Date()),
      new Edit(prarthana, 'Redo', new Date()),
      new Edit(juti, 'Edit 2', new Date()),
      new Edit(prarthana, 'Approved!', new Date())
    ],
    true,
    null,
    [new PostDetail()],
    true,
    categories,
    issues,
    'Post 4',
    makeid(10)
  )
];

@Injectable({ providedIn: 'root' })
export class PostService {
  private postsObservable = new BehaviorSubject<Post[]>(posts);

  getPostObservable(): BehaviorSubject<Post[]> {
    return this.postsObservable;
  }

  deletePosts(postIds: string[]) {
    posts = posts.filter(aPost => {
      return !postIds.some(id => aPost.id === id);
    });
    this.postsObservable.next(posts.slice());
  }

  getPost(postid: string) {
    return posts.find(aPost => {
      return aPost.id === postid;
    });
  }
}
