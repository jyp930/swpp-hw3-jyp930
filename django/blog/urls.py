from django.urls import path
from blog import views

urlpatterns = [
	path('signup/', views.signup, name='signup'),
	path('signin/', views.signin, name='signin'),
    path('signout/', views.signout, name='signout'),

    path('article/', views.articleList, name='article'),
    path('article/<int:article_id>/', views.articleDetail, name='articleDetail'),
    
    path('article/<int:article_id>/comment/', views.commentOfArticle, name='commentOfArticle'),
    path('comment/<int:comment_id>/', views.commentDetail, name='commentDetail'),

    path('token/', views.token, name='token'),
]