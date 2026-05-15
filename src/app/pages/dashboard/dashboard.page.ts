import { Component, computed, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { CdkDragDrop, CdkDragEnter, CdkDragMove, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { UserTasks } from 'src/app/models/task';
import { UsuariosService } from 'src/app/services/usuarios';
import { IonModal, ModalController } from '@ionic/angular';
import { IonModalComponent } from 'src/app/components/ion-modal/ion-modal.component';

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

  allTasks = signal<UserTasks[]>([]);
  todoArr = computed(() =>
    this.allTasks().filter(task => task.status === 1)
  );
  doingArr = computed(() =>
    this.allTasks().filter(task => task.status === 2)
  );
  doneArr = computed(() =>
    this.allTasks().filter(task => task.status === 3)
  );

  private edgeThreshold = 120;
  private maxScrollSpeed = 40;

  selectedTask = signal<UserTasks | null>(null);
  editableTask = signal<UserTasks | null>(null);

  titleKeyActive: boolean = false;
  descKeyActive: boolean = false;
  statusKeyActive: boolean = false;

  constructor(
    private usuarioService: UsuariosService,
    private modalCtrl: ModalController
  ) {

  }

  ngOnInit() { }

  ionViewDidEnter() {
    this.cargarTareas();
  }

  async openModalFunc(mensaje: string) {
    const modal = this.modalCtrl.create({
      component: IonModalComponent,
      breakpoints: [0, 0.25, 0.5, 0.75],
      initialBreakpoint: 0.5,
      componentProps: {
        mensaje: mensaje
      }
    });

    (await modal).present();
  }

  cargarTareasTest() {
    const tarea1: UserTasks = {
      id: 1,
      title: 'Tarea 1',
      description: 'Esta es una descripcion de la Tarea 1',
      status: 1,
      idUser: 999
    }
    const tarea2: UserTasks = {
      id: 2,
      title: 'Tarea 1',
      description: 'Esta es una descripcion de la Tarea 2',
      status: 1,
      idUser: 999
    }
    const tarea3: UserTasks = {
      id: 3,
      title: 'Tarea 1',
      description: 'Esta es una descripcion de la Tarea 3',
      status: 1,
      idUser: 999
    }
    const tarea4: UserTasks = {
      id: 4,
      title: 'Tarea 1',
      description: 'Esta es una descripcion de la Tarea 4',
      status: 1,
      idUser: 999
    }
    const tarea5: UserTasks = {
      id: 5,
      title: 'Tarea 1',
      description: 'Esta es una descripcion de la Tarea 5',
      status: 1,
      idUser: 999
    }

    const tasks = [tarea1, tarea2, tarea3, tarea4, tarea5];
    this.allTasks.set(tasks);
  }

  cargarTareas() {
    const IdUser = this.usuarioService.loggedData$()?.idUser;

    if (IdUser) {
      if (IdUser == 999) {
        this.cargarTareasTest();
      } else {
        this.usuarioService.cargarTareasUsuario(IdUser).subscribe({
          next: (tasks) => {
            this.allTasks.set(tasks);
          },
          error: (err) => {
            this.openModalFunc('Error al cargar las tareas');
          }
        });
      }
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
      next: () => {
        this.openModalFunc('Tarea actualizada correctamente');
      },
      error: (err) => {
        //console.error('Error al actualizar la tarea:', err);
        this.openModalFunc('Error al actualizar la tarea');
      }
    });

  }

  showTaskDetails(data: UserTasks) {
    // console.log(data);
    this.selectedTask.set(data);

    // editable clone
    this.editableTask.set(structuredClone(data));

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

    this.selectedTask.set(null);
    this.editableTask.set(null);
  }

  changeTaskStatus(idStatus: number) {
    this.selectedTask.update(task =>
      task
        ? { ...task, status: idStatus }
        : null
    );
  }

  saveTaskChanges() {
    const edited = this.editableTask();

    if (!edited) return;

    // update signal list ONCE
    this.allTasks.update(tasks =>
      tasks.map(task =>
        task.id === edited.id
          ? edited
          : task
      )
    );

    // update selectedTask
    edited.status = Number(edited.status);
    this.selectedTask.set(edited);

    // API call ONCE
    this.usuarioService.actualizarTarea(edited).subscribe({
      next: () => {
        this.openModalFunc('Tarea actualizada correctamente');
        this.cleanTaskFlow();
      },
      error: () => {
        this.openModalFunc('Error al actualizar la tarea');
      }
    });
  }

}





