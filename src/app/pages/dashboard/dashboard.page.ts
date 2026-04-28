import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, CdkDragEnter, CdkDragMove, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { UserTasks } from 'src/app/models/task';

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

  ) {
    const task1: UserTasks = {
      id: 1,
      title: 'Mi Tarea 1',
      description: 'Esta es la descripcion de mi tarea',
      status: 1
    };
    const task2: UserTasks = {
      id: 2,
      title: 'Mi Tarea 2',
      description: 'Especifica la descripcion de mi tarea',
      status: 1
    };
    const task3: UserTasks = {
      id: 3,
      title: 'Mi Tarea 3',
      description: 'Espero que esta tarea tenga una descripcion',
      status: 1
    };
    const task4: UserTasks = {
      id: 4,
      title: 'Mi Tarea 4',
      description: 'Descripcion de mi tarea 4',
      status: 1
    };
    const task5: UserTasks = {
      id: 5,
      title: 'Mi Tarea 5',
      description: 'Descripcion de mi tarea 5, pepe pecas',
      status: 1
    };

    this.todoArr.push(task1, task2, task3, task4, task5);
  }

  ngOnInit() { }

  drop(event: CdkDragDrop<UserTasks[]>) {
    document.body.classList.remove('grabbing');
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
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


}
