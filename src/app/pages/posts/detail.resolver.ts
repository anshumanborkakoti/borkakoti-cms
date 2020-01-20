import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { PostService } from './posts.service';
import { DETAIL_MODES } from 'src/app/common/util/constants';
import { Category } from 'src/app/models/category.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostResolver implements Resolve<Post> {

  constructor(private postsService: PostService) { };

  resolve(
    activatedRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot)
    : Post | Observable<Post> | Promise<Post> {
    const postid = activatedRoute.params.postid;
    const mode = activatedRoute.queryParamMap.get('mode');
    let postP: Promise<Post> = null;
    if (mode === DETAIL_MODES.create) {
      const post = new Post();
      post.category = new Category();
      post.issues = [];
      post.authors = [];
      postP = Promise.resolve(post);
    } else if (mode === DETAIL_MODES.update) {
      postP = new Promise((resolve, reject) => {
        let postSub = null;
        postSub = this.postsService.getPost(postid).subscribe(
          aPost => {
            const resolution = () => {
              if (postSub) {
                postSub.unsubscribe();
              }
              return aPost;
            }
            resolve(resolution());
          }
        );
      });
    }
    return postP;
  }
}
