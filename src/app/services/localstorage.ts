import { Injectable } from '@angular/core';
import { Crypto } from './crypto';

@Injectable({
  providedIn: 'root',
})
export class Localstorage {
  private passWord = 'mypasswordtest';

  constructor(
    private cryptoService: Crypto,
    // private userService: UsuariosService
  ) { }


  // debo pensar mejor como derivar una contraseña..
  // private getPassword(): string {
  //   return sessionStorage.getItem('session_key') || '';
  // }

  // Save encrypted
  async setItem(key: string, value: any): Promise<void> {
    const password = this.passWord;
    if (!password) throw new Error('No session key available');

    const json = JSON.stringify(value);

    const encrypted = await this.cryptoService.encrypt(json, password);

    localStorage.setItem(key, JSON.stringify(encrypted));
  }

  // Get and decrypt
  async getItem<T>(key: string): Promise<T | null> {
    const password = this.passWord;
    if (!password) return null;

    const stored = localStorage.getItem(key);
    if (!stored) return null;

    try {
      const payload = JSON.parse(stored);

      const decrypted = await this.cryptoService.decrypt(payload, password);

      return JSON.parse(decrypted) as T;
    } catch (err) {
      console.error('Decryption failed', err);
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.removeItem('authUser');
    localStorage.removeItem('lastVisitedPage');
    localStorage.removeItem('users');
  }

}
