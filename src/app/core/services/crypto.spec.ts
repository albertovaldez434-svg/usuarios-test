import { TestBed } from '@angular/core/testing';
import { Crypto } from '@core/services/crypto';

describe('Crypto', () => {
  let service: Crypto;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Crypto]
    });

    service = TestBed.inject(Crypto);
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe encriptar un texto y devolver iv, salt y data', async () => {
    const result = await service.encrypt('Esto es un texto', 'MyP4ssw0rd@');

    expect(result.data).toBeTruthy();
    expect(result.iv).toBeTruthy();
    expect(result.salt).toBeTruthy();
  });

  it('debe desencriptar un texto cifrado con la misma contraseña', async () => {
    const password = 'MyP4ssw0rd@';
    const encrypted = await service.encrypt('Esto es un texto', password);

    const decrypted = await service.decrypt(encrypted, password);

    expect(decrypted).toBe('Esto es un texto');
  });

  it('debe generar una CryptoKey con algoritmo AES-GCM', async () => {
    const key = await service.generarLlave('MyP4ssw0rd@', new Uint8Array([1, 2, 3, 4, 5]));

    expect(key).toBeTruthy();
    expect(key.type).toBe('secret');
    expect(key.algorithm.name).toBe('AES-GCM');
  });
});
