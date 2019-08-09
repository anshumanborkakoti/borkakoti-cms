import { Injectable } from '@angular/core';
import { Author } from '../models/author.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {
  get MOCK_AUTHORS(): Author[] {
    return [
      new Author('Anshuman author'),
      new Author('Prarthana author')
    ];
  }

  constructor() { }

  getAllAuthors(): Author[] {
    return [
      ...this.MOCK_AUTHORS,
      new Author('Shiron author'),
      new Author('Pranitha author'),
      new Author('Juti author'),
    ];
  }

  getAuthor(id: string): Author {
    return null;
  }

  saveAuthor(id: string): void {

  }
}
