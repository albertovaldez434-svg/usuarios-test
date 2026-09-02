/// <reference types="jasmine" />

import { fakeAsync, flushMicrotasks, TestBed, tick } from "@angular/core/testing";
import { LoaderService } from "src/app/core/services/loader"
import { LoadingController } from "@ionic/angular";
import { inject } from "@angular/core";

describe('Loader Test', () => {
    let loadingElementSpy = jasmine.createSpyObj<HTMLIonLoadingElement>(
        'HTMLIonLoadingElement',
        [
            'present',
            'dismiss'
        ]
    );

    let loaderControllerSpy = jasmine.createSpyObj<LoadingController>(
        'LoadingController',
        [
            'create'
        ]
    );

    let loaderService: LoaderService;

    loaderControllerSpy.create.and.resolveTo(loadingElementSpy);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LoaderService,
                {
                    provide: LoadingController,
                    useValue: loaderControllerSpy
                }
            ]
        })

        loaderService = TestBed.inject(LoaderService);
    });

    it('Should be created', () => {
        expect(loaderService).toBeTruthy();
    });

    it('Debe crear el loader', fakeAsync(() => {
        loaderService.show();

        tick(300);

        expect(loaderControllerSpy.create).toHaveBeenCalled();
    }));

    it('Debe presentar el loader', fakeAsync(() => {
        loaderService.show();

        tick(300);

        flushMicrotasks();

        expect(loadingElementSpy.present).toHaveBeenCalled();
    }));

    it('Debe ocultar el loader', fakeAsync(() => {
        loaderService.show();

        tick(300);

        flushMicrotasks();

        expect(loadingElementSpy.present).toHaveBeenCalled();

        loaderService.hide();

        tick(100);

        flushMicrotasks();

        expect(loadingElementSpy.dismiss).toHaveBeenCalled();
    }));

    it('Multiples show crean solo 1 loader', () => {
        loaderService.show();

        loaderService.show();

        loaderService.show();

        expect(loaderControllerSpy.create).toHaveBeenCalledTimes(1);
    });

    it('Se cancelo la carga del loader', fakeAsync(() => {
        loaderService.show();

        tick(100);

        loaderService.hide();

        tick(300);

        expect(loaderControllerSpy.create).not.toHaveBeenCalled();
    }));
});