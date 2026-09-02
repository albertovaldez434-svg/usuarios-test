import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoaderService } from "../services/loader";
import { finalize, Observable } from "rxjs";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(
    private loader: LoaderService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.headers.get('skip-loader')) {
      return next.handle(req); // do nothing special

      //this.http.get('https://api.com/data', { headers: { 'skip-loader': 'true' } }).subscribe();
      // para omitir el loader en una solicitud HTTP, simplemente agrega el encabezado 'skip-loader' con cualquier valor.
    }

    this.totalRequests++;

    if (this.totalRequests === 1) {
      this.loader.show();
    }

    return next.handle(req).pipe(
      finalize(() => {
        this.totalRequests--;

        if (this.totalRequests === 0) {
          this.loader.hide();
        }
      }));
  }
}