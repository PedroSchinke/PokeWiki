import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    IonicModule,
    ReactiveFormsModule
  ]
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async onLogin() {
    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email, password);
      await this.navCtrl.navigateRoot('/home');
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Credenciais inválidas',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
