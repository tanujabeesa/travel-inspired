import { NgForm } from '@angular/forms';

import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  // will run when the form will be submitted
  onSubmit(f: NgForm) {
    // using NgForm

    // destructuring email and password
    const { email, password } = f.form.value;

    this.auth
      .signIn(email, password)
      .then((res) => {
        // navigating user to home when the auth completes
        this.toastr.success('signIn complete');
        this.router.navigateByUrl('/');
      })
      .catch((err) => {
        // showing error when auth fails
        this.toastr.error(err.message, '', {
          closeButton: true,
        });
      });
  }
}
