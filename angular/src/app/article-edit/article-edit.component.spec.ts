
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleEditComponent } from './article-edit.component';
import {Component} from '@angular/core';
import {AuthorizedUserService} from '../authorized-user.service';
import {DatabaseService} from '../database.service';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { convertToParamMap } from '@angular/router';

@Component({selector: 'app-sign-out', template: ''})
class SignOutStubComponent {}

class MockAuthService extends AuthorizedUserService {
  determine_abort() {
    return null;
  }
}
class MockDataService extends DatabaseService {
  getArticle() {
    return Promise.resolve({id: 0, author_id: 1, title: 'The Past', content: 'The Angular CLI'});
  }
  updateArticle() {
    return Promise.resolve({id: 0, author_id: 1, title: 'The Past', content: 'The Angular CLI'});
  }
}

describe('ArticleEditComponent', () => {
  let component: ArticleEditComponent;
  let fixture: ComponentFixture<ArticleEditComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ArticleEditComponent,
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
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test get_authorname func when authorized', () => {
    const mockservice = TestBed.get(AuthorizedUserService);
    mockservice.set({id: 1, email: 'swpp@snu.ac.kr', password: 'iluvswpp', name: 'Software Lover', signed_in: true});
    const username = component.get_authorname();
    expect(username).toContain('Software');
  });

  it('test get_authorname func when unauthorized', () => {
    spyOn(window.console, 'log');
    const mockservice = TestBed.get(AuthorizedUserService);
    mockservice.authorized_user = null;
    const username = component.get_authorname();
    expect(window.console.log).toHaveBeenCalled();
  });

  it('test view_write_tab func', () => {
    component.article = { id: 0,  author_id: 1, title: 'The Past', content: 'The Angular CLI' };
    fixture.detectChanges();
    component.view_write_tab();
    expect(component.view_write).toEqual(true);
    expect(document.getElementById('write-tab-button').getAttribute('class')).toContain('Clicked');
    expect(document.getElementById('preview-tab-button').getAttribute('class')).toContain('unClicked');
  });

  it('test view_preview_tab func', () => {
    component.article = { id: 0,  author_id: 1, title: 'The Past', content: 'The Angular CLI' };
    fixture.detectChanges();
    component.view_preview_tab();
    expect(component.view_write).toEqual(false);
    expect(document.getElementById('write-tab-button').getAttribute('class')).toContain('unClicked');
    expect(document.getElementById('preview-tab-button').getAttribute('class')).toContain('Clicked');
  });

  it('test confirm_edit_article func', () => {
    component.article = {id: 0, author_id: 1, title: 'The Past2', content: 'The Angular CLI2'};
    fixture.detectChanges();
    component.confirm_edit_article();

    const buttons = document.getElementsByTagName('button');
    expect(buttons.item(0).getAttribute('disabled')).toEqual('disabled');
  });

  it('test confirm_edit_article func when blank', () => {
    component.article = {id: 0, author_id: 1, title: '', content: ''};
    component.confirm_edit_article();
    /*
    test url
     */
  });

  it('test back func confirm no', () => {
    component.original_article = { id: 0,  author_id: 1, title: 'The Past', content: 'The Angular CLI' };
    component.article = {id: 0, author_id: 1, title: 'The Past2', content: 'The Angular CLI2'};
    fixture.detectChanges();
    spyOn(window, 'confirm').and.returnValue(false);
    expect(component.back()).toBeUndefined();
    /*
    test url
     */
  });

  it('test back func confirm yes', () => {
    component.original_article = { id: 0,  author_id: 1, title: 'The Past', content: 'The Angular CLI' };
    component.article = {id: 0, author_id: 1, title: 'The Past2', content: 'The Angular CLI2'};
    fixture.detectChanges();
    spyOn(window, 'confirm').and.returnValue(true);
    component.back();
    /*
    test url
     */
  });

  it('test back func confirm when unchanged', () => {
    component.original_article = { id: 0,  author_id: 1, title: 'The Past', content: 'The Angular CLI' };
    component.article = {id: 0, author_id: 1, title: 'The Past', content: 'The Angular CLI'};
    fixture.detectChanges();
    spyOn(window, 'confirm').and.returnValue(true);
    component.back();
    /*
    test url
     */
  });
});

