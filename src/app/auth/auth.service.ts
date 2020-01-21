import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient, private router: Router) { }

  private token = null;


  private isUserAuthenticated = new Subject<boolean>();
  private isAuth = false;

  private tokenExpiresIn: number = null;

  private timeout: any;

  private loggedInUserId = new Subject<string>();

  private readonly API_URL = `${environment.api_url}/users`;

  logout() {
    this.token = null;
    this.isUserAuthenticated.next(false);
    this.isAuth = false;
    clearTimeout(this.timeout);
    this.deleteTokenInfo();
    this.router.navigate(['auth/login']);
  }

  getLoggedInUserId() {
    return this.loggedInUserId;
  }

  isAuthenticated() {
    return this.isAuth;
  }

  getToken() {
    return this.token;
  }

  getIsUserAuthenticated() {
    return this.isUserAuthenticated.asObservable();
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    return this.http
      .post<{ token: string; expiresIn: number; username: string }>(
        `${this.API_URL}/login`,
        authData
      )
      .subscribe(
        res => {
          this.token = res.token;
          if (this.token) {
            this.isAuth = true;
            this.loggedInUserId.next(res.username);
            this.tokenExpiresIn = res.expiresIn * 1000; // In ms
            this.saveTokenInfo();
            this.addTimerForTokenExpiry();
            this.isUserAuthenticated.next(true);
            this.router.navigate(['/users']);
          } else {
            this.isUserAuthenticated.next(false);
            this.isAuth = false;
          }
        },
        error => {
          this.isAuth = false;
          this.isUserAuthenticated.next(false);
        }
      );
  }

  autoRestoreAuthSession() {
    const token = localStorage.getItem('borkcms-token');
    const tokenExpiresIn = new Date(localStorage.getItem('borkcms-expiresIn'));
    const now = new Date();
    const expiryTimeLeft = tokenExpiresIn.getTime() - now.getTime();
    if (expiryTimeLeft <= 0) {
      this.logout();
      return;
    }
    this.token = token;
    this.tokenExpiresIn = expiryTimeLeft;
    this.saveTokenInfo();
    this.addTimerForTokenExpiry();
    this.isAuth = true;
    this.isUserAuthenticated.next(true);
  }

  addTimerForTokenExpiry() {
    this.timeout = setTimeout(() => {
      this.logout();
    }, this.tokenExpiresIn);
  }

  saveTokenInfo() {
    localStorage.setItem('borkcms-token', this.token);
    const now = new Date();
    const tokenExpiresInFuture = new Date(now.getTime() + this.tokenExpiresIn);
    localStorage.setItem('borkcms-expiresIn', tokenExpiresInFuture.toISOString());
  }

  deleteTokenInfo() {
    localStorage.removeItem('borkcms-token');
    localStorage.removeItem('borkcms-expiresIn');
  }
}
