import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserTasks } from 'src/app/models/task';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TasksService {

  private http = inject(HttpClient);

  cargarTareasUsuario(idUser: number) {

    const url = `${environment.URL_API}/api/Usuarios/GetTareas/${idUser}`;

    return this.http.get<UserTasks[]>(url);
  }

  actualizarTarea(tareaActualizada: UserTasks) {

    const url = `${environment.URL_API}/api/Usuarios/UpdateTarea`;

    return this.http.put(url, tareaActualizada);
  }

  agregarTarea(task: UserTasks) {
    const url = `${environment.URL_API}/api/Usuarios/AddTarea`;

    return this.http.post<UserTasks>(url, task);
  }
}
