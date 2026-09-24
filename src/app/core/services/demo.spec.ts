import { TestBed } from '@angular/core/testing';
import { AuthService } from '@features/auth/services/auth-service';
import { TasksService } from '@features/dashboard/services/tasks-service';
import { UsuariosService } from '@features/users/services/usuarios';
import { Demo } from './demo';

describe('Demo', () => {
  let service: Demo;
  let authSpy: jasmine.SpyObj<AuthService>;
  let tasksSpy: jasmine.SpyObj<TasksService>;
  let usersSpy: jasmine.SpyObj<UsuariosService>;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj<AuthService>('AuthService', ['setLoginData']);
    tasksSpy = jasmine.createSpyObj<TasksService>('TasksService', ['setTasksData']);
    usersSpy = jasmine.createSpyObj<UsuariosService>('UsuariosService', ['setUsers']);
    authSpy.setLoginData.and.resolveTo();
    tasksSpy.setTasksData.and.resolveTo();
    usersSpy.setUsers.and.resolveTo();

    TestBed.configureTestingModule({
      providers: [
        Demo,
        { provide: AuthService, useValue: authSpy },
        { provide: TasksService, useValue: tasksSpy },
        { provide: UsuariosService, useValue: usersSpy },
      ]
    });

    service = TestBed.inject(Demo);
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe cargar el usuario administrador, los usuarios y las tareas del demo', async () => {
    await service.cargarDatosDemo();

    expect(authSpy.setLoginData).toHaveBeenCalledOnceWith(jasmine.objectContaining({
      idUser: 999,
      idRol: 1,
      nombre: 'Alejandra',
      apellidos: 'Sánchez García',
      email: 'admin.demo@usuarios.test',
      avatar: '',
    }));

    const users = usersSpy.setUsers.calls.mostRecent().args[0];
    expect(users.length).toBe(11);
    expect(users[0]).toEqual(jasmine.objectContaining({
      idUser: 999,
      nombre: 'Alejandra',
      apellidos: 'Sánchez García',
      telefono: '6441000000',
    }));
    expect(users.slice(1).length).toBe(10);

    const tasks = tasksSpy.setTasksData.calls.mostRecent().args[0];
    expect(tasks.length).toBe(15);
    expect(tasks.every(task => task.idUser === 999)).toBeTrue();
    expect(tasks.some(task => /[áéíóúñ]/i.test(`${task.title} ${task.description}`))).toBeTrue();
    expect(tasks.some(task => /nómina|laboral|vacaciones|capacitación/i.test(task.title))).toBeTrue();
  });
});
