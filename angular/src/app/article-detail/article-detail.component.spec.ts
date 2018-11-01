import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ArticleDetailComponent } from './article-detail.component';
import {Component} from '@angular/core';
import {AuthorizedUserService} from '../authorized-user.service';
import {DatabaseService} from '../database.service';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';


@Component({selector: 'app-sign-out', template: ''})
class SignOutStubComponent {}

class MockAuthService extends AuthorizedUserService {
  determine_abort() { }
}
class MockDataService extends DatabaseService {
  getArticle() {
    return Promise.resolve({id: 0, author_id: 1, title: 'The Past', content: 'The Angular CLI'});
  }
  getUsers() {
    return Promise.resolve([{ id: 1, email: 'swpp@snu.ac.kr', password: 'iluvswpp', name: 'Software Lover', signed_in: false }]);
  }
  getComments_for_article() {
    return Promise.resolve([{ id: 0,  article_id: 0,  author_id: 1, content: 'Wow!' }]);
  }
  getComments() {
    return Promise.resolve([{ id: 0,  article_id: 0,  author_id: 1, content: 'Wow!' }]);
  }
  deleteArticle() {
    return Promise.resolve({id: 0, author_id: 0, title: 'deleted', content: 'deleted'});
  }
  deleteComment() {
    return Promise.resolve({ id: 0,  article_id: 0,  author_id: 1, content: 'deleted' });
  }
  createComment() {
    return  Promise.resolve({ id: 0,  article_id: 0,  author_id: 1, content: 'deleted' });
  }
  updateComment() {
    return  Promise.resolve({ id: 0,  article_id: 0,  author_id: 1, content: 'updated' });
  }
}

describe('ArticleDetailComponent', () => {
  let component: ArticleDetailComponent;
  let fixture: ComponentFixture<ArticleDetailComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ArticleDetailComponent,
        SignOutStubComponent,
      ],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        FormsModule,
      ],
      providers: [
        { provide: AuthorizedUserService, useClass: MockAuthService },
        { provide: DatabaseService, useClass: MockDataService },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                id: '1'
              })
            }
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test get_authorizeduser_id func when authorized', () => {
    const mockservice = TestBed.get(AuthorizedUserService);
    mockservice.set({id: 1, email: 'swpp@snu.ac.kr', password: 'iluvswpp', name: 'Software Lover', signed_in: true});
    component.get_authorizeduser_id();
    expect(component.authoried_user).toEqual(1);
  });

  it('test get_authorizeduser_id func when unauthorized', () => {
    const mockservice = TestBed.get(AuthorizedUserService);
    component.get_authorizeduser_id();
    expect(component.authoried_user).toBeUndefined();
  });

  it('test delete_article func', () => {
    const mockdataservice = TestBed.get(DatabaseService);
    component.article = {id: 0, author_id: 1, title: 'The Past', content: 'The Angular CLI'};
    component.comments = [{ id: 0,  article_id: 0,  author_id: 1, content: 'Wow!' }];
    fixture.detectChanges();
    component.delete_article();
    const buttons = document.getElementsByTagName('button');
    expect(buttons.item(0).getAttribute('disabled')).toEqual('disabled');
  });

  it('test create_comment func when blank', () => {
    const mockdataservice = TestBed.get(DatabaseService);
    component.article = {id: 0, author_id: 1, title: 'The Past', content: 'The Angular CLI'};
    component.all_comments = [{ id: 0,  article_id: 0,  author_id: 1, content: 'Wow!' }];
    component.comment_content = '';

    fixture.detectChanges();
    component.create_comment();
    const buttons = document.getElementById('confirm-create-comment-button');
    expect(buttons.getAttribute('disabled')).toBeNull();
  });

  it('test create_comment func when not blank', fakeAsync(() => {
    const mockdataservice = TestBed.get(DatabaseService);
    const mockauthservice = TestBed.get(AuthorizedUserService);
    mockauthservice.set({id: 1, email: 'swpp@snu.ac.kr', password: 'iluvswpp', name: 'Software Lover', signed_in: true});
    component.article = {id: 0, author_id: 1, title: 'The Past', content: 'The Angular CLI'};
    component.all_comments = [{ id: 0,  article_id: 0,  author_id: 1, content: 'Wow!' }];
    component.comments = [];
    component.comment_content = 'create!!';
    fixture.detectChanges();
    component.create_comment();
    tick(1000);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component).toBeTruthy();
    });
  }));
  it('test gen_comment_id func', () => {
    component.all_comments = [{ id: 0,  article_id: 0,  author_id: 1, content: 'Wow!' }];
    fixture.detectChanges();
    const id = component.gen_comment_id();
    expect(id).toEqual(1);
  });

  it('test getUser func when exist', () => {
    component.users = [{ id: 1, email: 'swpp@snu.ac.kr', password: 'iluvswpp', name: 'Software Lover', signed_in: false }];
    const user = component.getUser(1);
    expect(user.name).toContain('Software');
  });

  it('test getUser func when not exist', () => {
    component.users = [{ id: 1, email: 'swpp@snu.ac.kr', password: 'iluvswpp', name: 'Software Lover', signed_in: false }];
    const user = component.getUser(2);
    expect(user.name).toContain('no');
  });

  it('test get_authorname_of_article func', () => {
    component.users = [{ id: 1, email: 'swpp@snu.ac.kr', password: 'iluvswpp', name: 'Software Lover', signed_in: false }];
    const username = component.get_authorname_of_article(1);
    expect(username).toContain('Software');
  });

  it('test get_authorname_of_comment func', () => {
    component.users = [{ id: 1, email: 'swpp@snu.ac.kr', password: 'iluvswpp', name: 'Software Lover', signed_in: false }];
    const username = component.get_authorname_of_comment(1);
    expect(username).toContain('Software');
  });

  it('test back func', () => {
    component.back();
    expect(component.back).toBeTruthy();
  });

  it('test delete_comment func', () => {
    const mockdataservice = TestBed.get(DatabaseService);
    component.delete_comment({ id: 0,  article_id: 0,  author_id: 1, content: 'Wow!' });
  });

  it('test update_comment func', () => {
    spyOn(window, 'prompt').and.returnValue('');
    component.update_comment({ id: 0,  article_id: 0,  author_id: 1, content: 'Wow!' });
  });

  it('test update_comment func 2', () => {
    spyOn(window, 'prompt').and.returnValue(null);
    component.update_comment({ id: 0,  article_id: 0,  author_id: 1, content: 'Wow!' });
  });

  it('test update_comment func 3', () => {
    spyOn(window, 'prompt').and.returnValue('update!');
    component.update_comment({ id: 0,  article_id: 0,  author_id: 1, content: 'Wow!' });
  });
});
