import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateArticleComponent } from './create-article.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {AuthorizedUserService} from '../authorized-user.service';
import {DatabaseService} from '../database.service';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({selector: 'app-sign-out', template: ''})
class SignOutStubComponent {}

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
  createArticle() {
    return Promise.resolve({ id: 1,  author_id: 1, title: 'The Past2', content: 'The Angular CLI2' });
  }
}

describe('CreateArticleComponent', () => {
  let component: CreateArticleComponent;
  let fixture: ComponentFixture<CreateArticleComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateArticleComponent,
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
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    //component.getUsers();
    //component.getArticles();
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

  it('test get_authorname func when authorized', () => {
    const mockservice = TestBed.get(AuthorizedUserService);
    mockservice.set(component.users[0]);
    const username = component.get_authorname();
    expect(username).toContain('Software');
  });

  it('test get_authorname func when unauthorized', () => {
    const username = component.get_authorname();
    expect(username).toContain('no');
  });

  it('test view_write_tab func', () => {
    expect(component.view_write_tab).toBeTruthy();
    component.view_write_tab();
    expect(document.getElementById('WriteTab').getAttribute('style')).toContain('""');
    expect(document.getElementById('write-tab-button').getAttribute('class')).toContain('Clicked');
    expect(document.getElementById('PreviewTab').getAttribute('style')).toContain('none');
    expect(document.getElementById('preview-tab-button').getAttribute('class')).toContain('unClicked');
  });

  it('test view_preview_tab func', () => {
    expect(component.view_preview_tab).toBeTruthy();
    component.view_preview_tab();
    expect(document.getElementById('WriteTab').getAttribute('style')).toContain('none');
    expect(document.getElementById('write-tab-button').getAttribute('class')).toContain('unClicked');
    expect(document.getElementById('PreviewTab').getAttribute('style')).toContain('""');
    expect(document.getElementById('preview-tab-button').getAttribute('class')).toContain('Clicked');
  });

  it('test create_article func when unauthorized', () => {
    component.create_article();
    const spy = routerSpy.navigateByUrl as jasmine.Spy;
    const navArgs = spy.calls.first().args[0];
    expect(navArgs).toBe('/sign_in',
      'should nav to sign_in page');
  });

  it('test create_article func when blank', () => {
    const mockservice = TestBed.get(AuthorizedUserService);
    component.users[0].signed_in = true;
    mockservice.set(component.users[0]);
    component.title = '';
    component.content = '';
    component.create_article();

    /*test url*/
  });

  it('test create_article func when authorized', () => {
    const mockservice = TestBed.get(AuthorizedUserService);
    component.users[0].signed_in = true;
    mockservice.set(component.users[0]);
    component.title = 'title1';
    component.content = 'cont1';
    component.create_article();

    const buttons = document.getElementsByTagName('button');
    expect(buttons.item(0).getAttribute('disabled')).toEqual('disabled');
    /*
    const spy = routerSpy.navigateByUrl as jasmine.Spy;
    const navArgs = spy.calls.first().args[0];
    expect(navArgs).toBe('/articles/1',
      'should nav to new_article detail page');*/
  });

  it('test gen_article_id func', () => {
    const newid = component.gen_article_id();
    expect(newid).toEqual(1);
  });

  it('test back fun', () => {
    component.back();
    expect(component.back).toBeTruthy();
    /*
    test url
     */
  });
});
