import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, lastValueFrom } from 'rxjs';
import { Users } from '../models/users';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {

  constructor(
    private http: HttpClient
  ) {
    // Load login data from localStorage on service initialization
    const storedLogin = localStorage.getItem('loginData');
    if (storedLogin) {
      this.LoginData.next(JSON.parse(storedLogin));
    }
  }

  //subjects
  private user = new BehaviorSubject<Users[] | null>(null);
  user$ = this.user.asObservable();

  private LoginData = new BehaviorSubject<Users | null>(null);
  LoginData$ = this.LoginData.asObservable();

  //methods
  setUser = async (usrData: Users[]) => {
    this.user.next(usrData);
  }

  setLogin(usrData: Users) {
    this.LoginData.next(usrData);
    localStorage.setItem('loginData', JSON.stringify(usrData));
  }

  clearUser = async () => {
    this.user.next(null);
  }

  clearLogin() {
    this.LoginData.next(null);
    localStorage.removeItem('loginData');
  }

  //apis
  getUsers = async () => {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const url = `https://localhost:7085/api/Usuarios/getusuarios`;

    return lastValueFrom(this.http.get<Users[]>(url, httpOptions));
  }

  async Login(request: Login) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const url = `https://localhost:7085/api/Usuarios/Login`;

    return firstValueFrom(this.http.post<Users>(url, request, httpOptions));
  }

  async signUpNewUser(newUser: Users) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const url = `https://localhost:7085/api/Usuarios/registrar`;

    return firstValueFrom(this.http.post<Users>(url, newUser, httpOptions));
  }

  async editUser(user: Users) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const url = `https://localhost:7085/api/Usuarios/editar/${user.idUser}`;

    return firstValueFrom(this.http.post<Users>(url, user, httpOptions));
  }

  async deleteUsuario(idUser: number) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const url = `https://localhost:7085/api/Usuarios/eliminar/${idUser}`;

    return firstValueFrom(this.http.delete(url, httpOptions));
  }

}
