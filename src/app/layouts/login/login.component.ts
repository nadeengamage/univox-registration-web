import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/authentication.service';
import { NotifierService } from 'angular-notifier';
import { UnivoxService } from './../../service/univox-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  invalidLogin = false;
  signinForm: FormGroup;
  isActive = true;

  public loading = false;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notifier: NotifierService,
    private univoxService: UnivoxService,
  ) {
    this.signinForm = this.fb.group({
      username: ['', Validators.required],
      password: ['']
    });
  }

  ngOnInit() {
    if (localStorage.getItem('user_details')) {
      this.router.navigate(['univox/register']);
    }
  }

  loginUser() {
    this.loading = true;
    // this.authService.signIn(this.signinForm.value);
    const data = {
      identifier: this.signinForm.value.username,
      password: this.signinForm.value.username
    }
    this.univoxService.authenticateUser(data).subscribe(
      res => {
        if (res.user.updated_at === null) {
        if (res.jwt) {
          localStorage.setItem('access_token', res.jwt);
          localStorage.setItem('user_details', window.btoa(JSON.stringify(this.signinForm.value.username)));
          this.router.navigate(['univox/register']);
          this.notifier.notify('success', 'Welcome! - ' + this.signinForm.value.username);
        } else {
          this.notifier.notify('error', 'Authentication failed!');
        }
      } else {
        this.notifier.notify('error', 'Sorry! You are already up to date.');
      }
        this.loading = false;
      },
      error => {
        this.notifier.notify('error', 'Authentication failed!');
        this.loading = false;
      }
    );
      
    
  }

}
