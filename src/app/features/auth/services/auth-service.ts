import { inject, Injectable, signal } from '@angular/core';
import { SecureStorageService } from 'src/app/core/services/securestorage-service';
import { loginResponseDTO } from '../models/loginDTO';
import { Login } from '../models/login';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private secureStorage = inject(SecureStorageService);
  private http = inject(HttpClient);

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

  closeSesion(): void {
    this.clearLoginData();
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

}


