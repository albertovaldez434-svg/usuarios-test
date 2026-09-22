import { HttpHeaders, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LoaderService } from '@core/services/loader';
import { LoadingInterceptor } from '@core/interceptors/loading-interceptor';

describe('LoadingInterceptor', () => {
  let interceptor: LoadingInterceptor;
  let loaderSpy: jasmine.SpyObj<LoaderService>;

  beforeEach(() => {
    loaderSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);

    TestBed.configureTestingModule({
      providers: [
        LoadingInterceptor,
        { provide: LoaderService, useValue: loaderSpy }
      ]
    });

    interceptor = TestBed.inject(LoadingInterceptor);
  });

  it('debe crearse correctamente', () => {
    expect(interceptor).toBeTruthy();
  });

  it('debe mostrar y ocultar el loader para la solicitud normal', () => {
    const request = new HttpRequest('GET', '/api/data');
    const next = jasmine.createSpy('next').and.returnValue(of({ ok: true }));

    interceptor.intercept(request, { handle: next }).subscribe();

    expect(loaderSpy.show).toHaveBeenCalledTimes(1);
    expect(loaderSpy.hide).toHaveBeenCalledTimes(1);
  });

  it('debe omitir el loader cuando la petición envía la cabecera skip-loader', () => {
    const request = new HttpRequest(
      'GET',
      '/api/data',
      { headers: new HttpHeaders({ 'skip-loader': 'true' }) }
    );
    const next = jasmine.createSpy('next').and.returnValue(of({ ok: true }));

    interceptor.intercept(request, { handle: next }).subscribe();

    expect(loaderSpy.show).not.toHaveBeenCalled();
    expect(loaderSpy.hide).not.toHaveBeenCalled();
  });
});
