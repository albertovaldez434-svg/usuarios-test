import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, CdkDragEnter, CdkDragMove, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { UserTasks } from 'src/app/models/task';
import { UsuariosService } from 'src/app/services/usuarios';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {
  @ViewChild('modalTaskDetails') modalTaskDetail!: IonModal;
  @ViewChild('srcollContainer', { static: true })

  scrollContainer!: ElementRef<HTMLElement>;

  todoArr: UserTasks[] = [];
  doingArr: UserTasks[] = [];
  doneArr: UserTasks[] = [];

  private edgeThreshold = 120;
  private maxScrollSpeed = 40;

  selectedTask: UserTasks | null = null;
  titleModel: string = '';
  descModel: string = '';
  statusModel: number = 0;

  titleKeyActive: boolean = false;
  descKeyActive: boolean = false;
  statusKeyActive: boolean = false;

  constructor(
    private usuarioService: UsuariosService
  ) {
    const Tarea1: UserTasks = {
      id: 0,
      title: 'Test Task 1',
      description: 'Just a test',
      status: 1,
      idUser: 1
    }
    const Tarea2: UserTasks = {
      id: 1,
      title: 'Test Task 2',
      description: 'Just a test',
      status: 1,
      idUser: 1
    }
    const Tarea3: UserTasks = {
      id: 2,
      title: 'Test Task 3',
      description: 'Just a test',
      status: 1,
      idUser: 1
    }

    this.todoArr.push(Tarea1, Tarea2, Tarea3);
  }

  ngOnInit() { }

  ionViewDidEnter() {
    // this.cargarTareas();
  }

  cargarTareas() {
    const IdUser = this.usuarioService.loggedData$()?.idUser;

    if (IdUser) {
      this.usuarioService.cargarTareasUsuario(IdUser).subscribe({
        next: (tasks) => {
          this.todoArr = tasks.filter(t => t.status === 1);
          this.doingArr = tasks.filter(t => t.status === 2);
          this.doneArr = tasks.filter(t => t.status === 3);
        },
        error: (err) => {
          console.error('Error al cargar las tareas:', err);
        }
      });
    }
  }

  drop(event: CdkDragDrop<UserTasks[]>) {
    document.body.classList.remove('grabbing');

    const selectedTask: UserTasks = event.item.data;
    const targetListId = event.container.id;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.updateTaskStatus(selectedTask, targetListId);
    }
  }

  onDragMoved(event: CdkDragMove) {
    document.body.classList.add('grabbing');
    const container = this.scrollContainer.nativeElement;
    const rect = container.getBoundingClientRect();
    const pointerX = event.pointerPosition.x;

    let scrollAmount = 0;

    // izquierda
    const leftDistance = pointerX - rect.left;
    if (leftDistance < this.edgeThreshold) {
      scrollAmount = -this.calculateSpeed(leftDistance);
    }

    // derecha
    const rightDistance = rect.right - pointerX;
    if (rightDistance < this.edgeThreshold) {
      scrollAmount = this.calculateSpeed(rightDistance);
    }

    container.scrollLeft += scrollAmount;
  }

  private calculateSpeed(distance: number): number {
    const ratio = (this.edgeThreshold - distance) / this.edgeThreshold;
    return ratio * this.maxScrollSpeed;
  }

  onListEntered(event: CdkDragEnter<any>) {
    const element = event.container.element.nativeElement;

    element.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  }

  updateTaskStatus(Task: UserTasks, newListId: string) {

    switch (newListId) {
      case 'todo':
        Task.status = 1;
        break;
      case 'doing':
        Task.status = 2;
        break;
      case 'done':
        Task.status = 3;
        break;
    }

    this.usuarioService.actualizarTarea(Task).subscribe({
      next: (data) => {
        console.log(data);
        console.log('Tarea actualizada correctamente');
      },
      error: (err) => {
        console.error('Error al actualizar la tarea:', err);
      }
    });

  }

  showTaskDetails(data: UserTasks) {
    console.log(data);
    this.selectedTask = data;
    this.titleModel = this.selectedTask.title;
    this.descModel = this.selectedTask.description;
    this.statusModel = this.selectedTask.status;
    this.modalTaskDetail.present();
  }

  EditField(key: string) {
    switch (key) {
      case 'title':
        if (this.titleKeyActive) {
          this.titleKeyActive = false;
          return;
        }
        this.titleKeyActive = true;
        this.descKeyActive = false;
        this.statusKeyActive = false;
        break;
      case 'description':
        if (this.descKeyActive) {
          this.descKeyActive = false;
          return;
        }
        this.titleKeyActive = false;
        this.descKeyActive = true;
        this.statusKeyActive = false;
        break;
      case 'status':
        if (this.statusKeyActive) {
          this.statusKeyActive = false;
          return;
        }
        this.titleKeyActive = false;
        this.descKeyActive = false;
        this.statusKeyActive = true;
        break;
      default:
        this.titleKeyActive = false;
        this.descKeyActive = false;
        this.statusKeyActive = false;
        break;
    }
  }

  cleanTaskFlow() {
    this.titleKeyActive = false;
    this.descKeyActive = false;
    this.statusKeyActive = false;

    this.titleModel = '';
    this.descModel = '';
    this.statusModel = 0;

    this.selectedTask = null;
  }

}
