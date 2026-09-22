import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { AuthService } from '@features/auth/services/auth-service';
import { TasksService } from '@features/dashboard/services/tasks-service';
import { UsuariosService } from '@features/users/services/usuarios';
import { DashboardPage } from './dashboard.page';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let tasksSpy: jasmine.SpyObj<TasksService>;
  let usersSpy: jasmine.SpyObj<UsuariosService>;
  let modalSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj<AuthService>('AuthService', [], { loggedData$: () => ({ idUser: 2, idRol: 1, nombre: 'Alberto', apellidos: 'Valdez', email: 'alberto@test.com', accessToken: 'token', tokenType: 'bearer', avatar: '' }) });
    tasksSpy = jasmine.createSpyObj<TasksService>('TasksService', ['cargarTareasUsuario', 'cargarTareasUsuarioV2', 'cargarTareasTest'], { tasks$: () => null });
    usersSpy = jasmine.createSpyObj<UsuariosService>('UsuariosService', [], { users$: () => null });
    modalSpy = jasmine.createSpyObj<ModalController>('ModalController', ['create']);

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: UsuariosService, useValue: usersSpy },
        { provide: TasksService, useValue: tasksSpy },
        { provide: ModalController, useValue: modalSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe iniciar con listas vacías', () => {
    expect(component.todoArr()).toEqual([]);
    expect(component.doingArr()).toEqual([]);
    expect(component.doneArr()).toEqual([]);
  });

  it('debe clasificar tareas según su estado', () => {
    component.allTasks.set([
      { id: 1, title: 'Todo', description: 'desc', status: 1, idUser: 2 },
      { id: 2, title: 'Doing', description: 'desc', status: 2, idUser: 2 },
      { id: 3, title: 'Done', description: 'desc', status: 3, idUser: 2 }
    ]);

    expect(component.todoArr().length).toBe(1);
    expect(component.doingArr().length).toBe(1);
    expect(component.doneArr().length).toBe(1);
  });

  it('debe mantener la tarea y edición como nulas al iniciar', () => {
    expect(component.selectedTaskId()).toBeNull();
    expect(component.editableTask()).toBeNull();
    expect(component.editableTaskPrevValue()).toBeNull();
  });

  it('debe alternar el estado del buscador', () => {
    expect(component.toggleSearch).toBeFalse();

    component.setSearchToggle();
    expect(component.toggleSearch).toBeTrue();

    component.setSearchToggle();
    expect(component.toggleSearch).toBeFalse();
  });

  it('debe cargar tareas de un usuario autenticado', () => {
    tasksSpy.cargarTareasUsuario.and.returnValue(of([{ id: 1, title: 'Tarea', description: 'desc', status: 1, idUser: 2 }]));

    component.cargarTareas();

    expect(tasksSpy.cargarTareasUsuario).toHaveBeenCalledWith(2);
    expect(component.allTasks().length).toBe(1);
  });

  it('debe cargar tareas demo cuando el usuario es invitado', () => {
    authSpy.loggedData$.and.returnValue({ idUser: 999, idRol: 999, nombre: 'Invitado', apellidos: 'User', email: 'guest@test.com', accessToken: 'token', tokenType: 'bearer', avatar: '' });
    tasksSpy.cargarTareasTest.and.callFake(() => component.allTasks.set([
      { id: 1, title: 'T1', description: 'desc', status: 1, idUser: 999 }
    ]));

    component.cargarTareas();

    expect(tasksSpy.cargarTareasTest).toHaveBeenCalled();
    expect(component.allTasks().length).toBe(1);
  });
});
