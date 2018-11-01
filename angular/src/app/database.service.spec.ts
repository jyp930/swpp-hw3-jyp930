import { TestBed, inject } from '@angular/core/testing';

import { DatabaseService } from './database.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

const article = { id: 0,  author_id: 1, title: 'The Past.', content: 'The Angular CLI' };
const comment = { id: 0,  article_id: 0,  author_id: 1, content: 'Wow!' };
const user = { id: 1, email: 'swpp@snu.ac.kr', password: 'iluvswpp', name: 'Software Lover', signed_in: false };

  describe('DatabaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [DatabaseService]
    });
  });

  it('should be created', inject([DatabaseService], (service: DatabaseService) => {
    expect(service).toBeTruthy();
  }));

  it('test getArticles func', inject([DatabaseService], (service: DatabaseService) => {
    expect(service.getArticles()).toBeTruthy();
  }));

  it('test getArticle func', inject([DatabaseService], (service: DatabaseService) => {
    expect(service.getArticle(article)).toBeTruthy();
  }));

  it('test getUsers func', inject([DatabaseService], (service: DatabaseService) => {
    expect(service.getUsers()).toBeTruthy();
  }));

  it('test getUser func', inject([DatabaseService], (service: DatabaseService) => {
    expect(service.getUser(user)).toBeTruthy();
  }));

    it('test getComments func', inject([DatabaseService], (service: DatabaseService) => {
      expect(service.getComments()).toBeTruthy();
    }));

    it('test getComment func', inject([DatabaseService], (service: DatabaseService) => {
      expect(service.getComment(comment)).toBeTruthy();
    }));

    it('test getComments_for_article func', inject([DatabaseService], (service: DatabaseService) => {
      expect(service.getComments_for_article(article)).toBeTruthy();
    }));

    it('test updateUser func', inject([DatabaseService], (service: DatabaseService) => {
      expect(service.updateUser(user)).toBeTruthy();
    }));

    it('test createArticle func', inject([DatabaseService], (service: DatabaseService) => {
      expect(service.createArticle(2, 1, 'title', 'con')).toBeTruthy();
    }));

    it('test createComment func', inject([DatabaseService], (service: DatabaseService) => {
      expect(service.createComment(2, 1, 1, 'con')).toBeTruthy();
    }));

    it('test deleteComment func', inject([DatabaseService], (service: DatabaseService) => {
      expect(service.deleteComment(comment)).toBeTruthy();
    }));

    it('test deleteArticle func', inject([DatabaseService], (service: DatabaseService) => {
      expect(service.deleteArticle(article)).toBeTruthy();
    }));

    it('test updateComment func', inject([DatabaseService], (service: DatabaseService) => {
      expect(service.updateComment(comment, 'con2')).toBeTruthy();
    }));

    it('test updateArticle func', inject([DatabaseService], (service: DatabaseService) => {
      expect(service.updateArticle(article)).toBeTruthy();
    }));
});
