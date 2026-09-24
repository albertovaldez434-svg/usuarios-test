/// <reference types="jasmine" />

import { provideHttpClient, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';
import { UserTasks } from '@features/dashboard/models/task';
import { TasksService } from '@features/dashboard/services/tasks-service';
import { SecureStorageService } from '@core/services/securestorage-service';

describe('TasksService', () => {
  const tasksListMock: UserTasks[] = [
    { id: 1, title: 'mi tarea 1', description: 'descripcion', status: 1, idUser: 19 },
    { id: 2, title: 'mi tarea 2', description: 'descripcion', status: 2, idUser: 19 },
    { id: 3, title: 'mi tarea 3', description: 'descripcion', status: 3, idUser: 19 }
  ];

  const taskUpdatedMock: UserTasks = {
    id: 1,
    title: 'tarea actualizada',
    description: 'esta tarea se ha actualizado',
    status: 3,
    idUser: 19
  };

  const newTaskMock: UserTasks = {
    id: 4,
    title: 'mi tarea 4',
    description: 'esta tarea es nueva',
    status: 1,
    idUser: 19
  };

  let service: TasksService;
  let httpMock: HttpTestingController;
  let storageSpy: jasmine.SpyObj<SecureStorageService>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj<SecureStorageService>('SecureStorageService', ['setItem', 'getItem', 'clear']);
    storageSpy.setItem.and.resolveTo();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
        { provide: SecureStorageService, useValue: storageSpy }
      ]
    });

    service = TestBed.inject(TasksService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe iniciar sin tareas cargadas', () => {
    expect(service.tasks$()).toBeNull();
  });

  it('debe guardar las tareas en el signal y en secureStorage', async () => {
    await service.setTasksData(tasksListMock);

    expect(service.tasks$()).toEqual(tasksListMock);
    expect(storageSpy.setItem).toHaveBeenCalledWith('tasks', tasksListMock);
  });

  it('debe cargar tareas por usuario con GET', () => {
    service.cargarTareasUsuario(19).subscribe();

    const request = httpMock.expectOne(`${environment.URL_API}/api/Tasks/GetTareas/${19}`);

    expect(request.request.method).toBe('GET');

    request.flush(tasksListMock);

    expect(service.tasks$()).toEqual(tasksListMock);
  });

  it('debe cargar tareas paginadas sin filtro', () => {
    service.cargarTareasUsuarioV2(2, 10, '').subscribe();

    const request = httpMock.expectOne(`${environment.URL_API}/api/Tasks/getTareasListv2?page=2&pageSize=10`);

    expect(request.request.method).toBe('GET');

    request.flush({ items: tasksListMock, totalPages: 1, page: 2 });
    expect(service.tasks$()).toEqual(tasksListMock);
  });

  it('debe cargar tareas paginadas aplicando filtro de búsqueda', () => {
    service.cargarTareasUsuarioV2(1, 10, 'mi tarea').subscribe();

    const request = httpMock.expectOne(`${environment.URL_API}/api/Tasks/getTareasListv2?page=1&pageSize=10&filtro=mi tarea`);

    expect(request.request.method).toBe('GET');

    request.flush({ items: tasksListMock, totalPages: 1, page: 1 });
    expect(service.tasks$()).toEqual(tasksListMock);
  });

  it('debe agregar una tarea con POST', () => {
    service.agregarTarea(newTaskMock).subscribe();

    const request = httpMock.expectOne(`${environment.URL_API}/api/Tasks/AddTarea`);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newTaskMock);

    request.flush(newTaskMock);
  });

  it('debe actualizar una tarea con PUT', () => {
    service.actualizarTarea(taskUpdatedMock).subscribe();

    const request = httpMock.expectOne(`${environment.URL_API}/api/Tasks/UpdateTarea`);

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(taskUpdatedMock);

    request.flush(taskUpdatedMock);
  });

  it('debe eliminar una tarea con DELETE', () => {
    service.eliminaTarea(4).subscribe();

    const request = httpMock.expectOne(`${environment.URL_API}/api/Tasks/DeleteTarea/${4}`);

    expect(request.request.method).toBe('DELETE');

    request.flush({});
  });

  it('debe cargar datos de prueba del modo demo', () => {
    service.cargarTareasTest();

    const result = service.tasks$();

    expect(result?.length).toBe(5);
    expect(result?.[0].status).toBe(1);
    expect(result?.[4].status).toBe(3);
  });
});
