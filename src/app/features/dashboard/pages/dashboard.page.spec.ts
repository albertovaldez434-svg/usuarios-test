import { TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { UsuariosService } from 'src/app/features/users/services/usuarios';
import { TasksService } from 'src/app/features/dashboard/services/tasks-service';
import { DashboardPage } from './dashboard.page';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let authSpy: any;
  let usersSpy: any;
  let tasksSpy: any;

  beforeEach(async () => {
    authSpy = { loggedData$: () => null };
    usersSpy = { users$: () => null };
    tasksSpy = { tasks$: () => null };

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), DashboardPage],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: UsuariosService, useValue: usersSpy },
        { provide: TasksService, useValue: tasksSpy },
        { provide: ModalController, useValue: jasmine.createSpyObj('ModalController', ['create']) }
      ]
    }).compileComponents();
    component = TestBed.createComponent(DashboardPage).componentInstance;
  });

  // Verifica el estado inicial de las listas de tareas.
  it('crea la página con listas vacías', () => {
    expect(component).toBeTruthy();
    expect(component.todoArr()).toEqual([]);
    expect(component.doingArr()).toEqual([]);
    expect(component.doneArr()).toEqual([]);
  });

  // Verifica que las tareas se separen por estado.
  it('clasifica tareas por estado', () => {
    component.allTasks.set([
      { id: 1, title: 'Todo', description: '', status: 1, idUser: 1 },
      { id: 2, title: 'Doing', description: '', status: 2, idUser: 1 },
      { id: 3, title: 'Done', description: '', status: 3, idUser: 1 }
    ]);

    expect(component.todoArr().length).toBe(1);
    expect(component.doingArr().length).toBe(1);
    expect(component.doneArr().length).toBe(1);
  });

  // Verifica que no exista una tarea seleccionada inicialmente.
  it('inicia con una tarea seleccionada vacía', () => {
    expect(component.selectedTaskId()).toBeNull();
    expect(component.editableTask()).toBeNull();
  });
});