import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;

  constructor(private authservice: AuthenticationService) { }
  private authsubs: Subscription;

  ngOnInit() {
    this.authsubs = this.authservice.getIsUserAuthenticated().subscribe(isAuth => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.authsubs.unsubscribe();
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authservice.login(form.value.email, form.value.password);
  }
}
