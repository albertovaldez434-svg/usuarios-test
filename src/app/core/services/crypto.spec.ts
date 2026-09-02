import { TestBed } from "@angular/core/testing";
import { Crypto } from "src/app/core/services/crypto"

describe('Crypto Test', () => {
    let cryptService: Crypto;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [cryptService]
        })

        cryptService = TestBed.inject(Crypto);
    });

    it('Should be created', () => {
        expect(cryptService).toBeTruthy();
    })

    it('Deberia de encriptar datos', async () => {
        let text = 'Esto es un texto';
        let password = 'MyP4ssw0rd@';

        const info = await cryptService.encrypt(text, password);

        expect(cryptService.encrypt).toHaveBeenCalledWith(text,password);

        expect(info.data).toBeTruthy();
        expect(info.iv).toBeTruthy();
        expect(info.salt).toBeTruthy();
    });

    it('Deberia desencriptar datos', async () => {
        let text = 'Esto es un texto';
        let password = 'MyP4ssw0rd@';

        const info = await cryptService.encrypt(text, password);

        expect(cryptService.encrypt).toHaveBeenCalledWith(text,password);

        expect(info.data).toBeTruthy();
        expect(info.iv).toBeTruthy();
        expect(info.salt).toBeTruthy();

        const decryptInfo = await cryptService.decrypt(info, password);

        expect(cryptService.decrypt).toHaveBeenCalledWith(info, password);

        expect(decryptInfo).toBeTruthy();
        expect(decryptInfo).toBeGreaterThan(0);
    });

    it('Deberia de generar una cryptokey', async() => {
        let password = 'MyP4ssw0rd@';
        const saltArray = new Uint8Array([1, 2, 3, 4, 5]);
        
        const key = await cryptService.generarLlave(password, saltArray);

        expect(cryptService.generarLlave).toHaveBeenCalledWith(password, saltArray);

        expect(key).toBeTruthy();
        expect(key.type).toBe('secret');
        expect(key.algorithm.name).toBe('AES-GCM');
    });
})