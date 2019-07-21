import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../users.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-users-detail',
  templateUrl: './users-detail.component.html',
  styleUrls: ['./users-detail.component.scss']
})
export class UsersDetailComponent implements OnInit {

  @ViewChild('f', { static: true }) detailForm: NgForm;
  roles: string[];
  private user: User;

  constructor(private userService: UsersService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.roles = this.userService.getRoles();
    const userId: string = this.activatedRoute.snapshot.params['userid'];
    this.user = this.userService.getUser(userId);
    if (!this.user) {
      this.user = new User();
    }
    setTimeout(() => {
      this.detailForm.form.setValue({
        name: this.user.name,
        username: this.user.username,
        email: this.user.email,
        address: this.user.address,
        password: this.user.password,
        roles: this.user.roles
      });
    }, 100);
  }
  save() {
    if (!this.detailForm.valid) {
      return;
    }
    const value = this.detailForm.value;
    this.userService.saveUser(
      new User(
        value.name,
        value.username,
        value.password,
        this.user.id,
        value.email,
        value.address,
        value.roles
      ));
  }

}
