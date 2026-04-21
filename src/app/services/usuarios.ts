import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, lastValueFrom } from 'rxjs';
import { AuthUser, Users } from '../models/users';
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
    const dataLogin = localStorage.getItem('loginData');
    if (dataLogin) {
      const storedLogin: AuthUser = JSON.parse(dataLogin);
      this.LoginData.next(storedLogin);
    }
  }

  //subjects
  private user = new BehaviorSubject<Users[] | null>(null);
  user$ = this.user.asObservable();

  private LoginData = new BehaviorSubject<AuthUser | null>(null);
  LoginData$ = this.LoginData.asObservable();

  //methods
  setUser = async (usrData: Users[]) => {
    this.user.next(usrData);
  }

  setLogin(loginData: AuthUser) {
    this.LoginData.next(loginData);
    localStorage.setItem('loginData', JSON.stringify(loginData));
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
        'Content-Type': 'application/json',
      }
    }

    const url = `https://localhost:7085/api/Usuarios`;

    return lastValueFrom(this.http.get<Users[]>(url, httpOptions));
  }

  async Login(request: Login) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const url = `https://localhost:7085/api/Usuarios/Login`;

    return firstValueFrom(this.http.post<AuthUser>(url, request, httpOptions));
  }

  async signUpNewUser(newUser: Users) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const url = `https://localhost:7085/api/Usuarios`;

    return firstValueFrom(this.http.post<Users>(url, newUser, httpOptions));
  }

  async editUser(user: Users) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const url = `https://localhost:7085/api/Usuarios/${user.idUser}`;

    return firstValueFrom(this.http.put<Users>(url, user, httpOptions));
  }

  async deleteUsuario(idUser: number) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const url = `https://localhost:7085/api/Usuarios/${idUser}`;

    return firstValueFrom(this.http.delete(url, httpOptions));
  }

}
