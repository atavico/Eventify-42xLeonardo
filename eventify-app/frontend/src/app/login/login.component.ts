import { Component, OnInit } from '@angular/core';
import { FormControl,
         FormGroupDirective,
         NgForm,
         Validators,
         FormsModule,
         ReactiveFormsModule,
         FormGroup, 
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Global } from '../global';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, NgIf],
})

export class LoginComponent {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  matcher = new MyErrorStateMatcher();
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private global: Global
    ) {}

  getEnterValues() {
    const emailValue = this.loginForm.get('email')?.value;
    const passwordValue = this.loginForm.get('password')?.value;
    return {email: emailValue, password: passwordValue};
  }
  
  onLogin() {
    const enteredEmail = this.getEnterValues().email;
    const enteredPass = this.getEnterValues().password;

    //let authObs: Observable<AuthResponseData>
    //this.isLoading = true;

    this.authService.login(enteredEmail, enteredPass)
      .subscribe(
          (resData: any) => {
            if (resData != null) {
              let obj = JSON.parse(resData);
              this.global.user.setFirstname(obj['firstname']);
              this.global.user.setLastname(obj['lastname']);
              this.global.user.setEmail(obj['email']);
              this.global.user.setPassword(obj['password']);
              this.global.user.setProfilePicture(obj['profile_picture']);
              this.global.user.setDateOfBirth(obj['date_of_birth']);
              this.global.user.setToken(obj['jwt']);
              this.global.isLogged = true;
              this.router.navigate(['/admin']);
            } else {
              alert('Wrong username or password!');
            }
          }
        );
    }
  }
