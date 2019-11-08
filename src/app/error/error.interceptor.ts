import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error.component';
import { throwError } from 'rxjs';

export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next
      .handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.dialog.open(ErrorComponent, { data: { message: error.error.message } });
          return throwError(error);
        })
      )
      ;
  }
}
