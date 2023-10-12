from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('ourexpertise/', views.ourexpertise, name='ourexpertise'),
    path('contactus/', views.contactus, name='contactus'),
    path('faq/', views.faq, name='faq'),
    path('animation/', views.animation, name='animation'),
    path('usps/', views.usps, name='usps'),
    path('about1/', views.about1, name='about1'),
    path('navbar/', views.navbar, name='navbar'),
    path('base/', views.base, name='base'),
    path('home/', views.home, name='home'),
    path('createtechuman/', views.createtechuman, name='createtechuman'),
    path('about2/', views.about2, name='about2'),
    path('about3/', views.about2, name='about3'),
    path('login/', views.login, name='login'),
     path('signup/', views.signup, name='signup'),

  #  path('login_view/', views.login_view, name='login_view'),
    path('success/', views.success, name='success'),
     path('new/', views.new, name='new'),
]

