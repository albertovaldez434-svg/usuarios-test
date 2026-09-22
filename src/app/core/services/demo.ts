import { inject, Injectable } from '@angular/core';
import { AuthService } from '@features/auth/services/auth-service';
import { loginResponseDTO } from '@features/auth/models/loginDTO';
import { UserTasks } from '@features/dashboard/models/task';
import { TasksService } from '@features/dashboard/services/tasks-service';
import { Users } from '@features/users/models/users';
import { UsuariosService } from '@features/users/services/usuarios';

@Injectable({
  providedIn: 'root',
})
export class Demo {
  private readonly authService = inject(AuthService);
  private readonly tasksService = inject(TasksService);
  private readonly usuariosService = inject(UsuariosService);

  async cargarDatosDemo(): Promise<void> {
    await this.authService.setLoginData(this.adminAuth);
    await this.usuariosService.setUsers(this.users);
    await this.tasksService.setTasksData(this.tasks);
  }

  private readonly adminAuth: loginResponseDTO = {
    accessToken: 'demo_access_token',
    tokenType: 'bearer',
    idUser: 999,
    idRol: 1,
    nombre: 'Alejandra',
    apellidos: 'Sánchez García',
    email: 'admin.demo@usuarios.test',
    avatar: '',
  };

  private readonly users: Users[] = [
    {
      idUser: 999,
      nombre: 'Alejandra',
      apellidos: 'Sánchez García',
      email: 'admin.demo@usuarios.test',
      telefono: '6441000000',
      idRol: 1,
      password: 'Demo123!',
    },
    {
      idUser: 1,
      nombre: 'Carlos',
      apellidos: 'Ramírez López',
      email: 'carlos.ramirez@test.com',
      telefono: '6441000001',
      idRol: 2,
    },
    {
      idUser: 2,
      nombre: 'María',
      apellidos: 'González Torres',
      email: 'maria.gonzalez@test.com',
      telefono: '6441000002',
      idRol: 2,
    },
    {
      idUser: 3,
      nombre: 'Luis',
      apellidos: 'Fernández Ruiz',
      email: 'luis.fernandez@test.com',
      telefono: '6441000003',
      idRol: 2,
    },
    {
      idUser: 4,
      nombre: 'Ana',
      apellidos: 'Martínez Vega',
      email: 'ana.martinez@test.com',
      telefono: '6441000004',
      idRol: 2,
    },
    {
      idUser: 5,
      nombre: 'Jorge',
      apellidos: 'Hernández Castro',
      email: 'jorge.hernandez@test.com',
      telefono: '6441000005',
      idRol: 2,
    },
    {
      idUser: 6,
      nombre: 'Fernanda',
      apellidos: 'Soto Navarro',
      email: 'fernanda.soto@test.com',
      telefono: '6441000006',
      idRol: 2,
    },
    {
      idUser: 7,
      nombre: 'Ricardo',
      apellidos: 'Morales Díaz',
      email: 'ricardo.morales@test.com',
      telefono: '6441000007',
      idRol: 2,
    },
    {
      idUser: 8,
      nombre: 'Daniela',
      apellidos: 'Pérez Silva',
      email: 'daniela.perez@test.com',
      telefono: '6441000008',
      idRol: 2,
    },
    {
      idUser: 9,
      nombre: 'Miguel',
      apellidos: 'Ortega Reyes',
      email: 'miguel.ortega@test.com',
      telefono: '6441000009',
      idRol: 2,
    },
    {
      idUser: 10,
      nombre: 'Sofía',
      apellidos: 'Cruz Mendoza',
      email: 'sofia.cruz@test.com',
      telefono: '6441000010',
      idRol: 2,
    },
  ];

  private readonly tasks: UserTasks[] = [
    {
      id: 1,
      title: 'Conciliar cuentas bancarias',
      description: 'Revisar los movimientos del banco y conciliar las diferencias del mes.',
      status: 1,
      idUser: 999,
    },
    {
      id: 2,
      title: 'Preparar reporte de gastos',
      description: 'Integrar los gastos operativos y preparar el reporte para dirección.',
      status: 1,
      idUser: 999,
    },
    {
      id: 3,
      title: 'Validar facturas de proveedores',
      description: 'Comprobar que las facturas tengan datos fiscales y autorización correcta.',
      status: 2,
      idUser: 999,
    },
    {
      id: 4,
      title: 'Actualizar presupuesto trimestral',
      description: 'Comparar el presupuesto aprobado con el avance real del trimestre.',
      status: 2,
      idUser: 999,
    },
    {
      id: 5,
      title: 'Registrar pagos pendientes',
      description: 'Capturar los pagos pendientes y confirmar sus fechas de vencimiento.',
      status: 3,
      idUser: 999,
    },
    {
      id: 6,
      title: 'Revisar nómina mensual',
      description: 'Verificar percepciones, deducciones y movimientos antes del cierre de nómina.',
      status: 1,
      idUser: 999,
    },
    {
      id: 7,
      title: 'Actualizar expedientes laborales',
      description: 'Completar los documentos faltantes de los expedientes del personal.',
      status: 1,
      idUser: 999,
    },
    {
      id: 8,
      title: 'Coordinar entrevistas',
      description: 'Agendar entrevistas para las vacantes abiertas del área administrativa.',
      status: 2,
      idUser: 999,
    },
    {
      id: 9,
      title: 'Publicar vacante de analista',
      description: 'Revisar el perfil y publicar la vacante de analista contable.',
      status: 3,
      idUser: 999,
    },
    {
      id: 10,
      title: 'Aplicar encuesta de clima laboral',
      description: 'Enviar la encuesta y concentrar las respuestas del equipo.',
      status: 1,
      idUser: 999,
    },
    {
      id: 11,
      title: 'Programar capacitación fiscal',
      description: 'Confirmar participantes y reservar la sesión de actualización fiscal.',
      status: 2,
      idUser: 999,
    },
    {
      id: 12,
      title: 'Autorizar vacaciones',
      description: 'Revisar solicitudes de vacaciones y validar la cobertura operativa.',
      status: 3,
      idUser: 999,
    },
    {
      id: 13,
      title: 'Calcular prestaciones',
      description: 'Preparar el cálculo de prestaciones para las nuevas contrataciones.',
      status: 1,
      idUser: 999,
    },
    {
      id: 14,
      title: 'Cerrar periodo contable',
      description: 'Confirmar pólizas y saldos para realizar el cierre contable mensual.',
      status: 2,
      idUser: 999,
    },
    {
      id: 15,
      title: 'Preparar evaluación de desempeño',
      description: 'Organizar los formatos y fechas para la evaluación semestral del personal.',
      status: 3,
      idUser: 999,
    },
  ];
}
