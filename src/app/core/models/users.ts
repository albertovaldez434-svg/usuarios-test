export interface Users {
    idUser: number;
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
    idRol?: number;
    password?: string;
}

export interface AuthUser {
    access_token: string;
    token_type: string;
    idUser: number;
    idRol: number;
    userInfo: Users;
    avatar: string;
}

export interface UsuariosResponse {
    idUser: number;
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
    idRol?: number;
}