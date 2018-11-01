import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, Article, Comment } from './dataclass';
import { Router } from '@angular/router';
import {errorHandler} from '@angular/platform-browser/src/browser';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  getArticles(): Promise<Article[]> {
    return this.http.get<Article[]>('api/articles/')
      .toPromise();
  }
  getArticle(article: Article | number): Promise<Article> {
    const id = ( typeof article === 'number' ) ? article : article.id;
    return this.http.get<Article>(`api/articles/${id}`)
      .toPromise()
      .catch(this.handleError);
  }
  getUsers(): Promise<User[]> {
    return this.http.get<User[]>(`api/user/`)
      .toPromise();
  }
  getUser(user: User | number): Promise<User> {
    const id = ( typeof user === 'number' ) ? user : user.id;
    return this.http.get<User>(`api/user/${id}`)
      .toPromise();
  }
  getComments(): Promise<Comment[]> {
    return this.http.get<Comment[]>(`api/comments/`)
      .toPromise();
  }
  getComment(comment: Comment | number): Promise<Comment> {
    const id = (typeof comment === 'number') ? comment : comment.id;
    return this.http.get<Comment>(`api/comments/${id}`)
      .toPromise();
  }
  getComments_for_article(article: Article | number): Promise<Comment[]> {
    const id = (typeof article === 'number') ? article : article.id;
    return this.getComments()
      .then( (comments: Comment[]) => comments.filter( (comment_for_article: Comment) => comment_for_article.article_id === id));
  }
  updateUser(user: User): Promise<User> {
    return this.http.put(`api/user/${user.id}`, user, httpOptions)
      .toPromise()
      .then(() => user);
  }
  createArticle(id: number, author_id: number, title: string, content: string): Promise<Article> {
    let article = new Article();
    article = {id, author_id, title, content};
    return this.http.post<Article>(`api/articles/`, article, httpOptions)
      .toPromise();
  }
  createComment(id: number, article_id: number, author_id: number, content: string): Promise<Comment> {
    let comment = new Comment();
    comment = {id, article_id, author_id, content};
    // 왜지?!!!!?!!?
    return this.http.post<Comment>(`api/comments/`, comment, httpOptions)
      .toPromise()
      .catch(this.handleError);
  }
  deleteComment(comment: Comment | number): Promise<Comment> {
    const id = (typeof comment === 'number') ? comment : comment.id;
    return this.http.delete<Comment>(`api/comments/${id}`, httpOptions)
      .toPromise()
      .catch(this.handleError);
  }
  deleteArticle(article: Article | number): Promise<Article> {
    const id = (typeof article === 'number') ? article : article.id;
    return this.http.delete<Article>(`api/articles/${id}`, httpOptions)
      .toPromise()
      .catch(this.handleError);
  }
  updateComment(comment: Comment, content: string): Promise<Comment> {
    const id = comment.id; const article_id = comment.article_id; const author_id = comment.author_id;
    let updated_comment = new Comment();
    updated_comment = {id, article_id, author_id, content};
    return this.http.put<Comment>(`api/comments/${id}`, updated_comment, httpOptions)
      .toPromise()
      .catch(this.handleError);
  }
  updateArticle(article: Article): Promise<Article> {
    return this.http.put<Article>(`api/articles/${article.id}`, article, httpOptions)
      .toPromise();
  }
  private handleError(error: any): Promise<any> {
    console.error(':(', error);
    return Promise.reject(error.message || error);
  }
}

