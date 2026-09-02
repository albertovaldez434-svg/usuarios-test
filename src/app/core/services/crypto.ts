import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Crypto {
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  async generarLlave(password: string, salt: Uint8Array): Promise<CryptoKey> {
    // salt es algo como un generdor de valores aleatorios, que se genera cuando vamos a guardar una llave o datos
    // y se guarda junto con la llave o datos, para que cuando queramos recuperar esa llave o datos, 
    // podamos usar el mismo salt para generar la misma llave y poder desencriptar los datos.
    // crypto-js hacia lo mismo, pero se dejo de mantener y se recomienda esta api nativa del navegador, mas segura y eficiente.

    const generatedKey = await crypto.subtle.importKey(
      'raw', //formato
      this.encoder.encode(password),
      { name: 'PBKDF2' }, //algoritmo
      false, //no es exportable
      ['deriveKey'] //usos permitidos
    );

    // 'PBKDF2' = Password-Based Key Derivation Function 2,
    // es un algortimo que toma una contraseña debil ('mypass123') y un salt (mencionado arriba) y genera una llave mas segura.

    const salty: any = salt; //enrealidad es un uint8array.... pero typescript se queja, asi que le puse any para callar el error, aunque no es lo ideal.

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salty,
        iterations: 100000, //numero de iteraciones para hacer mas dificil el ataque de fuerza bruta
        hash: 'SHA-256', //algoritmo de hash para generar la llave
      },
      generatedKey,
      {
        name: 'AES-GCM',
        length: 256, //longitud de la llave generada
      },
      false, //no es exportable
      ['encrypt', 'decrypt'] //usos permitidos
    );

    // AES-GCM (Advanced Encryption Standard - Galois/Counter Mode) 
    // es un algortirmo de cifrado para garantizar la confidencialidad e integridad de los datos, 
    // combina el modo contador para el cifrado con la autenticación GHASH, lo que permite verificar que los datos no hayan sido alterados.
  }

  // Encriptar
  async encrypt(text: string, password: string) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const salt = crypto.getRandomValues(new Uint8Array(16));

    // const iv = iv se refiere a initialization vector,
    // para asegurarse de que aunque guardes datos con la misma key y data, 
    // el resultado cifrado sea diferente cada vez, para evitar ataques de repetición.

    const key = await this.generarLlave(password, salt);

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      this.encoder.encode(text)
    );

    return {
      iv: this.toBase64(iv),
      salt: this.toBase64(salt),
      data: this.toBase64(new Uint8Array(encrypted))
    };
  }

  // Desencriptar
  async decrypt(payload: any, password: string): Promise<string> {
    const iv: any = this.fromBase64(payload.iv);
    const salt = this.fromBase64(payload.salt);
    const data: any = this.fromBase64(payload.data);

    // los parametros iv y data los puse con any para que se callara typescript,
    // si regresa unit8array pero ts le estaba agregando un <ArrayBufferLike>
    // y estaba cuasando problemas innecesarios.

    const key = await this.generarLlave(password, salt);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      data
    );

    return this.decoder.decode(decrypted);
  }

  // Helpers
  private toBase64(bytes: Uint8Array): string {
    return btoa(String.fromCharCode(...bytes));
  }

  private fromBase64(base64: string): Uint8Array {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  }

}
