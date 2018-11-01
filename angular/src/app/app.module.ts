import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// Imports for loading & configuring the in-memory web api
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ArticlesComponent } from './articles/articles.component';
import { AppRoutingModule } from './/app-routing.module';
import { CreateArticleComponent } from './create-article/create-article.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { SignOutComponent } from './sign-out/sign-out.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    ArticlesComponent,
    CreateArticleComponent,
    ArticleDetailComponent,
    SignOutComponent,
    ArticleEditComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
