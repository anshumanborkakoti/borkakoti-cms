import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './auth.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.headers.has('Authorization')) {
      return next.handle(req);
    }
    const authenticatedRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + this.authService.getToken())
    });
    return next.handle(authenticatedRequest);
  }
}
