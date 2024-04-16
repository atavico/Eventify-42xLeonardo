import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Global } from '../global';
import {  FormControl,
          NgForm,
          FormGroup,
          FormsModule,
          ReactiveFormsModule,
          Validators,
          AbstractControl,
          FormGroupDirective
        } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { ErrorStateMatcher, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { environment } from 'src/environments/environment';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl<any, any> | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [MatButtonModule, FormsModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, ReactiveFormsModule, NgIf],
})

export class SignupComponent implements OnInit {
  signupForm = new FormGroup({
  name: new FormControl('', [Validators.required]),
  lastname: new FormControl('', [Validators.required]),
  email: new FormControl('', [Validators.required, Validators.email]),
  date: new FormControl('', Validators.required),
  password: new FormControl('', [Validators.required]),
  pswRepeat: new FormControl('', [Validators.required])
  });

  apiUrl = environment.apiUrl;
  minDate = new Date();

  constructor(
    private authService: AuthService,
    private router: Router,
    private global: Global,
    private activatedRoute: ActivatedRoute,
    ) {
      if (this.global.isLogged) {
        this.global.isLogged = false;
        this.global.user.clear();
      }
      this.minDate.setFullYear(this.minDate.getFullYear() - 18);
    }
  
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params['code']) {
        this.authService.oauth2callback(params['code']).subscribe((data: any) => {
          this.authService.verifyToken(data.access_token).subscribe((data: any) => {
            const obj: Object = {
              firstname: data.given_name,
              lastname: data.family_name,
              email: data.email,
              password: null,
              profile_picture: null,
              date_of_birth: null
            }
            this.authService.oauthSignup(obj).subscribe((data: any) => {
              if (data != null) {
                let obj = JSON.parse(data);
                this.global.user.setFirstname(obj['firstname']);
                this.global.user.setLastname(obj['lastname']);
                this.global.user.setEmail(obj['email']);
                this.global.user.setPassword(obj['password']);
                this.global.user.setProfilePicture(obj['profile_picture']);
                this.global.user.setDateOfBirth(obj['date_of_birth']);
                this.global.user.setToken(obj['jwt']);
                this.global.isLogged = true;
              }
              this.router.navigate(['/admin']);
            });
          });
        });
      }
    });
  }

  getEnterValues() {
    return {
    nameVal: this.signupForm.get('name')?.value,
    lastnameVal: this.signupForm.get('lastname')?.value,
    emailVal: this.signupForm.get('email')?.value,
    passwordVal: this.signupForm.get('password')?.value,
    pswRepeatVal: this.signupForm.get('pswRepeat')?.value,
    dateVal: this.signupForm.get('date')?.value
  }
}

  onSignin() {
    if (this.signupForm.get('date')?.value && new Date(this.signupForm.get('date')?.value!) > this.minDate) {
      alert('You must be at least 18 years old!');
      return;
    }
    const enteredName = this.getEnterValues().nameVal;
    const enteredLastname = this.getEnterValues().lastnameVal;
    const enteredEmail = this.getEnterValues().emailVal;
    const enteredPasswrod = this.getEnterValues().passwordVal;
    const enteredPswRepeat = this.getEnterValues().pswRepeatVal;
    const enteredDate: Date = new Date(this.getEnterValues().dateVal!);

    if (enteredPasswrod !== enteredPswRepeat) {
      alert('Passwords do not match!');
    } else {
      this.authService.signup(
        enteredName ?? '',
        enteredLastname ?? '',
        enteredEmail ?? '',
        enteredPasswrod ?? '',
        this.global.formatDate(enteredDate)
      ).subscribe((data: any) => {
        this.global.user.setFirstname(enteredName ?? '');
        this.global.user.setLastname(enteredLastname ?? '');
        this.global.user.setEmail(enteredEmail ?? '');
        this.global.user.setPassword(enteredPasswrod ?? '');
        this.global.user.setProfilePicture(false);
        this.global.user.setDateOfBirth(enteredDate);
        // this.global.user.setToken(data);
        this.global.isLogged = true;
        this.router.navigate(['/admin']);
      });
    }
  }

  oauthSignup() {
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?\
      response_type=code&\
      client_id=304683686252-k24l77i5ojgtkt54pnedvosuejhdq478.apps.googleusercontent.com&\
      scope=openid%20email&\
      redirect_uri=https://" + environment.apiUrl + ":8080/user/oauth2callback\
      &nonce=0394852-3190485-2490358`;
  }

  googleSignIn() {
    window.location.href ="https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=304683686252-k24l77i5ojgtkt54pnedvosuejhdq478.apps.googleusercontent.com&scope=openid%20profile%20email&redirect_uri=https://localhost:4200/signup&nonce=0394852-3190485-2490358";
  }
}

