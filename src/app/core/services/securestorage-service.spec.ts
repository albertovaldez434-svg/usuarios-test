import { TestBed } from '@angular/core/testing';
import { Crypto } from './crypto';
import { SecureStorageService } from './securestorage-service';

describe('SecureStorageService', () => {
  let service: SecureStorageService;
  let cryptoSpy: jasmine.SpyObj<Crypto>;

  beforeEach(() => {
    cryptoSpy = jasmine.createSpyObj('Crypto', ['encrypt', 'decrypt']);
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

  // Verifica la creación del servicio.
  it('crea el servicio correctamente', () => {
    expect(service).toBeTruthy();
  });

  // Verifica que los datos se cifren y se guarden.
  it('guarda datos cifrados en localStorage', async () => {
    const encrypted = { data: 'data', iv: 'iv', salt: 'salt' };
    cryptoSpy.encrypt.and.resolveTo(encrypted);

    await service.setItem('user', { id: 1 });

    expect(cryptoSpy.encrypt).toHaveBeenCalled();
    expect(localStorage.getItem('user')).toBe(JSON.stringify(encrypted));
  });

  // Verifica que los datos guardados se descifren al recuperarlos.
  it('recupera y descifra datos guardados', async () => {
    const encrypted = { data: 'data', iv: 'iv', salt: 'salt' };
    localStorage.setItem('user', JSON.stringify(encrypted));
    cryptoSpy.decrypt.and.resolveTo(JSON.stringify({ id: 1 }));

    const result = await service.getItem<{ id: number }>('user');

    expect(result).toEqual({ id: 1 });
    expect(cryptoSpy.decrypt).toHaveBeenCalledWith(encrypted, jasmine.any(String));
  });

  // Verifica el resultado cuando no hay datos almacenados.
  it('devuelve null cuando no existe la clave solicitada', async () => {
    await expectAsync(service.getItem('missing')).toBeResolvedTo(null);
  });

  // Verifica que una clave se elimine correctamente.
  it('elimina una clave específica', () => {
    localStorage.setItem('user', 'value');

    service.removeItem('user');

    expect(localStorage.getItem('user')).toBeNull();
  });
});