import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { SignInComponent } from './sign-in/sign-in.component';
import { ArticlesComponent } from './articles/articles.component';
import { CreateArticleComponent } from './create-article/create-article.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';

const routes: Routes = [
  { path: 'sign_in', component: SignInComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'articles/create', component: CreateArticleComponent },
  { path: 'articles/:id', component: ArticleDetailComponent },
  { path: 'articles/:id/edit', component: ArticleEditComponent},
  { path: '**', redirectTo: '/sign_in'},
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
