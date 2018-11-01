import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { User, Article } from '../dataclass';
import { Router } from '@angular/router';
import { AuthorizedUserService } from '../authorized-user.service';
import { isIterable } from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  articles: Article[];
  users: User[];
  constructor(private databaseService: DatabaseService,
                private authorizeduserService: AuthorizedUserService,
                private router: Router) {}
  ngOnInit() {
    this.getArticles();
    this.getUsers();
    this.authorizeduserService.determine_abort();
  }
  getArticles(): void {
    this.databaseService.getArticles().then(articles => this.articles = articles );
  }
  getUsers(): void {
    this.databaseService.getUsers().then( users => this.users = users );
  }
  // refactoring 필요
  getUser(id: number): User {
    if (isIterable(this.users)) {
      for (const user of this.users) {
        if (user.id === id) {
          return user;
        }
      }
      return {id: -1, email: '', password: '', name: 'And there was no one left', signed_in: false};
    } else {
      return {id: -1, email: '', password: '', name: 'Please wait a second', signed_in: false};
    }
  }
  get_authorname_of_article(article: Article | number): string {
    const id = (typeof article === 'number') ? article : article.id;
    const user = this.getUser(id);
    return user.name;
  }
  //
}
