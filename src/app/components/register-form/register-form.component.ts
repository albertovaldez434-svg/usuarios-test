import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Users } from 'src/app/models/users';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
})
export class RegisterFormComponent implements OnInit {
  @Input() Title?: string;
  @Input() userData?: Users;
  @Output() formSubmit = new EventEmitter<Users | null>();
  
  registerForm!: FormGroup;
  submitted = false;
  passwordVisible = false;
  isEditingData: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    // Component initialization
    // console.log(this.userData);
    if (this.userData) {
      this.isEditingData = true;
    }
    // console.log('editando perfil: ', this.isEditingData);

    this.registerForm = this.formBuilder.group({
      firstName: [this.userData?.nombre || '', [Validators.required, Validators.minLength(2)]],
      lastName: [this.userData?.apellidos || '', [Validators.required, Validators.minLength(2)]],
      email: [this.userData?.email || '', [Validators.required, Validators.email]],
      username: [this.userData?.nombreUsuario || '', [Validators.required, Validators.minLength(3)]],
      password: [this.userData?.password || '', [Validators.required, Validators.minLength(8)]],
      confirmPassword: [this.userData?.password || '', [Validators.required]],
      mobileNumber: [this.userData?.telefono || '', [Validators.required, Validators.pattern(/^[\d\s\-\+\(\)]{10,}$/)]],
    });

    //console.log(this.Title);
  }

  get f() {
    return this.registerForm.controls;
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  closeModal() {
    this.resetForm();
    this.modalCtrl.dismiss();
    this.formSubmit.emit(null);
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.valid) {
      console.log('Form Value:', this.registerForm.value);

      let formData: Users = {
        idUser: 0, // Asignar un ID temporal o manejarlo según tu lógica
        nombre: this.registerForm.value.firstName,
        apellidos: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        telefono: this.registerForm.value.mobileNumber,
        nombreUsuario: this.registerForm.value.username,
        password: this.registerForm.value.password,
      };

      if (this.userData?.idUser === 999) {
        formData.idUser = 999, formData.idRol = 999;
        this.formSubmit.emit(formData);
        this.submitted = false;
        this.isEditingData = false;
        return;
      }

      if (this.isEditingData && this.userData) {
        formData.idUser = this.userData.idUser; // Mantener el mismo ID para edición
        this.formSubmit.emit(formData);
        this.submitted = false;
        this.isEditingData = false;
      } else {
        this.formSubmit.emit(null);
        this.submitted = false;
        this.isEditingData = false;
      }
    }
  }


  resetForm() {
    if (this.isEditingData) {
      this.registerForm.reset();
      this.formSubmit.emit(null);
      this.modalCtrl.dismiss();
    }
    this.submitted = false;
    this.registerForm.reset();
  }

}
