import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ApiService } from '../service/api.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private apiService: ApiService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        debugger;
        // add auth header with jwt if user is logged in and request is to the api url
        const user = this.apiService.userValue;
        const isLoggedIn = user && user.accessToken;
        const isApiUrl = request.url.startsWith(environment.baseApiUrl);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${user.accessToken}` }
            });
        }
        return next.handle(request);
    }
}