import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignOutComponent } from './sign-out.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthorizedUserService } from '../authorized-user.service';


describe('SignOutComponent', () => {
  let component: SignOutComponent;
  let fixture: ComponentFixture<SignOutComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SignOutComponent,
      ],
      imports: [
        RouterTestingModule,
        HttpClientModule,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        AuthorizedUserService,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test sign_out func when unauthorized', () => {
    component.sign_out();
    const spy = routerSpy.navigateByUrl as jasmine.Spy;
    const navArgs = spy.calls.first().args[0];
    expect(navArgs).toBe('/sign_in',
      'should nav to sign_in page');
  });

  it('test sign_out func when authorized', () => {
    const mockservice = TestBed.get(AuthorizedUserService);
    const mockuser = { id: 1, email: 'swpp@snu.ac.kr', password: 'iluvswpp', name: 'Software Lover', signed_in: false };
    mockservice.set(mockuser);
    component.sign_out();
    const spy = routerSpy.navigateByUrl as jasmine.Spy;
    const navArgs = spy.calls.first().args[0];
    expect(navArgs).toBe('/sign_in',
      'should nav to sign_in page');
    expect(mockservice.is_authorized()).toEqual(false);
  });
});
