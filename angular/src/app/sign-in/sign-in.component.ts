import { Component, OnInit } from '@angular/core';

import { User } from '../dataclass';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import { AuthorizedUserService } from '../authorized-user.service';
import {isIterable} from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  users: User[];

  constructor(private databaseService: DatabaseService,
                private authorizeduserService: AuthorizedUserService,
                private router: Router) {}
  ngOnInit() {
    this.getUsers();
  }
  getUsers(): void {
    this.databaseService.getUsers().then( users => this.users = users );
  }

  isUser(email: string, password: string): void {
    if ( email === 'swpp@snu.ac.kr' && password === 'iluvswpp' ) {
      this.set_sigend_in(email);
    } else {
      alert('Email or password is wrong');
    }
  }
  set_sigend_in(email: string): void {
    if (isIterable(this.users)) {
    for (const user of this.users) {
      if ( user.email === email ) {
        user.signed_in = true;
        this.databaseService.updateUser(user)
          .then( () => this.router.navigate(['/articles']));
        this.authorizeduserService.set(user);
        break;
      }
    }
  } else {
      console.log('Please wait a second');
    }
  }
}
