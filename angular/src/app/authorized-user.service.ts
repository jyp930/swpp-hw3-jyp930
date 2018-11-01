import { Injectable } from '@angular/core';
import { User } from './dataclass';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizedUserService {
  authorized_user: User;

  constructor(
    private router: Router,
    private databaseService: DatabaseService,
  ) {}
  set(user: User) {
    this.authorized_user = user;
  }
  get_id(): number {
    return this.authorized_user.id;
  }
  get_name(): string {
    return this.authorized_user.name;
  }

  clear() {
    this.authorized_user.signed_in = false;
    this.databaseService.updateUser(this.authorized_user);
    this.authorized_user = null;
  }
  is_authorized(): boolean {
    return (this.authorized_user != null);
  }
  determine_abort() {
    if (!this.is_authorized()) {
      console.log('Invalid Access');
      this.router.navigateByUrl('/sign_in');
    }
  }
}
