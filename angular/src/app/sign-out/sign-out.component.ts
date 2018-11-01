import { Component, OnInit } from '@angular/core';
import { AuthorizedUserService } from '../authorized-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.css']
})
export class SignOutComponent implements OnInit {

  constructor(
    private authorizeduserService: AuthorizedUserService,
    private router: Router,
  ) { }

  ngOnInit() {
  }
  sign_out(): void {
    if (!this.authorizeduserService.is_authorized()) {
      this.router.navigateByUrl('/sign_in');
    } else {
      this.authorizeduserService.clear();
      this.router.navigateByUrl('/sign_in');
    }
  }
}
