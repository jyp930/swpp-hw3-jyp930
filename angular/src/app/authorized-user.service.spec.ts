import { TestBed, inject } from '@angular/core/testing';

import { AuthorizedUserService } from './authorized-user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

const mockuser = { id: 1, email: 'swpp@snu.ac.kr', password: 'iluvswpp', name: 'Software Lover', signed_in: false };
const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

describe('AuthorizedUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        AuthorizedUserService,
      ]
    });
  });

  it('should be created', inject([AuthorizedUserService], (service: AuthorizedUserService) => {
    expect(service).toBeTruthy();
  }));

  it('test get_id function', inject([AuthorizedUserService], (service: AuthorizedUserService) => {
    service.set(mockuser);
    expect(service.get_id()).toEqual(1);
  }));

  it('test get_name function', inject([AuthorizedUserService], (service: AuthorizedUserService) => {
      service.set(mockuser);
      expect(service.get_name()).toEqual('Software Lover');
  }));

  it('test is_authorized function', inject([AuthorizedUserService], (service: AuthorizedUserService) => {
      service.set(mockuser);
      expect(service.is_authorized()).toEqual(true);
  }));

  it('test clear function', inject([AuthorizedUserService], (service: AuthorizedUserService) => {
      service.set(mockuser);
      service.clear();
      expect(service.authorized_user).toBeNull();
  }));

  it('test determine_abort function', inject([AuthorizedUserService], (service: AuthorizedUserService) => {
    service.set(null);
    service.determine_abort();
    const spy = routerSpy.navigateByUrl as jasmine.Spy;
    const navArgs = spy.calls.first().args[0];
    expect(navArgs).toBe('/sign_in',
      'should nav to sign_in page');
  }));
});
