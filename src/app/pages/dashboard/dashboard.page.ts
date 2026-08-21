import { Component, computed, effect, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { CdkDragDrop, CdkDragEnter, CdkDragMove, CdkDropListGroup, CdkDropList, CdkDrag, CdkDragPlaceholder, CdkDragPreview } from '@angular/cdk/drag-drop';

import { UserTasks } from 'src/app/models/task';
import { UsuariosService } from 'src/app/services/usuarios';
import { IonModal, ModalController, RefresherCustomEvent, IonicModule } from '@ionic/angular';
import { IonModalComponent } from 'src/app/shared/ion-modal/ion-modal.component';
import { Users } from 'src/app/models/users';
import { loginResponseDTO } from 'src/app/models/loginDTO';
import { TasksService } from 'src/app/services/tasks/tasks-service';
import { FormsModule } from '@angular/forms';
import { CustomButtonComponent } from '../../shared/custom-button/custom-button.component';
import { SearchPipe } from '../../search-pipe';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [IonicModule, FormsModule, CustomButtonComponent, CdkDropListGroup, CdkDropList, CdkDrag, CdkDragPlaceholder, CdkDragPreview, SearchPipe]
})
export class DashboardPage implements OnInit {

  @ViewChild('modalTaskDetails') modalTaskDetail!: IonModal;
  @ViewChild('modalNewTask') modalNewTask!: IonModal;
  @ViewChild('scrollContainer')
  scrollContainer!: ElementRef<HTMLElement>;

  toggleSearch = false;
  playSAnimation = false;
  searchValue = '';

  loggedUser!: loginResponseDTO | null;

  imgSrc = '';
  isDragging = false;

  usuarios = signal<Users[]>([]);
  allTasks = signal<UserTasks[]>([]);

  /*
   * Las listas se generan a partir de allTasks.
   * No debemos modificar directamente estos arrays.
   */
  todoArr = computed(() =>
    this.allTasks().filter(task => Number(task.status) === 1)
  );

  doingArr = computed(() =>
    this.allTasks().filter(task => Number(task.status) === 2)
  );

  doneArr = computed(() =>
    this.allTasks().filter(task => Number(task.status) === 3)
  );

  /*
   * Distancia desde el borde para activar el auto-scroll.
   */
  private readonly edgeThreshold = 100;

  /*
   * Evita que se disparen varios scrolls mientras
   * el navegador todavía está realizando el anterior.
   */
  private autoScrollCooldown = false;

  selectedTask = signal<UserTasks | null>(null);
  editableTask = signal<UserTasks | null>(null);
  editableTaskPrevValue = signal<UserTasks | null>(null);

  titleKeyActive = false;
  descKeyActive = false;

  newTaskTitle = '';
  newTaskDesc = '';
  newTaskStatus = 0;

  constructor(
    private usuarioService: UsuariosService,
    private tareasService: TasksService,
    private modalCtrl: ModalController
  ) {

    const imgData = localStorage.getItem('myImage');

    if (imgData) {
      this.imgSrc = imgData;
    }

    this.loggedUser = this.usuarioService.loggedData$();

    if (this.loggedUser) {
      this.imgSrc = this.loggedUser.avatar;
    }

    const tareas = this.tareasService.tasks$();

    if (tareas) {
      this.allTasks.set(tareas);
    }

    effect(() => {
      const users = this.usuarioService.users$();
      const tareas = this.tareasService.tasks$();

      if (users) {
        this.usuarios.set(users);
      }

      if (tareas) {
        this.allTasks.set(tareas);
      }
    });
  }

  ngOnInit() {
  }

  setSearchToggle() {

    if (!this.toggleSearch) {

      this.toggleSearch = true;
      this.playSAnimation = true;

    } else {

      this.playSAnimation = false;

      setTimeout(() => {
        this.toggleSearch = false;
      }, 300);
    }
  }

  handleRefresh(event: RefresherCustomEvent) {

    setTimeout(() => {

      this.cargarTareas();

      event.target.complete();

    }, 2000);
  }

  async openModalFunc(titulo: string, mensaje: string) {

    const modal = this.modalCtrl.create({
      component: IonModalComponent,
      breakpoints: [0, 0.25, 0.5, 0.75],
      initialBreakpoint: 0.5,
      cssClass: 'custom-modal',
      componentProps: {
        titulo: titulo,
        mensaje: mensaje
      }
    });

    (await modal).present();
  }

