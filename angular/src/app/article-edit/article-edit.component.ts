import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { AuthorizedUserService } from '../authorized-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from '../dataclass';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css']
})
export class ArticleEditComponent implements OnInit {
  article: Article;
  original_article: Article;
  view_write: boolean;
  constructor(
    private databaseService: DatabaseService,
    private authorizeduserService: AuthorizedUserService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.authorizeduserService.determine_abort();
    this.getArticle();
    this.view_write = true;
  }
  getArticle(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.databaseService.getArticle(id)
      .then(article => this.article = article);
    this.databaseService.getArticle(id)
      .then(article => this.original_article = article);
  }
  get_authorname(): string {
    if (this.authorizeduserService.authorized_user) {
      return this.authorizeduserService.get_name();
    } else {
      console.log('And there was no one left');
    }
  }
  view_write_tab(): void {
    this.view_write = true;
    document.getElementById('write-tab-button').setAttribute('class', 'Clicked_tab');
    document.getElementById('preview-tab-button').setAttribute('class', 'unClicked_tab');
  }
  view_preview_tab(): void {
    this.view_write = false;
    document.getElementById('write-tab-button').setAttribute('class', 'unClicked_tab');
    document.getElementById('preview-tab-button').setAttribute('class', 'Clicked_tab');
  }
  confirm_edit_article(): void {
    this.article.title = this.article.title.trim();
    let temp_content: string = this.article.content;
    temp_content = temp_content.trim();
    if (this.article.title === '' || temp_content === '') {
      return;
    } else {
      const buttons = document.getElementsByTagName('button');
      for (let i = 0; i < buttons.length; i++) {
        buttons.item(i).setAttribute('disabled', 'disabled');
      }
      this.databaseService.updateArticle(this.article)
        .then( () => this.router.navigateByUrl(`/articles/${this.article.id}`));
    }
  }
  back(): void {
    this.article.title = this.article.title.trim();
    if ( (this.article.title === this.original_article.title) &&
      (this.article.content === this.original_article.content) ) {
      this.router.navigateByUrl(`/articles/${this.article.id}`);
    } else {
      const sure_of_back = confirm('Are you sure? The change will be lost.');
      if (sure_of_back) {
        this.router.navigateByUrl(`/articles/${this.article.id}`);
      } else {
        return ;
      }
    }
  }
}
