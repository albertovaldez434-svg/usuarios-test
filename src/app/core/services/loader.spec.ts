/// <reference types="jasmine" />

import { fakeAsync, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { LoaderService } from '@core/services/loader';
import { LoadingController } from '@ionic/angular';

describe('LoaderService', () => {
  let loadingElementSpy: jasmine.SpyObj<HTMLIonLoadingElement>;
  let loaderControllerSpy: jasmine.SpyObj<LoadingController>;
  let service: LoaderService;

  beforeEach(() => {
    loadingElementSpy = jasmine.createSpyObj<HTMLIonLoadingElement>('HTMLIonLoadingElement', ['present', 'dismiss']);
    loaderControllerSpy = jasmine.createSpyObj<LoadingController>('LoadingController', ['create']);
    loaderControllerSpy.create.and.resolveTo(loadingElementSpy);

    TestBed.configureTestingModule({
      providers: [
        LoaderService,
        { provide: LoadingController, useValue: loaderControllerSpy }
      ]
    });

    service = TestBed.inject(LoaderService);
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe crear y presentar el loader tras el delay', fakeAsync(() => {
    service.show();
    tick(300);
    flushMicrotasks();

    expect(loaderControllerSpy.create).toHaveBeenCalledWith({
      message: 'Cargando...',
      spinner: 'crescent'
    });
    expect(loadingElementSpy.present).toHaveBeenCalled();
  }));

  it('debe ocultar el loader cuando ya no hay solicitudes', fakeAsync(() => {
    service.show();
    tick(300);
    flushMicrotasks();

    service.hide();
    tick(100);
    flushMicrotasks();

    expect(loadingElementSpy.dismiss).toHaveBeenCalled();
  }));

  it('debe evitar crear varios loaders para múltiples llamadas seguidas', fakeAsync(() => {
    service.show();
    service.show();
    service.show();
    tick(300);
    flushMicrotasks();

    expect(loaderControllerSpy.create).toHaveBeenCalledTimes(1);
  }));

  it('debe cancelar la presentación si se oculta antes del timeout', fakeAsync(() => {
    service.show();
    tick(100);
    service.hide();
    tick(300);

    expect(loaderControllerSpy.create).not.toHaveBeenCalled();
  }));
});