  cargarTareas() {

    const IdUser = this.usuarioService.loggedData$()?.idUser;

    if (!IdUser) {
      return;
    }

    if (IdUser === 999) {

      this.tareasService.cargarTareasTest();

      const demoData = this.tareasService.tasks$();

      if (!demoData) {
        return;
      }

      this.allTasks.set(demoData);

      return;
    }

    this.tareasService.cargarTareasUsuario(IdUser).subscribe({
      next: (data) => {
        this.allTasks.set(data);
      }
    });
  }

  /*
   * ============================================================
   * DRAG & DROP
   * ============================================================
   */

  drop(event: CdkDragDrop<UserTasks[]>) {

    document.body.classList.remove('grabbing');

    const task = event.item.data as UserTasks;

    /*
     * Si se soltó dentro de la misma lista no necesitamos
     * cambiar el status.
     *
     * Actualmente tu modelo UserTasks no tiene una propiedad
     * de orden, por lo que no podemos persistir un orden
     * personalizado en backend.
     */
    if (event.previousContainer === event.container) {

      this.isDragging = false;

      return;
    }

    const newStatus = this.getStatusFromListId(event.container.id);

    if (newStatus === null) {

      this.isDragging = false;

      return;
    }

    /*
     * Actualizamos la fuente REAL de datos.
     *
     * NO hacemos transferArrayItem() porque todoArr(),
     * doingArr() y doneArr() son resultados de computed().
     */
    this.allTasks.update(tasks =>
      tasks.map(currentTask =>
        currentTask.id === task.id
          ? {
            ...currentTask,
            status: newStatus
          }
          : currentTask
      )
    );

    /*
     * Actualizamos también el objeto que se envía al backend.
     */
    const updatedTask: UserTasks = {
      ...task,
      status: newStatus
    };

    this.updateTaskStatus(updatedTask);

    this.isDragging = false;
  }

  /*
   * Detecta cuando el cursor se acerca a los extremos
   * izquierdo o derecho del Kanban.
   */
  onDragMoved(event: CdkDragMove) {

    this.isDragging = true;

    document.body.classList.add('grabbing');

    const container = this.scrollContainer?.nativeElement;

    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();

    const pointerX = event.pointerPosition.x;

    const distanceFromLeft = pointerX - rect.left;
    const distanceFromRight = rect.right - pointerX;

    /*
     * Borde izquierdo
     */
    if (distanceFromLeft <= this.edgeThreshold) {

      this.scrollToAdjacentList(-1);

      return;
    }

    /*
     * Borde derecho
     */
    if (distanceFromRight <= this.edgeThreshold) {

      this.scrollToAdjacentList(1);

      return;
    }
  }

  /*
   * direction:
   *
   * -1 = columna anterior
   *  1 = columna siguiente
   */
  private scrollToAdjacentList(direction: -1 | 1) {

    if (this.autoScrollCooldown) {
      return;
    }

    const container = this.scrollContainer?.nativeElement;

    if (!container) {
      return;
    }

    const lists = Array.from(
      container.querySelectorAll<HTMLElement>('.myDropList')
    );

    if (lists.length === 0) {
      return;
    }

    /*
     * Encontramos la columna que actualmente está más cerca
     * del inicio visible del container.
     */
    const currentScrollLeft = container.scrollLeft;

    let currentIndex = 0;
    let smallestDistance = Infinity;

    lists.forEach((list, index) => {

      const distance = Math.abs(
        list.offsetLeft - currentScrollLeft
      );

      if (distance < smallestDistance) {

        smallestDistance = distance;
        currentIndex = index;
      }
    });

    const targetIndex = currentIndex + direction;

    /*
     * Ya estamos en la primera o última columna.
     */
    if (
      targetIndex < 0 ||
      targetIndex >= lists.length
    ) {
      return;
    }

    const targetList = lists[targetIndex];

    /*
     * Centramos aproximadamente la columna destino.
     */
    const targetLeft =
      targetList.offsetLeft -
      (container.clientWidth - targetList.offsetWidth) / 2;

    const maxScrollLeft =
      container.scrollWidth - container.clientWidth;

    const finalLeft = Math.max(
      0,
      Math.min(targetLeft, maxScrollLeft)
    );

    this.autoScrollCooldown = true;

    container.scrollTo({
      left: finalLeft,
      behavior: 'smooth'
    });

    /*
     * Mientras este cooldown esté activo no volvemos
     * a disparar otro movimiento.
     */
    setTimeout(() => {

      this.autoScrollCooldown = false;

    }, 450);
  }

