import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthUser, Users } from '../models/users';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/login';
import { environment } from 'src/environments/environment';
import { Localstorage } from './localstorage';
import { UserTasks } from '../models/task';
import { ImagenesUsuarios } from '../models/imagenesusuario';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {

  constructor(
    private http: HttpClient,
    private secureStorage: Localstorage
  ) {
    this.loadStoredData();
  }

  //subjects
  private user = new BehaviorSubject<Users[] | null>(null);
  user$ = this.user.asObservable();

  private TasksData = new BehaviorSubject<UserTasks[] | null>(null);
  TaskData$ = this.TasksData.asObservable();

  //test signal
  private loggedData = signal<AuthUser | null>(null);
  loggedData$ = this.loggedData.asReadonly();

  setLoginData(data: AuthUser | null) {
    this.loggedData.set(data);
    this.secureStorage.setItem('authUser', data);
  }

  clearLoginData() {
    this.loggedData.set(null);
    this.secureStorage.clear();
  }

  //fin test signal

  //methods
  setUser = async (usrData: Users[]) => {
    this.user.next(usrData);
    this.secureStorage.setItem('users', usrData);
    //localStorage.setItem('users', JSON.stringify(usrData));
  }

  async loadStoredData() {
    //cargar usuarios
    const users = await this.secureStorage.getItem<Users[]>('users');
    if (users) {
      const storedUsers = users;
      this.user.next(storedUsers);
    }
  }

  clearUser = async () => {
    this.user.next(null);
    localStorage.removeItem('users');
  }

  closeSesion(): void {
    this.clearLoginData();
    this.clearUser();
  }

  async setTasksData(tasks: UserTasks[]) {
    this.TasksData.next(tasks);
    await this.secureStorage.setItem('tasks', tasks);
  }

  //apis
  getUsers() {
    const url = `${environment.URL_API}/api/Usuarios`;

    return this.http.get<Users[]>(url);
  }

  Login(request: Login) {
    const url = `${environment.URL_API}/api/Usuarios/Login`;

    return this.http.post<AuthUser>(url, request);
  }

  signUpNewUser(newUser: Users) {
    const url = `${environment.URL_API}/api/Usuarios`;

    return this.http.post<Users>(url, newUser);
  }

  editUser(user: Users) {
    const url = `${environment.URL_API}/api/Usuarios/${user.idUser}`;

    return this.http.put<Users>(url, user);
  }

  deleteUsuario(idUser: number) {
    const url = `${environment.URL_API}/api/Usuarios/${idUser}`;

    return this.http.delete(url);
  }

  cargarTareasUsuario(idUser: number) {

    const url = `${environment.URL_API}/api/Usuarios/GetTareas/${idUser}`;

    return this.http.get<UserTasks[]>(url);
  }

  actualizarTarea(tareaActualizada: UserTasks) {

    const url = `${environment.URL_API}/api/Usuarios/UpdateTarea`;

    return this.http.post(url, tareaActualizada);
  }

  cargarImagen(data: FormData) {
    const url = `${environment.URL_API}/api/Usuarios/CargarImagen`;

    return this.http.post<ImagenesUsuarios>(url, data);
  }

  agregarTarea(task: UserTasks) {
    const url = `${environment.URL_API}/api/Usuarios/AddTarea`;

    return this.http.post<UserTasks>(url, task);
  }

}
