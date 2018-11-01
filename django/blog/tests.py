from django.test import TestCase, Client
import json

from django.urls import reverse
from django.contrib.auth.models import User
from .models import Article, Comment

'''Test Model'''
class BlogModelTestCase(TestCase):
    def setUp(self):
        User.objects.create(id=1, username='user1', password='pw1')

    def test_article_model(self):
        user = User.objects.get(id=1)

        Article.objects.create(id=1, title='hi', content='hello', author=user)
        article = Article.objects.get(id=1)

        self.assertEqual(str(article), 'id: '+str(article.id)+' title:'+ article.title )     

    def test_comment_model(self):
        user = User.objects.get(id=1)

        Article.objects.create(id=1, title='hi', content='hello', author=user)
        article = Article.objects.get(id=1)

        Comment.objects.create(id=1, article=article, content='ct1', author=user)
        comment = Comment.objects.get(id=1)
        self.assertEqual(str(comment), 'id: '+str(comment.id)+' title:'+ comment.content )

'''Test View'''
class BlogTestCase(TestCase):
    def test_csrf(self):
        # By default, csrf checks are disabled in test client
        # To test csrf protection we enforce csrf checks here
        client = Client(enforce_csrf_checks=True)
        response = client.post('/api/signup/', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 403)  # Request without csrf token returns 403 response

        response = client.get('/api/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie

        response = client.post('/api/signup/', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)  # Pass csrf protection

    def test_token(self):
        client = Client()
        url = reverse('token')
        response = client.get(url)
        self.assertEqual(response.status_code, 204)

        response = client.delete(url)
        self.assertEqual(response.status_code, 405)

    '''useful functions'''
    def new_sign_up_in(self, client, username, password):
        url = reverse('signup')
        data = json.dumps({'username': username, 'password': password})
        response = client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        url = reverse('signin')
        response = client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 204)
        return response

    def new_article(self, client, title, content):
        url = reverse('article')
        data = json.dumps({'title': title, 'content': content})
        response = client.post(url, data, content_type='application/json')
        return response

    def new_comment_for_article(self, client, article_id, content):
        url = reverse('commentOfArticle', kwargs={'article_id': article_id})
        data = json.dumps({'content': content})
        response = client.post(url, data, content_type='application/json')
        return response

    '''Test User'''
    def test_signup(self):
        client = Client()
        url = reverse('signup')
        data = json.dumps({'username': 'user1', 'password': 'user1'})
        response = client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 201)

        response = client.post(url, data,  content_type='application/json')
        self.assertEqual(response.status_code, 400)

        response = client.get(url)
        self.assertEqual(response.status_code, 405)


    def test_signin(self):
        client = Client()
        url = reverse('signup')
        data = json.dumps({'username': 'user1', 'password': 'user1'})
        response = client.post(url, data, content_type='application/json') #signup user

        url = reverse('signin')
        response = client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 204)

        data = json.dumps({'username': 'wrong', 'password': 'wrong'})
        response = client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 401)

        response = client.delete(url)
        self.assertEqual(response.status_code, 405)


    def test_signout(self):
        client = Client()
        self.new_sign_up_in(client, 'user1', 'user1')

        url = reverse('signout')
        response = client.delete(url)
        self.assertEqual(response.status_code, 405)

        response = client.get(url)
        self.assertEqual(response.status_code, 204)

        response = client.get(url)
        self.assertEqual(response.status_code, 401)

    '''Test Article'''
    def test_article(self):
        client = Client()
        url = reverse('article')
        data = json.dumps({'title': 'title1', 'content': 'content1'})
        response = client.delete(url)
        self.assertEqual(response.status_code, 405)

        response = client.put(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 405)

        response = client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 401)

        response = client.get(url)
        self.assertEqual(response.status_code, 401)

        self.new_sign_up_in(client, 'user1', 'user1') #sign in and up

        response = client.get(url)
        self.assertEqual(response.status_code, 200)

        response = client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 201)

        response = client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 201)

        response = client.get(url)
        self.assertEqual(response.status_code, 200)

        response = client.delete(url)
        self.assertEqual(response.status_code, 405)

        response = client.put(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 405)


    def test_article_detail(self):
        client = Client()
        url = reverse('articleDetail', kwargs={'article_id': 1})
        data = json.dumps({'title': 'title1', 'content': 'content1'})

        response = client.put(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response = client.get(url)
        self.assertEqual(response.status_code, 401)
        response = client.delete(url)
        self.assertEqual(response.status_code, 401)

        self.new_sign_up_in(client, 'user1', 'user1') #sign in and up

        response = client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 405)

        response = client.get(url)
        self.assertEqual(response.status_code, 404)

        response = client.put(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = client.delete(url)
        self.assertEqual(response.status_code, 404)

        self.new_article(client, 'article1', 'article1') #create article

        response = client.get(url)
        self.assertEqual(response.status_code, 200)

        data = json.dumps({'title': 'title2', 'content': 'content2'})
        response = client.put(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 405)

        response = client.delete(url)
        self.assertEqual(response.status_code, 200)

        response = client.delete(url)
        self.assertEqual(response.status_code, 404)

        self.new_article(client, 'article2', 'article2') #create article

        url = reverse('signout')
        response = client.get(url)
        self.new_sign_up_in(client, 'user2', 'user2') #new sign in and up

        url = reverse('articleDetail', kwargs={'article_id': 1})
        response = client.get(url)
        self.assertEqual(response.status_code, 404)

        url = reverse('articleDetail', kwargs={'article_id': 2})
        response = client.get(url)
        self.assertEqual(response.status_code, 200)

        response = client.delete(url)
        self.assertEqual(response.status_code, 403)

        response = client.put(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 403)

    '''Test Comment'''
    def test_comment(self):
        client = Client()
        url = reverse('commentOfArticle', kwargs={'article_id': 1})
        data = json.dumps({'content': 'content1'})
        response = client.delete(url)
        self.assertEqual(response.status_code, 405)

        response = client.get(url)
        self.assertEqual(response.status_code, 401)

        self.new_sign_up_in(client, 'user1', 'user1') #sign in and up

        response = client.get(url)
        self.assertEqual(response.status_code, 404)

        self.new_article(client, 'article1', 'article1')
        self.new_comment_for_article(client, 1, 'comment1')

        response = client.get(url)
        self.assertEqual(response.status_code, 200)

        response = client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 201)


    def test_comment_detail(self):
        client = Client()
        url = reverse('commentDetail', kwargs={'comment_id': 1})
        data = json.dumps({'content': 'content1'})
        response = client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 405)

        response = client.get(url)
        self.assertEqual(response.status_code, 401)

        self.new_sign_up_in(client, 'user1', 'user1') #sign in and up

        response = client.get(url)
        self.assertEqual(response.status_code, 404)

        self.new_article(client, 'article1', 'article1')
        self.new_comment_for_article(client, 1, 'comment1')
        self.new_comment_for_article(client, 1, 'comment2')

        response = client.get(url)
        self.assertEqual(response.status_code, 200)

        data = json.dumps({'content': 'content11'})
        response = client.put(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = client.delete(url)
        self.assertEqual(response.status_code, 200)


        self.new_sign_up_in(client, 'user2', 'user2') #new sign in and up

        url = reverse('commentDetail', kwargs={'comment_id': 2})

        response = client.get(url)
        self.assertEqual(response.status_code, 200)

        data = json.dumps({'content': 'content22'})
        response = client.put(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 403)

        response = client.delete(url)
        self.assertEqual(response.status_code, 403)