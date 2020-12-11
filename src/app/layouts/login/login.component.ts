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
  }

  loginUser() {
    this.loading = true;
    this.authService.signIn(this.signinForm.value);
      this.univoxService.getRegisterDetails(this.signinForm.value.username).subscribe(
        res => {
          if (res.nic_no === this.signinForm.value.username) {
            localStorage.setItem('user_details', window.btoa(JSON.stringify(res.nic_no)));
            // this.currentUser = res.nic_no;
            this.notifier.notify('success', 'Welcome! ' + res.nic_no);
            this.router.navigate(['univox/register']);
          } else {
            this.notifier.notify('error', 'User not found!');
          }
          this.loading = false;
        },
        error => {
          this.notifier.notify('error', 'User not found!');
          this.loading = false;
        }
      );
    
  }

}
