import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, CdkDragEnter, CdkDragMove, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {
  @ViewChild('srcollContainer', { static: true })
  scrollContainer!: ElementRef<HTMLElement>;

  todoArr: string[] = ["Task 1", "Task 2", "Task 3", "Task 4", "Task 5"];
  doingArr: string[] = [];
  doneArr: string[] = [];

  private edgeThreshold = 120;
  private maxScrollSpeed = 40;

  ngOnInit() {}

  drop(event: CdkDragDrop<string[]>) {
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
