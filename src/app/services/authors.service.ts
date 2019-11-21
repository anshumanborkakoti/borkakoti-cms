import { Injectable } from '@angular/core';
import { Author } from '../models/author.model';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { createThumbnail } from '../models/thumbnail.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {
  private roles: string[] = ['Author'];

  private authors: Author[] = [];
  private authorsSubject: Subject<Author[]> = new Subject();
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isSaved: Subject<boolean> = new Subject();
  private isDeleted: Subject<boolean> = new Subject();
  private API_URL = `${environment.api_url}/authors`;

  constructor(private http: HttpClient) { }

  getIsLoadingSubject() {
    return this.isLoading;
  }

  getIsDeleted(): Subject<boolean> {
    return this.isDeleted;
  }

  getAuthors() {
    this.isLoading.next(true);
    this.http
      .get<{ message: string; authors: any }>
      (this.API_URL)
      .pipe(
        map(authorData => {
          return {
            authors: authorData.authors.map(author => {
              return new Author(
                author.name,
                author.username,
                author.password,
                author._id,
                author.email,
                author.address,
                author.roles,
                createThumbnail(author.details)
              );
            })
          };
        })
      ).subscribe(authorData => {
        this.authors = authorData.authors;
        this.authorsSubject.next(this.authors.slice());
        this.isLoading.next(false);
      }, error => {
        console.log(error.message);
        this.isLoading.next(false);
      });
  }

  getRoles(): string[] {
    return this.roles.slice();
  }

  getAuthor(id: string): Author {
    return this.authors.find(author => {
      return author.id === id;
    });
  }

  getAuthorsObservable(): Observable<Author[]> {
    return this.authorsSubject;
  }

  getIsSavedObservable(): Observable<boolean> {
    return this.isSaved;
  }

  private saveNewAuthor(author: Author) {
    this.isLoading.next(true);
    this.http
      .post<{ message: string; author: any }>(this.API_URL, author)
      .pipe(
        map(savedData => {
          const savedAuthor = savedData.author;
          return {
            message: savedData.message,
            author: new Author(
              savedAuthor.name,
              savedAuthor.username,
              savedAuthor.password,
              savedAuthor._id,
              savedAuthor.email,
              savedAuthor.address,
              savedAuthor.roles,
              createThumbnail(savedAuthor.details)
            )
          };
        })
      )
      .subscribe(transformedData => {
        this.authors.push(transformedData.author);
        this.authorsSubject.next(this.authors.slice());
        this.isLoading.next(false);
        this.isSaved.next(true);
      }, error => {
        console.log('Error occurred ' + error.message);
        this.isLoading.next(false);
        this.isSaved.next(false);
      });
  }

  private updateAuthor(author: Author) {
    this.isLoading.next(true);
    this.http
      .put<{ message: string; author: any }>(`${this.API_URL}/${author.id}`, author)
      .pipe(
        map(updatedData => {
          const updatedAuthor = updatedData.author;
          return {
            message: updatedData.message,
            author: new Author(
              updatedAuthor.name,
              updatedAuthor.username,
              updatedAuthor.password,
              updatedAuthor._id,
              updatedAuthor.email,
              updatedAuthor.address,
              updatedAuthor.roles,
              createThumbnail(updatedAuthor.details)
            )
          };
        }))
      .subscribe(transformedUpdatedData => {
        const index = this.authors.findIndex(aAuthor => aAuthor.id === author.id);
        this.authors.splice(index, 1, transformedUpdatedData.author);
        this.authorsSubject.next(this.authors.slice());
        this.isLoading.next(false);
        this.isSaved.next(true);
      }, error => {
        console.log('Error occurred ' + error.message);
        this.isLoading.next(false);
        this.isSaved.next(false);
      });
  }

  saveAuthor(author: Author) {
    const index: number = this.authors.findIndex(aAuthor => {
      return aAuthor.id === author.id;
    });
    if (index === -1) {
      // New author
      this.saveNewAuthor(author);
    } else {
      // Existing author
      this.updateAuthor(author);
    }
  }


  deleteAuthor(aAuthorId: string) {
    this.isLoading.next(true);
    const deleted = this.authors.filter(aAuthor => aAuthor
      .id !== aAuthorId);
    this.authors = deleted;
    this.deleteAuthors([aAuthorId]);
  }

  deleteAuthors(aAuthorIds: string[]) {
    this.isLoading.next(true);
    this.http.delete<{ message: string, deleteCount: number }>
      (`${this.API_URL}/${aAuthorIds}`)
      .subscribe(deletedData => {
        console.log(`Authors ${aAuthorIds} deleted successfully`);
        const deleted = this.authors.filter(aAuthor => {
          return !aAuthorIds.some(id => id === aAuthor.id);
        });
        this.authors = deleted;
        this.isLoading.next(false);
        this.authorsSubject.next(this.authors.slice());
        this.isDeleted.next(true);
      }, error => {
        console.log('Error occurred ' + error.message);
        this.isLoading.next(false);
        this.isDeleted.next(false);
      });
  }
}
