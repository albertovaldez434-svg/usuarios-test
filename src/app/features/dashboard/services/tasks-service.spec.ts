// se agrega la referencia a jasmine si tienes errores
// este suele ser problema de VS Code
/// <reference types="jasmine" />

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserTasks } from 'src/app/features/dashboard/models/task';
import { SecureStorageService } from 'src/app/core/services/securestorage-service';
import { TasksService } from 'src/app/features/dashboard/services/tasks-service';
import { environment } from 'src/environments/environment';


describe('TasksService Test', () => {
  const tasksListMock = [
    {
      id: 1,
      title: 'mi tarea 1',
      description: 'descripcion',
      status: 1,
      idUser: 19,
    },
    {
      id: 2,
      title: 'mi tarea 2',
      description: 'descripcion',
      status: 2,
      idUser: 19,
    },
    {
      id: 3,
      title: 'mi tarea 3',
      description: 'descripcion',
      status: 3,
      idUser: 19,
    }
  ] as UserTasks[];

  const taskUpdatedMock = {
    id: 1,
    title: 'tarea actualizada',
    description: 'esta tarea se ha actualizado',
    status: 3,
    idUser: 19
  } as UserTasks;

  const newTaskMock = {
    id: 4,
    title: 'mi tarea 4',
    description: 'esta tarea es nueva',
    status: 1,
    idUser: 19
  } as UserTasks;


  let taskServiceMock: TasksService;
  let httpclientMock: HttpTestingController;
  let storageSpy: jasmine.SpyObj<SecureStorageService>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('SecureStorageService', [
      'setItem', 'getItem', 'clear'
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), provideHttpClientTesting(),
        {
          provide: SecureStorageService,
          useValue: storageSpy
        }
      ]
    });

    taskServiceMock = TestBed.inject(TasksService);
    httpclientMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpclientMock.verify();
  })

  it('should be created', () => {
    expect(taskServiceMock).toBeTruthy();
  });

  it('Debe inciar sin tareas', () => {
    expect(taskServiceMock.tasks$()).toBe(null);
  });

  it('Debe guardar las tareas en el signal', async () => {
    await taskServiceMock.setTasksData(tasksListMock);

    expect(taskServiceMock.tasks$()).toEqual(tasksListMock);
  });

  it('Debe guardar las tareas en el securestorage', async () => {
    await taskServiceMock.setTasksData(tasksListMock);

    expect(storageSpy).toHaveBeenCalledWith('tasks', tasksListMock);
  });

  it('Deberia de obtener tareas', () => {
    taskServiceMock.cargarTareasUsuario(19).subscribe();

    const request = httpclientMock.expectOne(`${environment.URL_API}/api/Tareas/GetTareas/${19}`);

    expect(request.request.method).toBe('GET');

    request.flush(tasksListMock);
  });

  it('Deberia de agregar una tarea', () => {
    taskServiceMock.actualizarTarea(taskUpdatedMock).subscribe();

    const request = httpclientMock.expectOne(`${environment.URL_API}/api/Tareas/AddTarea`);

    expect(request.request.method).toBe('POST');

    expect(request.request.body).toEqual(taskUpdatedMock);

    request.flush(taskUpdatedMock);
  });

  it('Deberia de actualizar tareas', () => {
    taskServiceMock.actualizarTarea(taskUpdatedMock).subscribe();

    const request = httpclientMock.expectOne(`${environment.URL_API}/api/Tareas/UpdateTarea`);

    expect(request.request.method).toBe('PUT');

    expect(request.request.body).toEqual(taskUpdatedMock);

    request.flush(taskUpdatedMock);
  });

  it('Deberia de eliminar una tarea', () => {
    taskServiceMock.eliminaTarea(4).subscribe();

    const request = httpclientMock.expectOne(`${environment.URL_API}/api/Tareas/DeleteTarea/${4}`);

    expect(request.request.method).toBe('DELETE');
  });

  it('Deberia de cargar tareas para modo test', () => {
    taskServiceMock.cargarTareasTest();

    const tasks = taskServiceMock.tasks$();

    expect(tasks?.length).toBe(5);

    expect(tasks![0].status).toBe(1);

    expect(tasks![4].status).toBe(3);
  });



});
