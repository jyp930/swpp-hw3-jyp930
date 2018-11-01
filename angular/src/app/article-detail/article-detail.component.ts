import { Component, OnInit } from '@angular/core';
import { AuthorizedUserService } from '../authorized-user.service';
import { Article, User, Comment } from '../dataclass';
import { DatabaseService } from '../database.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { isIterable } from 'rxjs/internal-compatibility';
import { Router } from '@angular/router';
@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  article: Article;
  users: User[];
  comments: Comment[];
  all_comments: Comment[];
  comment_content: string;
  authoried_user: number;
  constructor(
    private databaseService: DatabaseService,
    private authorizeduserService: AuthorizedUserService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    ) { }

  ngOnInit() {
    this.authorizeduserService.determine_abort();
    this.getArticle();
    this.getUsers();
    this.getComments();
    this.getAllComments();
    this.get_authorizeduser_id();
  }
  get_authorizeduser_id(): void {
    if (this.authorizeduserService.is_authorized()) {
      this.authoried_user = this.authorizeduserService.get_id();
    } else {
      console.log('get out');
    }
  }
  getArticle(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.databaseService.getArticle(id)
      .then(article => this.article = article);
  }
  getUsers(): void {
    this.databaseService.getUsers().then( users => this.users = users );
  }
  getComments(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.databaseService.getComments_for_article(id).then(comments => this.comments = comments);
  }
  getAllComments(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.databaseService.getComments().then( comments => this.all_comments = comments );
  }
  delete_article(): void {
    const buttons = document.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
      buttons.item(i).setAttribute('disabled', 'disabled');
    }
    this.databaseService.deleteArticle(this.article)
      .then( () => this.router.navigateByUrl('/articles'));
    for (const comment of this.comments) {
      console.log(1);
      this.delete_comment(comment);
    }
  }
  create_comment(): void {
    if (!isIterable(this.all_comments)) {
      console.log('Please wait a second');
    } else {
      if (this.comment_content != null ) {
        this.comment_content = this.comment_content.trim();
      }
      if (this.comment_content == null || this.comment_content === '') {
        this.comment_content = '';
        return;
    } else {
        document.getElementById('confirm-create-comment-button').setAttribute('disabled', 'disabled');
        setTimeout( () => {
          document.getElementById('confirm-create-comment-button').removeAttribute('disabled');
        }, 600);
        const id = this.gen_comment_id();
        this.databaseService.createComment(id, this.article.id, this.authorizeduserService.get_id(), this.comment_content)
          .then( comment => this.comments.push(comment));
        this.getAllComments();
        this.comment_content = '';
      }
    }
  }
  delete_comment(comment: Comment): void {
    this.databaseService.deleteComment(comment)
      .then( () => (this.comments = this.comments.filter( c => c !== comment)));
    this.getAllComments();
  }
  update_comment(comment: Comment): void {
    let updated_comment: string = prompt('Update comment!', comment.content);
    if (updated_comment != null) {
      updated_comment = updated_comment.trim();
      if (updated_comment === '' || updated_comment === comment.content) {
        return ;
      } else {
        this.databaseService.updateComment(comment, updated_comment);
        this.getComments();
        this.getAllComments();
      }
    } else {
      return ;
    }
  }
  gen_comment_id(): number {
    return this.all_comments.length > 0 ? Math.max(...this.all_comments.map(value => value.id)) + 1 : 0;
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
  get_authorname_of_comment(comment: Comment | number): string {
    const id = (typeof comment === 'number') ? comment : comment.id;
    const user = this.getUser(id);
    return user.name;
  }
  //
  back(): void {
    this.router.navigateByUrl('/articles');
  }
}
