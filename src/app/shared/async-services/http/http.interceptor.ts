import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHandler,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpUserEvent,
  HttpEvent
} from '@angular/common/http';

import {
  throwError as observableThrowError,
  Observable,
  BehaviorSubject
} from 'rxjs';
import {
  take,
  filter,
  catchError,
  switchMap,
  finalize,
  tap
} from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToasterService } from '@shared/utility/toaster.service';
import { LoaderService } from '@shared/utility/loader.service';
import { AuthService } from '@app/features-modules/auth/auth.service';

@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private requests: HttpRequest<any>[] = [];

  constructor(
    private injector: Injector,
    private loaderService: LoaderService,
    private toastrService: ToasterService,
    private router: Router
  ) { }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<
    | HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<any>
    | HttpUserEvent<any>
  > {
    const authService = this.injector.get(AuthService);

    if (request.url.indexOf('GetActivityNotifications') === -1) {
      this.loaderService.isLoading.next(true);
    }
    this.requests.push(request);

    return next.handle(this.addToken(request, authService.getAuthToken())).pipe(
      tap((ev: HttpEvent<any>) => {
        if (ev instanceof HttpResponse) {
          this.removeRequest(request);
          // console.log('processing response', ev);
        }
      }),
      catchError(error => {
        this.removeRequest(request);
        if (error instanceof HttpErrorResponse) {
          switch ((<HttpErrorResponse>error).status) {
            case 400:
              return this.handle400Error(error);
            case 401:
              return this.handle401Error(request, next);
            case 422:
              return this.handle422Error(error);
            case 500:
              return this.handle500Error(error);
            default:
              return observableThrowError(error);
          }
        } else {
          this.toastrService.error(error.statusText);
          return observableThrowError(error);
        }
      }),
      finalize(() => {
        //console.log('enter final');
        this.removeRequest(request);
      })
    );
  }

  handle400Error(error) {
    if (error && error.status === 400) {
      if (error.error.errors !== undefined  && error.error.errors.enquiryId !== undefined) {
        this.toastrService.error(error.error.errors.enquiryId);
      }
      else {
        this.toastrService.error(error.error.title);
      }
      return observableThrowError(error);
    }
  }

  handle500Error(error) {
    if (error && error.status === 500) {
      this.toastrService.error(error.error.message);
      return observableThrowError(error);
    }
  }

  handle422Error(error) {
    if (
      error &&
      error.status === 422
    ) {
      this.toastrService.error(error.error.Value.Message[0]);
      return observableThrowError(error);
    }
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);

      const authService = this.injector.get(AuthService);
      authService.collectFailedRequest(req);

      return authService.refreshToken().pipe(
        switchMap((newToken: any) => {
          if (newToken) {
            this.tokenSubject.next(newToken.accessToken);
            return next.handle(this.addToken(req, newToken.accessToken));
          }
          // If we don't get a new token, we are in trouble so logout.
          return this.logoutUser();
        }),
        catchError(() => {
          // If there is an exception calling 'refreshToken', bad news so logout.
          return this.logoutUser();
        }),
        finalize(() => {
          this.isRefreshingToken = false;
        })
      );
    } else {
      return this.tokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(req, token));
        })
      );
    }
  }
  logoutUser() {
    const authService = this.injector.get(AuthService);
    authService.localLogout();
    this.loaderService.isLoading.next(false);
    this.router.navigateByUrl('/');
    return observableThrowError('');
  }
}
