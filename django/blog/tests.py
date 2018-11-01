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

    def new_comment_for_article(self, client, pk, content):
        url = reverse('commentOfArticle', kwargs={'pk': pk})
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
        url = reverse('articleDetail', kwargs={'pk': 1})
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

        url = reverse('articleDetail', kwargs={'pk': 1})
        response = client.get(url)
        self.assertEqual(response.status_code, 404)

        url = reverse('articleDetail', kwargs={'pk': 2})
        response = client.get(url)
        self.assertEqual(response.status_code, 200)

        response = client.delete(url)
        self.assertEqual(response.status_code, 403)

        response = client.put(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 403)

    '''Test Comment'''
    def test_comment(self):
        client = Client()
        url = reverse('commentOfArticle', kwargs={'pk': 1})
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
        url = reverse('commentDetail', kwargs={'pk': 1})
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

        url = reverse('commentDetail', kwargs={'pk': 2})

        response = client.get(url)
        self.assertEqual(response.status_code, 200)

        data = json.dumps({'content': 'content22'})
        response = client.put(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 403)

        response = client.delete(url)
        self.assertEqual(response.status_code, 403)

"""
class BlogTestCase2(TestCase):

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

        response = client.post('/api/signin/', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 204)

    def signUp(self, client, id, pw):
        return client.post('/api/signup/', json.dumps({'username': id, 'password': pw}),
                               content_type='application/json')

    def signIn(self, client, id, pw):
        return client.post('/api/signin/', json.dumps({'username': id, 'password': pw}),
                               content_type='application/json')

    def signUpIn(self, client, id, pw):
        self.assertEqual(self.signUp(client, id, pw).status_code, 201)
        response = self.signIn(client, id, pw)
        self.assertEqual(response.status_code, 204)
        return response

    def signOut(self, client):
        return client.get('/api/signout/')

    def test_usertable_success(self):
        client = Client()
        id = "ABCD"
        pw = "EFGH"
        self.assertEqual(self.signUp(client, id, pw).status_code, 201)
        self.assertEqual(self.signIn(client, id, pw).status_code, 204)
        self.assertEqual(self.signOut(client).status_code, 204)

    def test_usertable_failure(self):
        client = Client()
        # 405 failure
        self.assertEqual(client.delete('/api/signup/').status_code, 405)
        self.assertEqual(client.delete('/api/signin/').status_code, 405)
        self.assertEqual(client.delete('/api/signout/').status_code, 405)
        self.assertEqual(client.delete('/api/token/').status_code, 405)
        # 401 failure
        self.assertEqual(self.signIn(client, 'wrongid', 'wrongpw').status_code, 401)
        self.assertEqual(self.signOut(client).status_code, 401)

    def test_articletable(self):
        client = Client()
        # 405 failure
        self.assertEqual(client.delete('/api/article/').status_code, 405)
        self.assertEqual(client.post('/api/article/1/').status_code, 405)
        # 401 failure
        self.assertEqual(client.get('/api/article/').status_code, 401)
        self.assertEqual(client.post('/api/article/').status_code, 401)
        self.assertEqual(client.get('/api/article/1/').status_code, 401)
        self.signUpIn(client, "AAAA", "BBBB")
        self.assertEqual(client.get('/api/article/').status_code, 200)
        # 404 failure
        self.assertEqual(client.get('/api/article/1/').status_code, 404)
        '''
        # 400 failure
        self.assertEqual(client.post('/api/article/', json.dumps({'title': 'my title'}),
                               content_type='application/json').status_code, 400)
        '''
        # POST and GET
        response = client.post('/api/article/', json.dumps({'title': 'my title', 'content': 'my content'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)

        # GET
        response = client.get('/api/article/1/')
        self.assertEqual(response.status_code, 200)
        payload = json.loads(response.content)
        self.assertEqual(payload['title'], 'my title')
        self.assertEqual(payload['content'], 'my content')
        self.assertEqual(payload['author'], 1)

        # PUT success
        self.assertEqual(client.put('/api/article/1/', json.dumps({'title': 'my new title', 'content': 'my new content'}),
                               content_type='application/json').status_code, 200)
        response = client.get('/api/article/1/')
        payload = json.loads(response.content)
        self.assertEqual(payload['title'], 'my new title')
        self.assertEqual(payload['content'], 'my new content')
        self.assertEqual(payload['author'], 1)

        # PUT & DELETE failure
        #self.assertEqual(client.put('/api/article/1/', json.dumps({'title': 'my new title'}),
        #                       content_type='application/json').status_code, 400)
        self.assertEqual(self.signOut(client).status_code, 204)
        self.signUpIn(client, "CCCC", "DDDD")
        self.assertEqual(client.put('/api/article/1/', json.dumps({'title': 'my new title', 'content': 'my new content'}),
                               content_type='application/json').status_code, 403)

        self.assertEqual(client.delete('/api/article/1/').status_code, 403)

        # DELETE success
        self.signIn(client, "AAAA", "BBBB")

        self.assertEqual(client.get('/api/article/1/').status_code, 200)
        self.assertEqual(client.delete('/api/article/1/').status_code, 200)
        self.assertEqual(client.get('/api/article/1/').status_code, 404)

    def test_comment(self):
        client = Client()

        # 405 failure
        self.assertEqual(client.post('/api/comment/1/').status_code, 405)

        # 401 failure
        self.assertEqual(client.get('/api/comment/1/').status_code, 401)

        self.signUpIn(client, "AAAA", "BBBB")

        # 404 failure
        self.assertEqual(client.get('/api/comment/1/').status_code, 404)

        # GET
        client.post('/api/article/', json.dumps({'title': 'my title', 'content': 'my content'}),
                               content_type='application/json')
        response = client.post('/api/article/1/comment/', json.dumps({'content': 'my comment'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)
        response = client.get('/api/comment/1/')
        self.assertEqual(response.status_code, 200)
        payload = json.loads(response.content)
        self.assertEqual(payload['article'], 1)
        self.assertEqual(payload['content'], 'my comment')
        self.assertEqual(payload['author'], 1)

        # PUT
        #self.assertEqual(client.put('/api/comment/1/', json.dumps({}), content_type='application/json').status_code, 400)
        response = client.put('/api/comment/1/', json.dumps({'content': 'new comment'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(client.get('/api/comment/1/').content)['content'], 'new comment')

        self.signUpIn(client, "CCCC", "DDDD")

        # PUT & DELETE 403 failure
        self.assertEqual(client.put('/api/comment/1/', json.dumps({'content': 'new comment'}),
                               content_type='application/json').status_code, 403)
        self.assertEqual(client.delete('/api/comment/1/').status_code, 403)

        # DELETE
        self.signIn(client, "AAAA", "BBBB")
        self.assertEqual(client.delete('/api/comment/1/').status_code, 200)

    def test_comment_list(self):
        client = Client()

        # 405 failure
        self.assertEqual(client.delete('/api/article/1/comment/').status_code, 405)

        # 401 failure
        self.assertEqual(client.get('/api/article/1/comment/').status_code, 401)

        self.signUpIn(client, "AAAA", "BBBB")

        # 404 failure
        self.assertEqual(client.get('/api/article/1/comment/').status_code, 404)

        client.post('/api/article/', json.dumps({'title': 'my title', 'content': 'my content'}),
                               content_type='application/json')

        # POST
        #self.assertEqual(client.post('/api/article/1/comment/', json.dumps({}),
        #                      content_type='application/json').status_code, 400)
        response = client.post('/api/article/1/comment/', json.dumps({'content': 'my comment'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)

        # GET
        response = client.get('/api/article/1/comment/')
        self.assertEqual(response.status_code, 200)
        payload = json.loads(response.content)
        self.assertEqual(payload[0]['content'], 'my comment')

    def test_delete_cascade(self):
        client = Client()

        self.signUpIn(client, "AAAA", "BBBB")
        client.post('/api/article/', json.dumps({'title': 'my title', 'content': 'my content'}),
                    content_type='application/json')
        client.post('/api/article/1/comment/', json.dumps({'content': 'my comment'}),
                    content_type='application/json')

        self.assertEqual(client.get('/api/comment/1/').status_code, 200)
        self.assertEqual(client.delete('/api/article/1/').status_code, 200)
        self.assertEqual(client.get('/api/comment/1/').status_code, 404)
"""
