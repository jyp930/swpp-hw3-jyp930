from django.urls import path
from blog import views

urlpatterns = [
	path('signup/', views.signup, name='signup'),
	path('signin/', views.signin, name='signin'),
    path('signout/', views.signout, name='signout'),

    path('article/', views.articleList, name='article'),
    path('article/<int:pk>/', views.articleDetail, name='articleDetail'),
    
    path('article/<int:pk>/comment/', views.commentOfArticle, name='commentOfArticle'),
    path('comment/<int:pk>/', views.commentDetail, name='commentDetail'),

    path('token/', views.token, name='token'),
]