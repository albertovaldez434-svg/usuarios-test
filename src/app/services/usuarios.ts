import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Users, UsuariosResponse } from '../models/users';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/login';
import { environment } from 'src/environments/environment';
import { Localstorage } from './localstorage';
import { UserTasks } from '../models/task';
import { ImagenesUsuarios } from '../models/imagenesusuario';
import { loginResponseDTO } from '../models/loginDTO';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {

  constructor(
    private http: HttpClient,
    private secureStorage: Localstorage
  ) { }

  //subjects
  private users = signal<Users[] | null>(null);
  users$ = this.users.asReadonly();

  private TasksData = signal<UserTasks[] | null>(null);
  taskData$ = this.TasksData.asReadonly();

  //test signal
  private loggedData = signal<loginResponseDTO | null>(null);
  loggedData$ = this.loggedData.asReadonly();

  setLoginData(data: loginResponseDTO | null) {
    this.loggedData.set(data);
    this.secureStorage.setItem('authUser', data);
  }

  clearLoginData() {
    this.loggedData.set(null);
    this.secureStorage.clear();
  }

  //fin test signal

  //methods
  setUsers = async (usrData: Users[]) => {
    this.users.set(usrData);
    this.secureStorage.setItem('users', usrData);
    //localStorage.setItem('users', JSON.stringify(usrData));
  }

  async loadStoredData() {
    //cargar usuarios
    const usersData = await this.secureStorage.getItem<Users[]>('users');
    if (!usersData) return;

    const storedUsers = usersData;
    this.users.set(storedUsers);
  }

  clearUsers = async () => {
    this.users.set(null);
    localStorage.removeItem('users');
  }

  closeSesion(): void {
    this.clearLoginData();
    this.clearUsers();
  }

  async setTasksData(tasks: UserTasks[]) {
    this.TasksData.set(tasks);
    await this.secureStorage.setItem('tasks', tasks);
  }

  //apis
  getUsers() {
    const url = `${environment.URL_API}/api/Usuarios`;

    return this.http.get<UsuariosResponse[]>(url);
  }

  Login(request: Login) {
    const url = `${environment.URL_API}/api/Usuarios/Login`;

    return this.http.post<loginResponseDTO>(url, request);
  }

  signUpNewUser(newUser: Users) {
    const url = `${environment.URL_API}/api/Usuarios`;

    return this.http.post<Users>(url, newUser);
  }

  cargarImagen(data: FormData) {
    const url = `${environment.URL_API}/api/Usuarios/CargarImagen`;

    return this.http.post<ImagenesUsuarios>(url, data);
  }

  UpdatePsw(psw: string) {
    const url = `${environment.URL_API}/api/Usuarios/UpdatePassword`;

    return this.http.post<UserTasks>(url, psw);
  }

  editUser(user: Users) {
    const url = `${environment.URL_API}/api/Usuarios/${user.idUser}`;

    return this.http.put<Users>(url, user);
  }

  deleteUsuario(idUser: number) {
    const url = `${environment.URL_API}/api/Usuarios/${idUser}`;

    return this.http.delete(url);
  }

}
