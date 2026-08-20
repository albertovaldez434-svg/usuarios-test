import { Injectable, signal } from '@angular/core';
import { from, map, switchMap, tap } from 'rxjs';
import { Users, UsuariosResponse } from '../models/users';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/login';
import { environment } from 'src/environments/environment';
import { SecureStorageService } from './securestorage-service';
import { ImagenesUsuarios } from '../models/imagenesusuario';
import { loginResponseDTO } from '../models/loginDTO';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {

  constructor(
    private http: HttpClient,
    private secureStorage: SecureStorageService
  ) { }

  private users = signal<Users[] | null>(null);
  users$ = this.users.asReadonly();

  private loggedData = signal<loginResponseDTO | null>(null);
  loggedData$ = this.loggedData.asReadonly();

  async setLoginData(data: loginResponseDTO | null) {
    this.loggedData.set(data);
    await this.secureStorage.setItem('authUser', data);
  }

  clearLoginData() {
    this.loggedData.set(null);
    this.secureStorage.clear();
  }

  async setUsers(usrData: Users[]) {
    this.users.set(usrData);
    await this.secureStorage.setItem('users', usrData);
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

  //apis
  getUsers() {
    const url = `${environment.URL_API}/api/Usuarios`;

    return this.http.get<UsuariosResponse[]>(url).pipe(
      tap(users => this.setUsers(users))
    );
  }

  Login(request: Login) {
    const url = `${environment.URL_API}/api/Usuarios/Login`;

    return this.http.post<loginResponseDTO>(url, request).pipe(
      switchMap(user =>
        from(this.setLoginData(user)).pipe(
          map(() => user)
        )
      )
    );
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

    return this.http.post(url, psw);
  }

  editUser(user: Users) {
    const url = `${environment.URL_API}/api/Usuarios/${user.idUser}`;

    return this.http.put<Users>(url, user);
  }

  deleteUsuario(idUser: number) {
    const url = `${environment.URL_API}/api/Usuarios/${idUser}`;

    return this.http.delete(url);
  }

  // sin uso practico, testing de maps.
  searchTerm(userTerm: string) {
    //const url = `${environment.URL_API}/api/searchUsuarios/${userTerm}`;

    // return this.http.get<string>(url).pipe(
    //   switchMap(term => {
    //     this.http.get<string>(`${environment.URL_API}/api/searchUsuarios/${term}`)
    //   })
    // );

    const searchControl = new FormControl();

    searchControl.valueChanges.pipe(
      switchMap(term => this.http.get<string[]>(`${environment.URL_API}/api/searchUsuarios/${term}`))
    );
  }

  // extras
  obtenerUsuariosTest() {
    const usersList: Users[] = [
      {
        idUser: 3,
        nombre: "Carlos",
        apellidos: "Ramírez López",
        email: "carlos.ramirez@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Carlos123!"
      },
      {
        idUser: 4,
        nombre: "María",
        apellidos: "González Torres",
        email: "maria.gonzalez@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Maria123!"
      },
      {
        idUser: 5,
        nombre: "Luis",
        apellidos: "Fernández Ruiz",
        email: "luis.fernandez@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Luis123!"
      },
      {
        idUser: 6,
        nombre: "Ana",
        apellidos: "Martínez Vega",
        email: "ana.martinez@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Ana123!"
      },
      {
        idUser: 7,
        nombre: "Jorge",
        apellidos: "Hernández Castro",
        email: "jorge.hernandez@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Jorge123!"
      },
      {
        idUser: 8,
        nombre: "Fernanda",
        apellidos: "Soto Navarro",
        email: "fernanda.soto@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Fer123!"
      },
      {
        idUser: 9,
        nombre: "Ricardo",
        apellidos: "Morales Díaz",
        email: "ricardo.morales@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Ricardo123!"
      },
      {
        idUser: 10,
        nombre: "Daniela",
        apellidos: "Pérez Silva",
        email: "daniela.perez@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Dani123!"
      },
      {
        idUser: 11,
        nombre: "Miguel",
        apellidos: "Ortega Reyes",
        email: "miguel.ortega@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Miguel123!"
      },
      {
        idUser: 12,
        nombre: "Sofía",
        apellidos: "Cruz Mendoza",
        email: "sofia.cruz@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Sofia123!"
      }
    ];

    this.users.set(usersList);
  }

}
