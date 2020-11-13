import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../service/api.service';
import { PreinspectionService } from '../service/preinspection.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private apiService: ApiService, private router:Router, private preInspectionService:PreinspectionService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].includes(err.status) && this.apiService.userValue) {
                // auto logout if 401 or 403 response returned from api
                this.preInspectionService.removeCurrentUser();
    this.router.navigateByUrl("/login");
    alert("err interceptor");
    localStorage.clear();
            }

            const error = (err && err.error && err.error.message) || err.statusText;
            console.error(err);
            return throwError(error);
        }))
    }
}