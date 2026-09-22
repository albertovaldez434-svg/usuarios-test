import { TestBed } from '@angular/core/testing';
import { Crypto } from './crypto';
import { SecureStorageService } from './securestorage-service';

describe('SecureStorageService', () => {
  let service: SecureStorageService;
  let cryptoSpy: jasmine.SpyObj<Crypto>;

  beforeEach(() => {
    cryptoSpy = jasmine.createSpyObj<Crypto>('Crypto', ['encrypt', 'decrypt']);
    TestBed.configureTestingModule({
      providers: [
        SecureStorageService,
        { provide: Crypto, useValue: cryptoSpy }
      ]
    });

    service = TestBed.inject(SecureStorageService);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe cifrar y guardar un valor en localStorage', async () => {
    const encrypted = { data: 'cipher-data', iv: 'iv-123', salt: 'salt-123' };
    cryptoSpy.encrypt.and.resolveTo(encrypted);

    await service.setItem('user', { id: 1, nombre: 'Alberto' });

    expect(cryptoSpy.encrypt).toHaveBeenCalledWith(JSON.stringify({ id: 1, nombre: 'Alberto' }), 'mypasswordtest');
    expect(localStorage.getItem('user')).toBe(JSON.stringify(encrypted));
  });

  it('debe recuperar y descifrar un valor guardado', async () => {
    const encrypted = { data: 'cipher-data', iv: 'iv-123', salt: 'salt-123' };
    localStorage.setItem('user', JSON.stringify(encrypted));
    cryptoSpy.decrypt.and.resolveTo(JSON.stringify({ id: 1, nombre: 'Alberto' }));

    const result = await service.getItem<{ id: number; nombre: string }>('user');

    expect(result).toEqual({ id: 1, nombre: 'Alberto' });
    expect(cryptoSpy.decrypt).toHaveBeenCalledWith(encrypted, 'mypasswordtest');
  });

  it('debe devolver null cuando la clave no existe', async () => {
    await expectAsync(service.getItem('missing')).toBeResolvedTo(null);
  });

  it('debe eliminar una clave específica', () => {
    localStorage.setItem('user', 'value');

    service.removeItem('user');

    expect(localStorage.getItem('user')).toBeNull();
  });

  it('debe limpiar datos clave del usuario', () => {
    localStorage.setItem('authUser', 'value');
    localStorage.setItem('users', 'value');
    localStorage.setItem('lastVisitedPage', 'value');

    service.clear();

    expect(localStorage.getItem('authUser')).toBeNull();
    expect(localStorage.getItem('lastVisitedPage')).toBeNull();
    expect(localStorage.getItem('users')).toBeNull();
  });
});
