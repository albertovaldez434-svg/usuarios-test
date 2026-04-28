import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthUser, Users } from '../models/users';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/login';
import { environment } from 'src/environments/environment';
import { Localstorage } from './localstorage';
import { UserTasks } from '../models/task';

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

  private LoginData = new BehaviorSubject<AuthUser | null>(null);
  LoginData$ = this.LoginData.asObservable();

  private TasksData = new BehaviorSubject<UserTasks[] | null>(null);
  TaskData$ = this.TasksData.asObservable();

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

  setLogin(loginData: AuthUser) {
    this.LoginData.next(loginData);
    this.secureStorage.setItem('authUser', loginData);
    //localStorage.setItem('loginData', JSON.stringify(loginData));
  }

  clearUser = async () => {
    this.user.next(null);
    localStorage.removeItem('users');
  }

  clearLogin() {
    this.LoginData.next(null);
    localStorage.removeItem('loginData');
  }

  closeSesion(): void {
    this.clearLogin();
    this.clearUser();
  }

  getLoginData(): AuthUser | null {
    return this.LoginData.getValue();
  }

  async setTasksData(tasks: UserTasks[]) {
    this.TasksData.next(tasks);
    await this.secureStorage.setItem('tasks', tasks);
  }

  //apis
  getUsers() {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
      }
    }

    const url = `${environment.URL_API}/api/Usuarios`;

    return this.http.get<Users[]>(url, httpOptions);
  }

  Login(request: Login) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const url = `${environment.URL_API}/api/Usuarios/Login`;

    // return this.http.post<AuthUser>(url, request, httpOptions).pipe(delay(5000));
    return this.http.post<AuthUser>(url, request, httpOptions);
  }

  signUpNewUser(newUser: Users) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const url = `${environment.URL_API}/api/Usuarios`;

    return this.http.post<Users>(url, newUser, httpOptions);
  }

  editUser(user: Users) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const url = `${environment.URL_API}/api/Usuarios/${user.idUser}`;

    return this.http.put<Users>(url, user, httpOptions);
  }

  deleteUsuario(idUser: number) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const url = `${environment.URL_API}/api/Usuarios/${idUser}`;

    return this.http.delete(url, httpOptions);
  }

  cargarTareasUsuario(idUser: number) {
    const url = `${environment.URL_API}/api/Usuarios/GetTareas/${idUser}`;

    return this.http.get<UserTasks[]>(url);
  }

}
