from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
import json

from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404
from .models import Article, Comment

@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])

#User View
def signup(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']

        user = User.objects.filter(username=username)
        if len(user) > 0:
            return HttpResponse(status=400)
        else:
            User.objects.create_user(username=username, password=password)
            return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['POST'])


def signin(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']

        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['POST'])


def signout(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            logout(request)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET'])


#Article View
def articleList(request):
    if request.method == 'GET' or request.method == 'POST':
        if request.user.is_authenticated:
            if request.method == 'GET':
                article_list = []
                for article in Article.objects.all():
                    article_list.append({'title': article.title, 'content': article.content, 'author': article.author.id})
                return JsonResponse(article_list, safe=False)

            else:
                req_data = json.loads(request.body.decode())
                title = req_data['title']
                content = req_data['content']

                new_article = Article(title=title, content=content, author=request.user)
                new_article.save()
                return HttpResponse(status=201)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])


def articleDetail(request, article_id):
    if request.method == 'GET' or request.method == 'PUT' or request.method == 'DELETE':
        if request.user.is_authenticated:
            article = get_object_or_404(Article, id = article_id)
            if request.method == 'GET':
                return JsonResponse({'title': article.title, 'content': article.content, 'author': article.author.id}, safe=False)
            else:
                if request.user.id == article.author.id:
                    if request.method == 'PUT':
                        req_data = json.loads(request.body.decode())
                        title = req_data['title']
                        content = req_data['content']

                        article.title = title
                        article.content = content
                        article.save()
                        return HttpResponse(status=200)
                    else:
                        article.delete()
                        return HttpResponse(status=200)
                else:
                    return HttpResponse(status=403)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])

#Comment View
def commentOfArticle(request, article_id):
    if request.method == 'GET' or request.method == 'POST':
        if request.user.is_authenticated:
            article = get_object_or_404(Article, id = article_id)
            if request.method == 'GET':
                comment_list = []
                for comment in Comment.objects.filter(article=article):
                    comment_list.append({'article': comment.article.id, 'content': comment.content, 'author': comment.author.id})
                return JsonResponse(comment_list, safe=False)

            else:
                req_data = json.loads(request.body.decode())
                content = req_data['content']

                new_comment = Comment(article=article, content=content, author=request.user)
                new_comment.save()
                return HttpResponse(status=201)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])


def commentDetail(request, comment_id):
    if request.method == 'GET' or request.method == 'PUT' or request.method == 'DELETE':
        if request.user.is_authenticated:
            comment = get_object_or_404(Comment, id = comment_id)
            if request.method == 'GET':
                return JsonResponse({'article': comment.article.id, 'content': comment.content, 'author': comment.author.id}, safe=False)
            else:
                if request.user.id == comment.author.id:
                    if request.method == 'PUT':
                        req_data = json.loads(request.body.decode())
                        content = req_data['content']

                        comment.content = content
                        comment.save()
                        return HttpResponse(status=200)
                    else:
                        comment.delete()
                        return HttpResponse(status=200)
                else:
                    return HttpResponse(status=403)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])