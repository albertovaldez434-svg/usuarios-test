import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { UserTasks } from 'src/app/core/models/task';
import { environment } from 'src/environments/environment';
import { SecureStorageService } from '../../../core/services/securestorage-service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksService {

  private http = inject(HttpClient);
  private secureStorage = inject(SecureStorageService)

  private tasks = signal<UserTasks[] | null>(null);
  tasks$ = this.tasks.asReadonly();

  async setTasksData(tasks: UserTasks[]) {
    this.tasks.set(tasks);
    await this.secureStorage.setItem('tasks', tasks);
  }

  cargarTareasUsuario(idUser: number) {

    const url = `${environment.URL_API}/api/Tasks/GetTareas/${idUser}`;

    return this.http.get<UserTasks[]>(url).pipe(
      tap(tasks => this.tasks.set(tasks))
    );
  }

  actualizarTarea(tareaActualizada: UserTasks) {

    const url = `${environment.URL_API}/api/Tasks/UpdateTarea`;

    return this.http.put(url, tareaActualizada);
  }

  agregarTarea(task: UserTasks) {
    const url = `${environment.URL_API}/api/Tasks/AddTarea`;

    return this.http.post<UserTasks>(url, task);
  }

  eliminaTarea(idTarea: number) {
    const url = `${environment.URL_API}/api/Tasks/DeleteTarea/${idTarea}`

    return this.http.delete(url);
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
      status: 2,
      idUser: 999
    }
    const tarea5: UserTasks = {
      id: 5,
      title: 'Tarea 1',
      description: 'Esta es una descripcion de la Tarea 5',
      status: 3,
      idUser: 999
    }

    const tasks = [tarea1, tarea2, tarea3, tarea4, tarea5];
    this.tasks.set(tasks);
  }
}
