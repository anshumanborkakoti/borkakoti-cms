import { Injectable } from '@angular/core';
import { Post, createPost } from 'src/app/models/post.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class PostService {

  private postsChanged = new Subject<Post[]>();
  private isLoading = new BehaviorSubject(false);
  private allPosts: Post[];
  private isSaved = new Subject<boolean>();
  private isDeleted = new Subject<boolean>();
  private get API_URL() {
    return `${environment.api_url}/posts`;
  }

  constructor(private http: HttpClient) {
  }

  getPostsChanged(): Subject<Post[]> {
    return this.postsChanged;
  }

  getIsLoading(): BehaviorSubject<boolean> {
    return this.isLoading;
  }

  getIsSaved(): Subject<boolean> {
    return this.isSaved;
  }

  getIsDeleted(): Subject<boolean> {
    return this.isDeleted;
  }

  getAllPosts(): void {
    this.isLoading.next(true);
    this.http.get<{ message: string, posts: any[] }>
      (this.API_URL)
      .pipe(
        map(result => {
          return {
            message: result.message,
            posts: result.posts.map(aPost => {
              return createPost(aPost);
            })
          };
        })
      ).subscribe(postData => {
        this.allPosts = postData.posts.slice();
        this.postsChanged.next(this.allPosts.slice());
        this.isLoading.next(false);
      }, error => {
        console.log(error.message);
        this.isLoading.next(false);
      });
  }

  getPost(id: string): Subject<Post> {
    const postSub = new Subject<Post>();
    let post = null;
    if (this.allPosts && this.allPosts.length > 0) {
      post = this.allPosts.find(aPost => aPost.id === id);
    }
    if (post) {
      return new BehaviorSubject<Post>(post);
    } else {
      // Otherwise reach out over http
      this.isLoading.next(true);
      this.http.get<{ code: string, message?: string, posts: any[] }>
        (this.API_URL, {
          params: {
            postid: id
          }
        })
        .pipe(
          map(aPost => {
            if (aPost && Array.isArray(aPost.posts) && aPost.posts.length > 0) {
              return createPost(aPost.posts[0]);
            }
            return null;
          })
        )
        .subscribe(
          aPost => {
            postSub.next(aPost);
            this.isLoading.next(false);
          },
          error => {
            console.error(`[PostService.getPost] Error occurred ${error.message} Code ${error.code}`);
            this.isLoading.next(false);
          }
        )
    }
    return postSub;
  }

  private mapSavedPost = (savedData: { message: string, post: any }) => {
    return {
      message: savedData.message,
      post: createPost(savedData.post)
    };
  }

  savePost(aPostToSave: Post) {
    this.isLoading.next(true);
    this.isSaved.next(false);
    this.http.post<{ message: string, post: any }>
      (this.API_URL, aPostToSave.clone())
      .pipe(
        map(this.mapSavedPost)
      )
      .subscribe(transformedData => {
        console.log(`[savedPost] ${{ ...transformedData.post }}`);
        this.allPosts.push(aPostToSave);
        this.postsChanged.next(this.allPosts.slice());
        this.isLoading.next(false);
        this.isSaved.next(true);
      }, error => {
        console.log('Error occurred ' + error.message);
        this.isLoading.next(false);
        this.isSaved.next(false);
      });
  }

  updatePost(aPost: Post) {
    this.isLoading.next(true);
    this.isSaved.next(false);
    const aClonedPost = aPost.clone();
    this.http.put<{ message: string, post: any }>
      (this.API_URL, aClonedPost)
      .pipe(
        map(this.mapSavedPost)
      )
      .subscribe(transformedData => {
        console.log(`updatePost() ${{ ...transformedData.post }}`);
        const postIndex = this.allPosts.findIndex(aCurrentPost => aCurrentPost.id === aClonedPost.id);
        this.allPosts.splice(postIndex, 1, aClonedPost);
        this.postsChanged.next(this.allPosts.slice());
        this.isLoading.next(false);
        this.isSaved.next(true);
      }, error => {
        console.log('Error occurred ' + error.message);
        this.isLoading.next(false);
        this.isSaved.next(false);
      });
  }

  deletePost(aPostId: string) {
    this.isLoading.next(true);
    const deleted = this.allPosts.filter(aPost => aPost
      .id !== aPostId);
    this.allPosts = deleted;
    this.deletePosts([aPostId]);
  }

  deletePosts(aPostIds: string[]) {
    this.isLoading.next(true);
    this.http.delete<{ message: string, deleteCount: number }>
      (`${this.API_URL}/${aPostIds}`)
      .subscribe(deletedData => {
        console.log(`Posts ${aPostIds} deleted successfully. Deleted count ${deletedData.deleteCount}`);
        const deleted = this.allPosts.filter(aPost => {
          return !aPostIds.some(id => id === aPost.id);
        });
        this.allPosts = deleted;
        this.isLoading.next(false);
        this.postsChanged.next(this.allPosts.slice());
        this.isDeleted.next(true);
      }, error => {
        console.log('Error occurred ' + error.message);
        this.isLoading.next(false);
        this.isDeleted.next(false);
      });
  }
}
