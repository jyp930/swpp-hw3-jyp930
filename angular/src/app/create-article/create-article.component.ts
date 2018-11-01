import { Component, OnInit } from '@angular/core';
import { AuthorizedUserService } from '../authorized-user.service';
import { DatabaseService } from '../database.service';
import { User, Article } from '../dataclass';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent implements OnInit {
  articles: Article[];
  users: User[];
  title: string;
  content: string;
  constructor(
    private databaseService: DatabaseService,
    private authorizeduserService: AuthorizedUserService,
    private router: Router,
    private location: Location,
  ) { }

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
  get_authorname(): string {
    if (this.authorizeduserService.authorized_user) {
      return this.authorizeduserService.authorized_user.name;
    } else {
      return 'And there was no one left';
    }
  }
  view_write_tab(): void {
    document.getElementById('WriteTab').setAttribute('style', 'display: ""');
    document.getElementById('write-tab-button').setAttribute('class', 'Clicked_tab');
    document.getElementById('PreviewTab').setAttribute('style', 'display: none');
    document.getElementById('preview-tab-button').setAttribute('class', 'unClicked_tab');
  }
  view_preview_tab(): void {
    document.getElementById('WriteTab').setAttribute('style', 'display: none');
    document.getElementById('write-tab-button').setAttribute('class', 'unClicked_tab');
    document.getElementById('PreviewTab').setAttribute('style', 'display: ""');
    document.getElementById('preview-tab-button').setAttribute('class', 'Clicked_tab');
  }
  create_article(): void {
    if (!this.authorizeduserService.is_authorized()) { // 혹시나 권한이 없으면 추방한다.
      this.router.navigateByUrl('/sign_in');
    } else {
      let temp_content: string = this.content;
      if (typeof this.title !== 'undefined' ) { this.title = this.title.trim(); }
      if (typeof temp_content !== 'undefined' ) {temp_content = temp_content.trim(); }
      if (this.title == null || this.title === '' || temp_content == null || temp_content === '') {
        return;
      } else {
        const buttons = document.getElementsByTagName('button');
        for (let i = 0; i < buttons.length; i++) {
          buttons.item(i).setAttribute('disabled', 'disabled');
        }
        const id = this.gen_article_id();
        this.databaseService.createArticle(id, this.authorizeduserService.authorized_user.id, this.title, this.content)
          .then( () => this.router.navigate(['./articles/' + id]));
      }
    }
  }
  gen_article_id(): number {
    return this.articles.length > 0 ? Math.max(...this.articles.map(value => value.id)) + 1 : 0;
  }
  back(): void {
      this.router.navigateByUrl('/articles');
  }
}
