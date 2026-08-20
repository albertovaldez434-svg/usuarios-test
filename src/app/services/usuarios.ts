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

// sin uso practico, testing de maps START.
// -----
// switchMap = solo me interesa el ultimo valor del observable.
// ej: un search/filter que consuma un servicio http, asi se evita multiples consumos de la api.
// const searchControl = new FormControl();
// searchControl.valueChanges.pipe(
//   switchMap(term => this.http.get<string[]>(`${environment.URL_API}/api/searchUsuarios/${term}`))
// );

// mergeMap = procesa todos los eventos y no importa que sean al mismo tiempo.
// hmm suena peligroso.

// concatMap = procesa todos, pero en orden de llegada. No empieces el siguiente hasta que termine el anterior.
// ej: agregar varias tareas
// hmm, supongamos que se dan de alta varias tareas pero no hay internet, se almacenan de manera temporal
// ah ya tenemos internet, manda a guardar todas las tareas en orden que se guardaron.
// se me ocurre algo asi.

//ej2: array de llamadas
// const actions$ = from([
//   updateName,
//   updateAddress,
//   updatePhone
// ]);
//
// entonces:
// actions$.pipe(
//   concatMap(action =>
//     this.http.post('/api/update', action)
//   )
// );

// exhaustMap = Hasta que termine el proceso que estoy haciendo, ignora los demás que lleguen.
// ej: Login
// this.loginButtonClicked$.pipe(
//   exhaustMap(() =>
//     this.http.post('/api/login', credentials)
//   )
// );
//
// loginbutton clickeado más de 3 veces, se toma en cuenta el primer click, se ignoran los otros 2 que podrian causar multiples llamadas
// por error
// -----
// Ojo, no todo es que sean para servicios http o cosas asi, son observables.
// sin uso practico, testing de maps END.

// pendientes de usar de combinacion
// forkJoin = espera a que todos terminen.
// ---
// forkJoin({
//   profile: this.http.get<User>('/api/profile'),
//   tasks: this.http.get<Task[]>('/api/tasks'),
//   notifications: this.http.get<Notification[]>('/api/notifications')
// }).subscribe(result => {
//   console.log(result.profile);
//   console.log(result.tasks);
//   console.log(result.notifications);
// });
// ---
// combineLatest = dame el estado más reciente de todos
// ---
// si hay algun cambio en products, searchTerm o category
// combineLatest([
//   products$,
//   searchTerm$,
//   category$
// ]).pipe(
//   map(([products, search, category]) => {
//     return products.filter(product =>
//       product.name.includes(search) &&
//       product.category === category
//     );
//   })
// );
// ---
// zip = espera un valor de cada uno. (para hacer parejas... pendiente no veo uso actual).
// merge = escucha todos estos los observables y dame cualquier valor que emitan.
// concat = ejecutalos en secuencia.
// race = el primero que emita valor gana. (casi no se usa pero es bueno conocerlo)
// ---
// concat(
//   this.http.get('/api/step1'),
//   this.http.get('/api/step2'),
//   this.http.get('/api/step3')
// )
// ---
// combineLatestWith
// user$.pipe(
//   combineLatestWith(settings$),
//   map(([user, settings]) => ...)
// );
// ---
// withLatestFrom = obtengas el último usuario y el último valor del formulario
// saveClick$.pipe(
//   withLatestFrom(
//     user$,
//     formValue$
//   ),
//   switchMap(([_, user, form]) =>
//     this.http.post('/api/tasks', {
//       userId: user.id,
//       ...form
//     })
//   )
// );

// pendientes:
// debounceTime
// distinctUntilChanged
// filter
// tap
// catchError
// finalize
// take
// takeUntil
// ejemplo
// ---
// this.searchControl.valueChanges.pipe(
//   debounceTime(300),
//   distinctUntilChanged(),
//   filter(value => value.length >= 2),
//   switchMap(value =>
//     this.userService.search(value)
//   ),
//   catchError(error => {
//     console.error(error);
//     return of([]);
//   })
// );