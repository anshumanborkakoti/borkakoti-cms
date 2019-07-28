import { Injectable } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { PostDetail } from 'src/app/models/post-detail.model';
import { Category } from 'src/app/models/category.model';
import { MatTableDataSource } from '@angular/material';
import { Issue } from 'src/app/models/issue.model';
import { post } from 'selenium-webdriver/http';
import { BehaviorSubject } from 'rxjs';

const categories: Category[] = [
  new Category('Category 1', '', 'Category 1 label'),
  new Category('Category 2', '', 'Category 2 label'),
  new Category('Category 3', '', 'Category 3 label'),
  new Category('Category 4', '', 'Category 4 label')
];

const issues: Issue[] = [
  new Issue('April 2019', '', 'April 2019', null, true, false),
  new Issue('May 2019', '', 'May 2019', null, true, false),
  new Issue('June 2019', '', 'June 2019', null, true, false),
  new Issue('Dec 2019', '', 'Dec 2019', null, true, false),
]

let posts: Post[] = [
  new Post(
    ['anshuman', 'prarthana'],
    [],
    false,
    false,
    null,
    new PostDetail([], 'Post 1', 'Hello post', 'footer post'),
    false,
    categories,
    issues,
    'Post 1',
    Math.random().toString(32)
  ),
  new Post(
    ['anshuman', 'prarthana'],
    [],
    true,
    true,
    null,
    new PostDetail([], 'Post 1', 'Hello post', 'footer post'),
    true,
    categories,
    issues,
    'Post 2',
    Math.random().toString(32)
  ),
  new Post(
    ['anshuman', 'prarthana'],
    [],
    false,
    false,
    null,
    new PostDetail([], 'Post 1', 'Hello post', 'footer post'),
    false,
    categories,
    issues,
    'Post 3',
    Math.random().toString(32)
  ), new Post(
    ['anshuman', 'prarthana'],
    [],
    true,
    true,
    null,
    new PostDetail([], 'Post 1', 'Hello post', 'footer post'),
    true,
    categories,
    issues,
    'Post 4',
    Math.random().toString(32)
  ),
  new Post(
    ['anshuman', 'prarthana'],
    [],
    false,
    false,
    null,
    new PostDetail([], 'Post 1', 'Hello post', 'footer post'),
    false,
    categories,
    issues,
    'Post 1',
    Math.random().toString(32)
  ),
  new Post(
    ['anshuman', 'prarthana'],
    [],
    true,
    true,
    null,
    new PostDetail([], 'Post 1', 'Hello post', 'footer post'),
    true,
    categories,
    issues,
    'Post 2',
    Math.random().toString(32)
  ),
  new Post(
    ['anshuman', 'prarthana'],
    [],
    false,
    false,
    null,
    new PostDetail([], 'Post 1', 'Hello post', 'footer post'),
    false,
    categories,
    issues,
    'Post 3',
    Math.random().toString(32)
  ), new Post(
    ['anshuman', 'prarthana'],
    [],
    true,
    true,
    null,
    new PostDetail([], 'Post 1', 'Hello post', 'footer post'),
    true,
    categories,
    issues,
    'Post 4',
    Math.random().toString(32)
  ),
  new Post(
    ['anshuman', 'prarthana'],
    [],
    false,
    false,
    null,
    new PostDetail([], 'Post 1', 'Hello post', 'footer post'),
    false,
    categories,
    issues,
    'Post 1',
    Math.random().toString(32)
  ),
  new Post(
    ['anshuman', 'prarthana'],
    [],
    true,
    true,
    null,
    new PostDetail([], 'Post 1', 'Hello post', 'footer post'),
    true,
    categories,
    issues,
    'Post 2',
    Math.random().toString(32)
  ),
  new Post(
    ['anshuman', 'prarthana'],
    [],
    false,
    false,
    null,
    new PostDetail([], 'Post 1', 'Hello post', 'footer post'),
    false,
    categories,
    issues,
    'Post 3',
    Math.random().toString(32)
  ), new Post(
    ['anshuman', 'prarthana'],
    [],
    true,
    true,
    null,
    new PostDetail([], 'Post 1', 'Hello post', 'footer post'),
    true,
    categories,
    issues,
    'Post 4',
    Math.random().toString(32)
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
}
