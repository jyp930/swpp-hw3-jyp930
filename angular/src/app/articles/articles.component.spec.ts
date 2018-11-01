import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { ArticlesComponent } from './articles.component';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { AuthorizedUserService } from '../authorized-user.service';
import { DatabaseService } from '../database.service';

@Component({selector: 'app-sign-out', template: ''})
class SignOutStubComponent { }

class MockAuthService extends AuthorizedUserService {
  determine_abort() {
    return null;
  }
}
class MockDataService extends DatabaseService {
  getUsers() {
    return Promise.resolve([{ id: 1, email: 'swpp@snu.ac.kr', password: 'iluvswpp', name: 'Software Lover', signed_in: false }]);
  }
  getArticles() {
    return Promise.resolve([{ id: 0,  author_id: 1, title: 'The Past', content: 'The Angular CLI' }]);
  }
}
describe('ArticlesComponent', () => {
  let component: ArticlesComponent;
  let fixture: ComponentFixture<ArticlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ArticlesComponent,
        SignOutStubComponent,
      ],
      imports: [
        RouterTestingModule,
        HttpClientModule,
      ],
      providers: [
        { provide: AuthorizedUserService, useClass: MockAuthService },
        { provide: DatabaseService, useClass: MockDataService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.users = [
      {id: 1, email: 'swpp@snu.ac.kr', password: 'iluvswpp', name: 'Software Lover', signed_in: false}
    ];
    component.articles = [
      { id: 0,  author_id: 1, title: 'The Past', content: 'The Angular CLI' }
    ];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test getUser func when correct', () => {
    const user = component.getUser(1);
    expect(user.id).toEqual(1);
  });

  it('test getUser func when incorrect', () => {
    const user = component.getUser(2);
    expect(user.name).toContain('no');
  });

  it('test authorname_of_article func when author_id', () => {
    const username = component.get_authorname_of_article(1);
    expect(username).toEqual('Software Lover');
  });
  it('test authorname_of_article func when article', () => {
    const username = component.get_authorname_of_article(component.articles[0]);
    expect(username).toContain('no');
  });
});
