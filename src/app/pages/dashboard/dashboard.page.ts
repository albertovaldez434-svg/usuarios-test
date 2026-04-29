import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, CdkDragEnter, CdkDragMove, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { UserTasks } from 'src/app/models/task';
import { UsuariosService } from 'src/app/services/usuarios';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {
  @ViewChild('srcollContainer', { static: true })
  scrollContainer!: ElementRef<HTMLElement>;

  todoArr: UserTasks[] = [];
  doingArr: UserTasks[] = [];
  doneArr: UserTasks[] = [];

  private edgeThreshold = 120;
  private maxScrollSpeed = 40;

  constructor(
    private usuarioService: UsuariosService
  ) {

  }

  ngOnInit() { }

  ionViewDidEnter() {
    this.cargarTareas();
  }

  cargarTareas() {
    const IdUser = this.usuarioService.getLoginData()?.idUser;

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

}
