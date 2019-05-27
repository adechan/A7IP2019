import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ClientsService } from 'src/app/services/clients.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  submitted = false;

  constructor (
    public formBuilder: FormBuilder,
    private userService: ClientsService,
    public alertController: AlertController,
    private router: Router
    ) {
    this.loginForm = this.formBuilder.group(
      {
      password: new FormControl('', Validators.compose(
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30),
        ]
      )),
      email: new FormControl('', Validators.compose([
          Validators.required,
          //Validators.email
      ]
     ))
    });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      console.log('login form invalid');
        return;
    }

    const formJson = JSON.stringify(this.loginForm.value);
    this.userService.login(formJson);
  }

  get f() { return this.loginForm.controls; }

  ngOnInit() {
  }

  async forgotPasswordAlert()
  {
    const alert = await this.alertController.create({
      header: 'Reset your password',
      inputs:
      [
        {
          name: 'emailAlert',
          placeholder: 'Email',
        },
      ],
      message: 'A new password will be sent to this email:',
      buttons: 
      [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Pressed the button cancel');
          }
        },
        {
          text: 'Generate password',
          handler: (data) => {
            data['emailAlert'];
            console.log('Pressed the button generate password with the email: ' + data['emailAlert']);

           this.userService.generatePassword(data['emailAlert'])
           .subscribe(data => {
            console.log("The password was generated with succcess");
            this.userService.presentWarning("Atentie", "O noua parola a fost trimisa la emailul dvs");

          }, error => {
            console.log('Unable to generate password');
            this.userService.presentWarning("Atentie", "Acest email nu este inregistrat in baza de date");
            console.log(error);

            //this.userService.presentWarning("Formular Invalid", "A aparut o problema cu informatiile pe care le-ati trimis");
          });
          }
        }
      ]
    });
    await alert.present();
  }

}
