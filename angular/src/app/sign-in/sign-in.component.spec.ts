import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';

import { SignInComponent } from './sign-in.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthorizedUserService } from '../authorized-user.service';
import { DatabaseService } from '../database.service';

class MockAuthService extends AuthorizedUserService {}
class MockDataService extends DatabaseService {
  getUsers() {
    return Promise.resolve([{ id: 1, email: 'swpp@snu.ac.kr', password: 'iluvswpp', name: 'Software Lover', signed_in: false }]);
  }
  getArticles() {
    return Promise.resolve([{ id: 0,  author_id: 1, title: 'The Past', content: 'The Angular CLI' }]);
  }
  updateUser() {
    return Promise.resolve({ id: 1, email: 'swpp@snu.ac.kr', password: 'iluvswpp', name: 'Software Lover', signed_in: true });
  }
}
describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  const router = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInComponent ],
      imports: [
        RouterTestingModule,
        HttpClientModule,
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthorizedUserService, useClass: MockAuthService },
        { provide: DatabaseService, useClass: MockDataService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test isUser func when correct', () => {
    component.isUser('swpp@snu.ac.kr', 'iluvswpp');
    expect(component).toBeTruthy();
  });

  it('test isUser func when incorrect', () => {
    component.isUser('zz@naver.com', 'ffff');
    expect(component).toBeTruthy();
  });

  it('test set_signed_in func', () => {
    component.users = [
      {id: 1, email: 'swpp@snu.ac.kr', password: 'iluvswpp', name: 'Software Lover', signed_in: false},
      {id: 2, email: 'alan@turing.com', password: 'iluvswpp', name: 'Alan Turing', signed_in: false},
      {id: 3, email: 'edsger@dijkstra.com', password: 'iluvswpp', name: 'Edsger Dijkstra', signed_in: false}
    ];
    component.set_sigend_in('swpp@snu.ac.kr');
    expect(component.users[0].signed_in).toEqual(true);
    //expect(router.navigate).toHaveBeenCalledWith(['/articles']);
  });
});