  /*
   * Cuando CDK detecta que entramos a otra lista,
   * hacemos que esa columna quede visible.
   *
   * NO usamos scrollIntoView() porque puede hacer scroll
   * vertical de toda la página.
   */
  onListEntered(event: CdkDragEnter<UserTasks[]>) {

    const container = this.scrollContainer?.nativeElement;

    if (!container) {
      return;
    }

    const list =
      event.container.element.nativeElement as HTMLElement;

    const maxScrollLeft =
      container.scrollWidth - container.clientWidth;

    const targetLeft =
      list.offsetLeft -
      (container.clientWidth - list.offsetWidth) / 2;

    const finalLeft = Math.max(
      0,
      Math.min(targetLeft, maxScrollLeft)
    );

    container.scrollTo({
      left: finalLeft,
      behavior: 'smooth'
    });
  }

  private getStatusFromListId(listId: string): number | null {

    switch (listId) {

      case 'todo':
        return 1;

      case 'doing':
        return 2;

      case 'done':
        return 3;

      default:
        return null;
    }
  }

  updateTaskStatus(task: UserTasks) {

    this.tareasService.actualizarTarea(task).subscribe({

      next: () => {

        this.openModalFunc(
          'Exito',
          'Tarea actualizada correctamente'
        );
      },

      error: () => {

        this.openModalFunc(
          'Error',
          'Error al actualizar la tarea'
        );
      }

    });
  }

  /*
   * ============================================================
   * TASK DETAILS
   * ============================================================
   */

  showTaskDetails(data: UserTasks) {

    if (this.isDragging) {
      return;
    }

    this.selectedTask.set(data);

    this.editableTask.set(
      structuredClone(data)
    );

    this.editableTaskPrevValue.set(
      structuredClone(data)
    );

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

        break;

      case 'description':

        if (this.descKeyActive) {

          this.descKeyActive = false;

          return;
        }

        this.titleKeyActive = false;
        this.descKeyActive = true;

        break;

      default:

        this.titleKeyActive = false;
        this.descKeyActive = false;

        break;
    }
  }

  changeTaskUser(idUser: number) {

    // console.log(idUser);
  }

  cancelTaskEdit() {

    this.titleKeyActive = false;
    this.descKeyActive = false;

    this.editableTask.set(
      this.editableTaskPrevValue()
    );
  }

  cleanTaskFlow() {

    this.titleKeyActive = false;
    this.descKeyActive = false;

    this.newTaskDesc = '';
    this.newTaskStatus = 0;
    this.newTaskTitle = '';

    this.selectedTask.set(null);
    this.editableTask.set(null);
    this.editableTaskPrevValue.set(null);
  }

  changeTaskStatus(idStatus: number) {

    this.selectedTask.update(task =>
      task
        ? {
          ...task,
          status: idStatus
        }
        : null
    );
  }

  saveTaskChanges() {

    const edited = this.editableTask();

    if (!edited) {
      return;
    }

    edited.status = Number(edited.status);

    /*
     * Actualizamos allTasks, que es la fuente principal.
     */
    this.allTasks.update(tasks =>
      tasks.map(task =>
        task.id === edited.id
          ? edited
          : task
      )
    );

    this.selectedTask.set(edited);

    this.tareasService.actualizarTarea(edited).subscribe({

      next: () => {

        this.openModalFunc(
          'Éxito',
          'Tarea actualizada correctamente'
        );

        this.cleanTaskFlow();
      },

      error: () => {

        this.openModalFunc(
          'Error',
          'Error al actualizar la tarea'
        );
      }

    });
  }

  /*
   * ============================================================
   * CREATE TASK
   * ============================================================
   */

  addTarea() {

    const loggedId =
      this.usuarioService.loggedData$()?.idUser;

    if (!loggedId) {
      return;
    }

    const newTarea: UserTasks = {

      title: this.newTaskTitle,

      description: this.newTaskDesc,

      id: 0,

      idUser: loggedId,

      status: this.newTaskStatus

    };

    this.tareasService.agregarTarea(newTarea).subscribe({

      next: (task) => {

        this.addTaskHelper(task);

        this.openModalFunc(
          'Éxito',
          'Se creo la tarea correctamente.'
        );
      },

      error: () => {

        this.openModalFunc(
          'Error',
          'Hubo un problema al crear la tarea'
        );
      }

    });
  }

  /*
   * Agregamos la tarea a allTasks.
   *
   * NO usamos:
   *
   * this.todoArr().push()
   *
   * porque todoArr() es un computed().
   */
  addTaskHelper(task: UserTasks) {

    this.allTasks.update(tasks => [
      ...tasks,
      task
    ]);
  }

  eliminarTarea() {

    // console.log(this.selectedTask());
  }
}
