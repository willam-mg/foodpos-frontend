import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private count = 0;

  constructor(
    public auth: AuthService,
    private router: Router,
    private loadingService: LoadingService) {
  }

  private handleError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401) {
      this.auth.logout();
      this.router.navigate(['/login']);
    }
    return throwError(err);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.isAuthenticated()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      });
    }

    if (this.count === 0) {
      this.loadingService.setHttpProgressStatus(true);
    }
    this.count++;

    return next.handle(request).pipe(
      finalize(() => {
        this.count--;
        if (this.count === 0) {
          this.loadingService.setHttpProgressStatus(false);
        }
      })).pipe(
        catchError(err => this.handleError(err))
      );
  }
}
